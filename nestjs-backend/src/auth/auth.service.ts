import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { LoginDto, AuthResponseDto, JwtPayloadDto, ResetPasswordDto, CreateUserDto, RegisterUserDto, RegisterUserResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: AuthResponseDto; token: string }> {

    const { mail, pwd } = loginDto;

    // Find user by email
    const user = await this.databaseService.users.findFirst({
      where: { email: mail },
    });

    if (!user) {
      throw new UnauthorizedException(
        "User doesn't exist."
      );
    }

    if (!user.password) {
      console.log("password")
      throw new UnauthorizedException('The password is incorrect');
    }

    // Verify password
    const isPasswordValid = await compare(pwd, user.password);
    if (!isPasswordValid) {
      console.log("isPasswordValid")
      throw new UnauthorizedException('The password is incorrect');
    }

    return this.generateAuthResponse(user);
  }

  async impersonate(email: string, impersonatorUser: any): Promise<{ user: AuthResponseDto; token: string }> {
    // Check if impersonator is superadmin
    if (impersonatorUser.role !== 1) {
      throw new UnauthorizedException('Only superadmins can impersonate other users');
    }

    // Find user to impersonate by email
    const user = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("User doesn't exist.");
    }

    return this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: any): Promise<{ user: AuthResponseDto; token: string }> {
    // Get tournaments admin
    const tournamentsAdmin = await this.databaseService.tournament_admins.findMany({
      select: { tournamentId: true },
      where: { userId: user.id },
    });

    // Get tournaments registered
    const tournamentsRegistered = await this.databaseService.tournament_registration.findMany({
      select: { tournamentId: true },
      where: { userId: BigInt(user.id) },
    });

    // Create JWT payload
    const payload: JwtPayloadDto = {
      mail: user.email!,
      name: user.first_name!,
      role: user.role_id || 3, // Default to player role if not set
      id: user.id.toString(),
      tournamentsAdmin: tournamentsAdmin.map(t => Number(t.tournamentId)),
      tournamentsRegistered: tournamentsRegistered.map(t => Number(t.tournamentId)),
    };

    // Generate JWT token
    const token = this.jwtService.sign(payload, {
      expiresIn: '60d',
    });

    // Prepare response
    const authResponse: AuthResponseDto = {
      name: user.first_name!,
      email: user.email!,
      id: user.id.toString(),
      role: user.role_id || 3, // Default to player role if not set
      tournaments: tournamentsRegistered.map(t => Number(t.tournamentId)),
    };

    return { user: authResponse, token };
  }

  async validateUser(payload: JwtPayloadDto): Promise<JwtPayloadDto | null> {
    // Additional validation can be added here if needed
    // For now, we trust the JWT payload if it's valid
    return payload;
  }

  async resetPasswordRequest(mail: string): Promise<{ success: boolean }> {
    const user = await this.databaseService.users.findFirst({
      select: { id: true, first_name: true, email: true },
      where: { email: mail },
    });

    if (!user) {
      return { success: false };
    }

    // Generate hash for password reset (implement your hash generation logic)
    const hash = this.generateHash(mail);

    // Send email logic would go here
    // const mailOutput = await sendEmail(mail, user.first_name, `${getUrl()}/reset-password/${hash}`);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const decrypted = this.decryptHash(token);
      const values = decrypted.split('#');
      const mail = values[0];

      const hashedPassword = await hash(newPassword, 12);

      await this.databaseService.users.update({
        where: { email: mail },
        data: { password: hashedPassword },
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      throw new BadRequestException('Invalid reset token');
    }
  }

  private generateHash(mail: string): string {
    // Implement your hash generation logic here
    // This should match your existing implementation
    const timestamp = Date.now();
    const data = `${mail}#${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  private decryptHash(hash: string): string {
    // Implement your hash decryption logic here
    // This should match your existing implementation
    const buff = Buffer.from(hash, 'base64');
    return buff.toString('ascii');
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ success: boolean; user?: AuthResponseDto }> {
    const { email, password, playdek_name, first_name, last_name, role_id } = createUserDto;

    // Check if user already exists
    const existingUser = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user
    const newUser = await this.databaseService.users.create({
      data: {
        email,
        password: hashedPassword,
        playdek_name: playdek_name,
        first_name: first_name,
        last_name: last_name,
        role_id: role_id || 3, // Default to player role
      },
    });

    // Prepare response
    const userResponse: AuthResponseDto = {
      name: newUser.first_name!,
      email: newUser.email!,
      id: newUser.id.toString(),
      role: newUser.role_id || 3,
      tournaments: [],
    };

    return { success: true, user: userResponse };
  }

  async registerUser(registerDto: RegisterUserDto): Promise<RegisterUserResponse> {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      playdek_name,
      countryId,
      cityId,
      phoneNumber,
      preferredGamingPlatform,
      preferredGameDuration
    } = registerDto;

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with provided fields and defaults for missing required fields
    const newUser = await this.databaseService.users.create({
      data: {
        email,
        password: hashedPassword,
        playdek_name: playdek_name,
        first_name: firstName,
        last_name: lastName,
        role_id: 3, // Default to player role
        created_at: new Date(),
        updated_at: new Date(),
        // Use provided fields or defaults
        country_id: countryId ? BigInt(countryId) : null,
        city_id: cityId ? BigInt(cityId) : null,
        phone_number: phoneNumber || null,
        preferred_gaming_platform: preferredGamingPlatform || null,
        preferred_game_duration: preferredGameDuration || null,
        // Defaults for other required fields
        timezone_id: null,
        last_login_at: null,
      },
    });

    // Prepare response
    const userResponse: AuthResponseDto = {
      name: firstName,
      email: newUser.email!,
      id: newUser.id.toString(),
      role: newUser.role_id || 3,
      tournaments: [],
    };

    return {
      success: true,
      message: 'User registered successfully',
      user: userResponse
    };
  }
}
