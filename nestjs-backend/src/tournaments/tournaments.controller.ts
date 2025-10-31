import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import {
  GetTournamentsQueryDto,
  TournamentDto,
  RegisteredPlayerDto,
  CreateTournamentDto,
  UpdateTournamentDto
} from './dto/tournament.dto';
import { Public, CurrentUser } from '../auth/decorators/auth.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayloadDto } from '../auth/dto/auth.dto';

@Controller('tournaments')
@UseGuards(JwtAuthGuard)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  async getTournaments(@Query() query: GetTournamentsQueryDto, @CurrentUser() user: JwtPayloadDto) {
    try {
      const { id, status, players } = query;

      // Get registered players for a tournament
      if (typeof id === "string" && players === "true") {
        const registeredPlayers: RegisteredPlayerDto[] = await this.tournamentsService.getRegisteredPlayers(
          Number(id),
          user.role,
          user.mail
        );
        return registeredPlayers;
      }

      // Get tournaments by ID(s)
      if (typeof id === "string") {
        console.log("(userId, tournamentId) ", id);
        const tournaments: TournamentDto[] = await this.tournamentsService.getTournamentsById(id.split(','));
        return tournaments;
      }

      // Get tournaments by status(es)
      if (typeof status === "string") {
        const tournaments: TournamentDto[] = await this.tournamentsService.getTournamentsByStatus(status.split(','));
        return tournaments;
      }

      // If no specific query parameters, return empty array or all tournaments
      return [];
      
    } catch (error) {
      console.error("TOURNAMENT GET API Error:", error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /api/tournaments - Update tournament status or register user
  @Post()
  async updateTournamentOrRegister(@Body() body: any) {
    try {
      const { id, status, userEmail } = body;

      if (id && userEmail) {
        // Register user for tournament
        const registered = await this.tournamentsService.registerForTournament(Number(id), userEmail);
        return registered;
      }

      if (id && status) {
        // Update tournament status
        const updated = await this.tournamentsService.updateTournament(Number(id), Number(status));
        return updated;
      }

      throw new HttpException('Missing required parameters', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error("TOURNAMENT POST API Error:", error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PUT /api/tournaments - Update tournament details
  @Put()
  async updateTournamentFull(@Body() body: UpdateTournamentDto) {
    try {
      const { id, tournamentName, status, startingDate, description } = body;

      if (!id) {
        throw new HttpException('Missing tournament ID', HttpStatus.BAD_REQUEST);
      }

      const updateData: any = {};
      if (tournamentName) updateData.tournamentName = tournamentName;
      if (status) updateData.status = status;
      if (startingDate) updateData.startingDate = new Date(startingDate);
      if (description !== undefined) updateData.description = description;

      const updated = await this.tournamentsService.updateTournamentFull(Number(id), updateData);
      return updated;
    } catch (error) {
      console.error("TOURNAMENT PUT API Error:", error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // PATCH /api/tournaments - Create new tournament
  @Patch()
  async createTournament(@Body() body: CreateTournamentDto) {
    try {
      const { tournamentName, status, admins, startingDate, description } = body;

      if (!tournamentName || !status) {
        throw new HttpException('Missing name or status in request body', HttpStatus.BAD_REQUEST);
      }

      const startingDateFormatted = startingDate ? new Date(startingDate) : undefined;
      const created = await this.tournamentsService.createTournament({
        tournamentName,
        status,
        admins: admins ? Number(admins) : undefined,
        startingDate: startingDateFormatted,
        description
      });
      return created;
    } catch (error) {
      console.error("TOURNAMENT PATCH API Error:", error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /api/tournaments/:id - Delete tournament
  @Delete(':id')
  async deleteTournament(@Param('id') id: string) {
    try {
      if (!id) {
        throw new HttpException('Invalid or missing ID', HttpStatus.BAD_REQUEST);
      }

      const removed = await this.tournamentsService.deleteTournament(id);
      return { id: removed.id };
    } catch (error) {
      console.error("TOURNAMENT DELETE API Error:", error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'tournaments',
      timestamp: new Date().toISOString(),
    };
  }
}
