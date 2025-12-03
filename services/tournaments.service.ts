import axios, { AxiosInstance } from 'axios';

// Tournament interfaces
export interface Tournament {
  id: string;
  tournament_name: string;
  status_id: 1 | 2 | 3 | 4 | 5;
  waitlist: boolean;
  starting_date: Date | null;
  adminId: string[];
  adminName: string[];
  description?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface RegisteredPlayer {
  registrationId: number;
  email: string; // Will be empty string for non-admin users
  status: string;
  registeredAt: Date;
  userId?: string;
  name: string;
  countryCode?: string;
}

export interface WaitlistPlayer {
  waitlistId: number;
  email: string; // Will be empty string for non-admin users
  waitlistedAt: Date;
  userId?: string;
  name: string;
  countryCode?: string;
}

export interface CreateTournamentRequest {
  tournamentName: string;
  status: number;
  admins?: string;
  startingDate?: Date;
  description?: string;
}

export interface UpdateTournamentRequest {
  id: number;
  tournamentName?: string;
  status?: number;
  waitlist?: boolean;
  startingDate?: Date;
  description?: string;
}

export interface RegisterTournamentRequest {
  id: number;
  userId?: string;    // For registration (self or admin)
}

export interface TournamentAdmin {
  userId: string;
  name: string;
  email?: string; // Only for admins viewing
}

export interface AddTournamentAdminRequest {
  tournamentId: number;
  userId: string;
}

export interface RemoveTournamentAdminRequest {
  tournamentId: number;
  userId: string;
}

export interface UpdateTournamentStatusRequest {
  tournamentId: number;
  status: number; // 2=START_REGISTRATION, 3=CLOSE_REGISTRATION, 4=START_TOURNAMENT, 5=CLOSE_TOURNAMENT
}

export interface UpdateTournamentStatusResponse {
  success: boolean;
  message: string;
  tournament: {
    id: number;
    status_id: number;
    updated_at: Date;
  };
}

export interface BulkRegisterResponse {
  success: boolean;
  message: string;
  totalAttempted: number;
  successCount: number;
  errorCount: number;
  standingsCreated: number;
  standingPlayersCreated: number;
  errors: string[];
}

export interface GenerateScheduleResponse {
  success: boolean;
  message: string;
  totalSchedules: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  generatedPairs: number;
}

export interface AddToWaitlistRequest {
  userId?: string;    // For admin adding someone else, optional for self
}

export interface RemoveFromWaitlistRequest {
  userId?: string;    // For removing by user ID
  waitlistId?: string; // For removing by waitlist ID (admin action)
}

class TournamentsService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // GET /api/tournaments - Get tournaments by status or ID
  async getTournaments(params?: {
    id?: string;
    status?: string;
    players?: string;
  }): Promise<Tournament[] | RegisteredPlayer[]> {
    const response = await this.axiosInstance.get('/tournaments', { params });
    return response.data;
  }

  // GET /api/tournaments?id=123&players=true - Get registered players
  async getRegisteredPlayers(tournamentId: number): Promise<RegisteredPlayer[]> {
    const response = await this.axiosInstance.get('/tournaments', {
      params: { id: tournamentId.toString(), players: 'true' }
    });
    return response.data;
  }

  // GET /api/tournaments?status=1,2,3 - Get tournaments by status
  async getTournamentsByStatus(statusArray: number[]): Promise<Tournament[]> {
    const response = await this.axiosInstance.get('/tournaments', {
      params: { status: statusArray.join(',') }
    });
    return response.data;
  }

  // GET /api/tournaments?id=1,2,3 - Get tournaments by IDs
  async getTournamentsById(ids: string[]): Promise<Tournament[]> {
    const response = await this.axiosInstance.get('/tournaments', {
      params: { id: ids.join(',') }
    });
    return response.data;
  }

  // POST /api/tournaments - Register user or update status
  async registerForTournament(data: RegisterTournamentRequest): Promise<any> {
    const response = await this.axiosInstance.post('/tournaments', data);
    return response.data;
  }

  // POST /api/tournaments - Register user by userId (for manual registration)
  async registerUserForTournament(tournamentId: number, userId: string): Promise<any> {
    const response = await this.axiosInstance.post('/tournaments', {
      id: tournamentId,
      userId: userId
    });
    return response.data;
  }

  // DELETE /api/tournaments/:id/unregister - Unregister user from tournament
  async unregisterFromTournament(tournamentId: number, registrationId?: number, userId?: string): Promise<{ message: string }> {
    const data: any = {};
    if (registrationId) {
      data.regId = registrationId;
    } else if (userId) {
      data.userId = userId;
    }

    const response = await this.axiosInstance.delete(`/tournaments/${tournamentId}/unregister`, {
      data
    });
    return response.data;
  }

