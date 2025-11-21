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
        waitlist: true,
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
      waitlist: item.waitlist,
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
        waitlist: true,
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
      waitlist: item.waitlist,
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
    userId?: string
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
    const isAdmin = await this.isUserAdminForTournament(userRole, userId, tournamentId);

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

  async isUserAdminForTournament(userRole?: number, userId?: string, tournamentId?: number): Promise<boolean> {
    // Check if user is global admin (SUPERADMIN = 1 or ADMIN = 2)
    if (userRole === 1 || userRole === 2) {
      return true;
    }

    // Check if user is tournament-specific admin
    if (userId && tournamentId) {
      try {
        const adminRecord = await this.databaseService.tournament_admins.findFirst({
          where: {
            userId: BigInt(userId),
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
    waitlist?: boolean;
    admins?: number;
    startingDate?: Date;
    description?: string;
  }): Promise<any> {
    const { tournamentName, status, waitlist, admins, startingDate, description } = tournamentData;

    // Create the tournament
    const newTournament = await this.databaseService.tournaments.create({
      data: {
        tournament_name: tournamentName,
        status_id: Number(status),
        waitlist: waitlist || false,
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
    waitlist?: boolean;
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
        ...(updateData.waitlist !== undefined && { waitlist: updateData.waitlist }),
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

  async getUserRegisteredTournaments(userId: string): Promise<TournamentDto[]> {
    // Get tournaments where user is registered
    const registrations = await this.databaseService.tournament_registration.findMany({
      where: {
        userId: BigInt(userId),
        status: {
          in: ['accepted', 'pending'] // Only include active registrations
        }
      },
      include: {
        tournaments: {
          include: {
            tournament_admins: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Map to tournament DTOs
    return registrations.map(registration => {
      const tournament = registration.tournaments;
      return {
        id: tournament.id.toString(),
        tournament_name: tournament.tournament_name,
        status_id: tournament.status_id,
        waitlist: tournament.waitlist,
        starting_date: tournament.starting_date,
        description: tournament.description,
        created_at: tournament.created_at,
        updated_at: tournament.updated_at,
        adminId: tournament.tournament_admins.map(admin => admin.users.id.toString()),
        adminName: tournament.tournament_admins.map(admin =>
          `${admin.users.first_name} ${admin.users.last_name}`
        ),
      };
    });
  }

  async getUserAdminTournaments(userId: string): Promise<TournamentDto[]> {
    // Get tournaments where user is admin
    const adminTournaments = await this.databaseService.tournament_admins.findMany({
      where: {
        userId: BigInt(userId),
      },
      include: {
        tournaments: {
          include: {
            tournament_admins: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Map to tournament DTOs
    return adminTournaments.map(adminTournament => {
      const tournament = adminTournament.tournaments;
      return {
        id: tournament.id.toString(),
        tournament_name: tournament.tournament_name,
        status_id: tournament.status_id,
        waitlist: tournament.waitlist,
        starting_date: tournament.starting_date,
        description: tournament.description,
        created_at: tournament.created_at,
        updated_at: tournament.updated_at,
        adminId: tournament.tournament_admins.map(admin => admin.users.id.toString()),
        adminName: tournament.tournament_admins.map(admin =>
          `${admin.users.first_name} ${admin.users.last_name}`
        ),
      };
    });
  }

  async getUserAvailableTournamentsWithSchedule(userId: string): Promise<{
    tournaments: TournamentDto[];
    defaultSchedule: any;
    isAdmin: boolean;
  }> {
    const tournaments: TournamentDto[] = [];
    let isAdmin = false;

    // Get tournaments where user is registered (status: open = 1)
    const registrations = await this.databaseService.tournament_registration.findMany({
      where: {
        userId: BigInt(userId),
        tournaments: {
          status_id: {
            in: [1, 2]
          }
        }
      },
      include: {
        tournaments: {
          include: {
            tournament_admins: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
console.log("registrations", registrations);
    // Add registered open tournaments
    tournaments.push(...registrations.map(registration => {
      const tournament = registration.tournaments;
      return {
        id: tournament.id.toString(),
        tournament_name: tournament.tournament_name,
        status_id: tournament.status_id,
        waitlist: tournament.waitlist,
        starting_date: tournament.starting_date,
        description: tournament.description,
        created_at: tournament.created_at,
        updated_at: tournament.updated_at,
        adminId: tournament.tournament_admins.map(admin => admin.users.id.toString()),
        adminName: tournament.tournament_admins.map(admin =>
          `${admin.users.first_name} ${admin.users.last_name}`
        ),
      };
    }));
console.log("tournaments", tournaments);
    // Get tournaments where user is admin (status: closed = 2)
    const adminTournaments = await this.databaseService.tournament_admins.findMany({
      where: {
        userId: BigInt(userId),
        tournaments: {
          status_id: 2 // Registration closed tournaments
        }
      },
      include: {
        tournaments: {
          include: {
            tournament_admins: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
console.log("adminTournaments", adminTournaments);
    // Add admin tournaments
    if (adminTournaments.length > 0) {
      isAdmin = true;
      tournaments.push(...adminTournaments.map(adminTournament => {
        const tournament = adminTournament.tournaments;
        return {
          id: tournament.id.toString(),
          tournament_name: tournament.tournament_name,
          status_id: tournament.status_id,
          waitlist: tournament.waitlist,
          starting_date: tournament.starting_date,
          description: tournament.description,
          created_at: tournament.created_at,
          updated_at: tournament.updated_at,
          adminId: tournament.tournament_admins.map(admin => admin.users.id.toString()),
          adminName: tournament.tournament_admins.map(admin =>
            `${admin.users.first_name} ${admin.users.last_name}`
          ),
        };
      }));
    }

    // Get default schedule for first tournament if available
    let defaultSchedule = null;
    if (tournaments.length > 0) {
      const firstTournamentId = tournaments[0].id;

      // Get schedule for first tournament
      const scheduleResults = await this.databaseService.schedule.findMany({
        where: {
          tournaments_id: parseInt(firstTournamentId),
        },
        include: {
          users_schedule_usa_player_idTousers: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              countries: {
              select: {
                tld_code: true,
              },
            },
            },
          },
          users_schedule_ussr_player_idTousers: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              countries: {
              select: {
                tld_code: true,
              },
            },
            },
          },
          game_results: {
            select: {
              game_winner: true,
              game_date: true,
            }
          },
        },
        orderBy: {
          due_date: 'asc',
        },
        take: 20, // First page
      });

      defaultSchedule = {
        results: scheduleResults,
        totalCount: scheduleResults.length,
        totalPages: Math.ceil(scheduleResults.length / 20),
        currentPage: 1,
      };
    }

    return {
      tournaments,
      defaultSchedule,
      isAdmin,
    };
  }

  async deleteTournament(id: string): Promise<{ id: number }> {
    const deleted = await this.databaseService.tournaments.delete({
      where: {
        id: Number(id),
      },
    });
    return { id: deleted.id };
  }

  async unregisterByRegistrationId(tournamentId: number, registrationId: string): Promise<any> {
    return await this.databaseService.tournament_registration.deleteMany({
      where: {
        tournamentId: tournamentId,
        id: Number(registrationId),
      }
    });
  }

  async unregisterByUserId(tournamentId: number, userId: string): Promise<any> {
    return await this.databaseService.tournament_registration.deleteMany({
      where: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });
  }

  // Tournament Admin Management Methods
  async getTournamentAdmins(tournamentId: number, requestingUserRole?: number): Promise<any[]> {
    const admins = await this.databaseService.tournament_admins.findMany({
      where: {
        tournamentId: tournamentId,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      }
    });

    // Only include email for global admins
    const includeEmail = requestingUserRole === 1 || requestingUserRole === 2;

    return admins.map(admin => ({
      userId: admin.users.id.toString(),
      name: `${admin.users.first_name} ${admin.users.last_name}`,
      email: includeEmail ? admin.users.email : undefined,
    }));
  }

  async addTournamentAdmin(tournamentId: number, userId: string): Promise<any> {
    // Check if admin relationship already exists
    const existingAdmin = await this.databaseService.tournament_admins.findFirst({
      where: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });

    if (existingAdmin) {
      throw new Error('User is already an admin for this tournament');
    }

    return await this.databaseService.tournament_admins.create({
      data: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });
  }

  async removeTournamentAdmin(tournamentId: number, userId: string): Promise<any> {
    const result = await this.databaseService.tournament_admins.deleteMany({
      where: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });

    if (result.count === 0) {
      throw new Error('Admin relationship not found');
    }

    return result;
  }

  // Waitlist methods
  async getWaitlistPlayers(tournamentId: number, userRole: number, userId: string): Promise<any[]> {
    const waitlistEntries = await this.databaseService.tournament_waitlist.findMany({
      where: {
        tournamentId: tournamentId,
      },
      include: {
        users: {
          include: {
            countries: true,
          }
        }
      },
      orderBy: {
        created_at: 'asc', // First come, first served
      },
    });

    // Check if user is admin (global admin or tournament admin)
    const isAdmin = await this.isUserAdminForTournament(userRole, userId, tournamentId);

    // Map waitlist data with user data
    return waitlistEntries.map(entry => {
      const user = entry.users;
      return {
        waitlistId: entry.id,
        email: isAdmin ? (user?.email || '') : '', // Only include email for admins
        waitlistedAt: entry.created_at || new Date(),
        userId: user?.id?.toString(),
        name: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
        countryCode: user?.countries?.tld_code,
      };
    });
  }

  async addToWaitlist(tournamentId: number, userId: string): Promise<any> {
    return await this.databaseService.tournament_waitlist.create({
      data: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });
  }

  async removeFromWaitlist(tournamentId: number, userId: string): Promise<any> {
    return await this.databaseService.tournament_waitlist.deleteMany({
      where: {
        tournamentId: tournamentId,
        userId: BigInt(userId),
      }
    });
  }

  async removeFromWaitlistById(tournamentId: number, waitlistId: string): Promise<any> {
    return await this.databaseService.tournament_waitlist.deleteMany({
      where: {
        tournamentId: tournamentId,
        id: Number(waitlistId),
      }
    });
  }

}
