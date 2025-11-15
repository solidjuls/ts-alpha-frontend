import axios, { AxiosInstance } from 'axios';

// Tournament interfaces
export interface Tournament {
  id: string;
  tournament_name: string;
  status_id: number;
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
  startingDate?: Date;
  description?: string;
}

export interface RegisterTournamentRequest {
  id: number;
  userEmail?: string; // For legacy support
  userId?: string;    // For manual registration by admin
}

export interface UpdateTournamentStatusRequest {
  id: number;
  status: number;
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
  async unregisterFromTournament(tournamentId: number, userEmail: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/tournaments/${tournamentId}/unregister`, {
      data: { userEmail }
    });
    return response.data;
  }

  // POST /api/tournaments - Update tournament status
  async updateTournamentStatus(data: UpdateTournamentStatusRequest): Promise<any> {
    const response = await this.axiosInstance.post('/tournaments', data);
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
}

// Export singleton instance
export const tournamentsService = new TournamentsService();
export default tournamentsService;
