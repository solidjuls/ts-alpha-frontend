import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TournamentDto, RegisteredPlayerDto } from './dto/tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTournamentsByStatus(statusArray: string[]): Promise<TournamentDto[]> {
    const filter = statusArray.length > 0
      ? {
          where: {
            status_id: {
              in: statusArray.map(Number)
            }
          },
        }
      : undefined;

    const tournaments = await this.databaseService.tournaments.findMany({
      select: {
        id: true,
        tournament_name: true,
        status_id: true,
        starting_date: true,
        description: true,
        created_at: true,
        updated_at: true,
        tournament_admins: {
          select: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true
              }
            }
          }
        }
      },
      ...filter,
      orderBy: {
        created_at: "desc",
      },
    });

    return tournaments.map(item => ({
      id: item.id.toString(),
      tournament_name: item.tournament_name,
      status_id: item.status_id,
      starting_date: item.starting_date,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at,
      adminId: item.tournament_admins?.map(admin => admin.users.id.toString()) || [],
      adminName: item.tournament_admins?.map(admin => `${admin.users.first_name} ${admin.users.last_name}`) || []
    }));
  }

  async getTournamentsById(ids: string[]): Promise<TournamentDto[]> {
    const tournaments = await this.databaseService.tournaments.findMany({
      select: {
        id: true,
        tournament_name: true,
        status_id: true,
        description: true,
        starting_date: true,
        created_at: true,
        updated_at: true,
        tournament_admins: {
          select: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true
              }
            }
          }
        }
      },
      where: {
        id: {
          in: ids.map(Number),
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return tournaments.map(item => ({
      id: item.id.toString(),
      tournament_name: item.tournament_name,
      description: item.description,
      status_id: item.status_id,
      starting_date: item.starting_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      adminId: item.tournament_admins?.map(admin => admin.users.id.toString()) || [],
      adminName: item.tournament_admins?.map(admin => `${admin.users.first_name} ${admin.users.last_name}`) || []
    }));
  }

  async getRegisteredPlayers(
    tournamentId: number,
    userRole?: number,
    userEmail?: string
  ): Promise<RegisteredPlayerDto[]> {
    const registrations = await this.databaseService.tournament_registration.findMany({
      where: {
        tournamentId: tournamentId,
      },
      select: {
        id: true,
        userId: true,
        status: true,
        created_at: true,
        users: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            countries: {
              select: {
                tld_code: true,
              },
            },
          },
        },
      }
    });

    // Check if user is admin (global admin or tournament admin)
    const isAdmin = await this.isUserAdminForTournament(userRole, userEmail, tournamentId);

    // Map registration data with user data
    return registrations.map(registration => {
      const user = registration.users;
      return {
        registrationId: registration.id,
        email: isAdmin ? (user?.email || '') : '', // Only include email for admins
        status: registration.status || '',
        registeredAt: registration.created_at || new Date(),
        userId: user?.id?.toString(),
        name: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
        countryCode: user?.countries?.tld_code,
      };
    });
  }

  private async isUserAdminForTournament(userRole?: number, userEmail?: string, tournamentId?: number): Promise<boolean> {
    // Check if user is global admin (SUPERADMIN = 1 or ADMIN = 2)
    if (userRole === 1 || userRole === 2) {
      return true;
    }

    // Check if user is tournament-specific admin
    if (userEmail && tournamentId) {
      try {
        const user = await this.databaseService.users.findFirst({
          where: { email: userEmail },
          select: { id: true },
        });

        if (!user) {
          return false;
        }

        const adminRecord = await this.databaseService.tournament_admins.findFirst({
          where: {
            userId: user.id,
            tournamentId: tournamentId,
          },
        });

        return !!adminRecord;
      } catch (error) {
        console.error('Error checking tournament admin:', error);
        return false;
      }
    }

    return false;
  }

  async createTournament(tournamentData: {
    tournamentName: string;
    status: number;
    admins?: number;
    startingDate?: Date;
    description?: string;
  }): Promise<any> {
    const { tournamentName, status, admins, startingDate, description } = tournamentData;

    // Create the tournament
    const newTournament = await this.databaseService.tournaments.create({
      data: {
        tournament_name: tournamentName,
        status_id: Number(status),
        starting_date: startingDate || null,
        description: description || null,
      },
    });

    // Add admin if provided
    if (admins) {
      await this.databaseService.tournament_admins.create({
        data: {
          tournamentId: newTournament.id,
          userId: admins
        }
      });
    }

    return newTournament;
  }

  async updateTournament(id: number, status: number): Promise<any> {
    return await this.databaseService.tournaments.update({
      where: {
        id: id,
      },
      data: {
        status_id: Number(status),
      },
    });
  }

  async updateTournamentFull(id: number, updateData: {
    tournamentName?: string;
    status?: number;
    startingDate?: Date;
    description?: string;
  }): Promise<any> {
    return await this.databaseService.tournaments.update({
      where: {
        id: id,
      },
      data: {
        ...(updateData.tournamentName && { tournament_name: updateData.tournamentName }),
        ...(updateData.status && { status_id: Number(updateData.status) }),
        ...(updateData.startingDate && { starting_date: updateData.startingDate }),
        ...(updateData.description !== undefined && { description: updateData.description }),
      },
    });
  }

  async registerForTournament(tournamentId: number, userId: string): Promise<any> {
    return await this.databaseService.tournament_registration.create({
      data: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
        status: 'pending'
      }
    });
  }

  async deleteTournament(id: string): Promise<{ id: number }> {
    const deleted = await this.databaseService.tournaments.delete({
      where: {
        id: Number(id),
      },
    });
    return { id: deleted.id };
  }

  async unregisterFromTournament(tournamentId: number, userId: string): Promise<any> {
    return await this.databaseService.tournament_registration.deleteMany({
      where: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });
  }
}