  // PATCH /api/tournaments/:id/forfeit - Forfeit a player from tournament
  async forfeitPlayer(tournamentId: number, registrationId: number): Promise<{ message: string }> {
    const response = await this.axiosInstance.patch(`/tournaments/${tournamentId}/forfeit`, {
      registrationId
    });
    return response.data;
  }

  // PUT /api/tournaments - Update tournament details
  async updateTournament(data: UpdateTournamentRequest): Promise<any> {
    const response = await this.axiosInstance.put('/tournaments', data);
    return response.data;
  }

  // PATCH /api/tournaments - Create new tournament
  async createTournament(data: CreateTournamentRequest): Promise<any> {
    const response = await this.axiosInstance.patch('/tournaments', data);
    return response.data;
  }

  // DELETE /api/tournaments/:id - Delete tournament
  async deleteTournament(id: string): Promise<{ id: string }> {
    const response = await this.axiosInstance.delete(`/tournaments/${id}`);
    return response.data;
  }

  // Tournament Admin Management Methods

  // GET /api/tournaments/:id/admins - Get tournament admins
  async getTournamentAdmins(tournamentId: number): Promise<TournamentAdmin[]> {
    const response = await this.axiosInstance.get(`/tournaments/${tournamentId}/admins`);
    return response.data;
  }

  // POST /api/tournaments/:id/admins - Add tournament admin
  async addTournamentAdmin(data: AddTournamentAdminRequest): Promise<{ message: string }> {
    const response = await this.axiosInstance.post(`/tournaments/${data.tournamentId}/admins`, {
      userId: data.userId
    });
    return response.data;
  }

  // DELETE /api/tournaments/:id/admins - Remove tournament admin
  async removeTournamentAdmin(data: RemoveTournamentAdminRequest): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/tournaments/${data.tournamentId}/admins`, {
      data: { userId: data.userId }
    });
    return response.data;
  }

  // User Tournament Methods

  // GET /api/tournaments/user/registered - Get user's registered tournaments
  async getUserRegisteredTournaments(): Promise<Tournament[]> {
    const response = await this.axiosInstance.get('/tournaments/user/registered');
    return response.data;
  }

  // GET /api/tournaments/user/admin - Get tournaments where user is admin
  async getUserAdminTournaments(): Promise<Tournament[]> {
    const response = await this.axiosInstance.get('/tournaments/user/admin');
    return response.data;
  }

  // GET /api/tournaments/user/available-with-schedule - Get user's available tournaments with default schedule
  async getUserAvailableTournamentsWithSchedule(): Promise<{
    tournaments: Tournament[];
    defaultSchedule: any;
    isAdmin: boolean;
  }> {
    const response = await this.axiosInstance.get('/tournaments/user/available-with-schedule');
    return response.data;
  }

  // Waitlist Management Methods

  // GET /api/tournaments/:id/waitlist - Get waitlist players for tournament
  async getWaitlistPlayers(tournamentId: number): Promise<WaitlistPlayer[]> {
    const response = await this.axiosInstance.get(`/tournaments/${tournamentId}/waitlist`);
    return response.data;
  }

  // POST /api/tournaments/:id/waitlist - Add user to waitlist
  async addToWaitlist(tournamentId: number, data: AddToWaitlistRequest): Promise<any> {
    const response = await this.axiosInstance.post(`/tournaments/${tournamentId}/waitlist`, data);
    return response.data;
  }

  // DELETE /api/tournaments/:id/waitlist - Remove user from waitlist
  async removeFromWaitlist(tournamentId: number, data: RemoveFromWaitlistRequest): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/tournaments/${tournamentId}/waitlist`, {
      data
    });
    return response.data;
  }

  // PATCH /api/tournaments/status - Update tournament status
  async updateTournamentStatus(data: UpdateTournamentStatusRequest): Promise<UpdateTournamentStatusResponse> {
    const response = await this.axiosInstance.patch('/tournaments/status', data);
    return response.data;
  }

  // POST /api/tournaments/:id/bulk-register - Bulk register 150 random users
  async bulkRegisterRandomUsers(tournamentId: number): Promise<BulkRegisterResponse> {
    const response = await this.axiosInstance.post(`/tournaments/${tournamentId}/bulk-register`);
    return response.data;
  }

  // POST /api/tournaments/:id/generate-schedule - Generate random schedule for tournament
  async generateRandomSchedule(tournamentId: number): Promise<GenerateScheduleResponse> {
    const response = await this.axiosInstance.post(`/tournaments/${tournamentId}/generate-schedule`);
    return response.data;
  }

  // GET /api/tournaments/ongoing-without-schedule - Get ongoing tournaments with no scheduled games
  async getOngoingTournamentsWithoutSchedule(): Promise<Tournament[]> {
    const response = await this.axiosInstance.get('/tournaments/ongoing-without-schedule');
    return response.data;
  }
}

// Export singleton instance
export const tournamentsService = new TournamentsService();
export default tournamentsService;
