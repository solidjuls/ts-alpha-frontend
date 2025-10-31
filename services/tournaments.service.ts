import axios from 'axios';

// Create axios instance for tournaments API
const tournamentsApi = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.vercel.app/api' 
    : 'http://localhost:4002/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  userEmail: string;
}

export interface UpdateTournamentStatusRequest {
  id: number;
  status: number;
}

// Tournament service
export const tournamentsService = {
  // GET /api/tournaments - Get tournaments by status or ID
  getTournaments: async (params?: {
    id?: string;
    status?: string;
    players?: string;
  }): Promise<Tournament[] | RegisteredPlayer[]> => {
    const response = await tournamentsApi.get('/tournaments', { params });
    return response.data;
  },

  // GET /api/tournaments?id=123&players=true - Get registered players
  getRegisteredPlayers: async (tournamentId: number): Promise<RegisteredPlayer[]> => {
    const response = await tournamentsApi.get('/tournaments', {
      params: { id: tournamentId.toString(), players: 'true' }
    });
    return response.data;
  },

  // GET /api/tournaments?status=1,2,3 - Get tournaments by status
  getTournamentsByStatus: async (statusArray: number[]): Promise<Tournament[]> => {
    const response = await tournamentsApi.get('/tournaments', {
      params: { status: statusArray.join(',') }
    });
    return response.data;
  },

  // GET /api/tournaments?id=1,2,3 - Get tournaments by IDs
  getTournamentsById: async (ids: string[]): Promise<Tournament[]> => {
    const response = await tournamentsApi.get('/tournaments', {
      params: { id: ids.join(',') }
    });
    return response.data;
  },

  // POST /api/tournaments - Register user or update status
  registerForTournament: async (data: RegisterTournamentRequest): Promise<any> => {
    const response = await tournamentsApi.post('/tournaments', data);
    return response.data;
  },

  // POST /api/tournaments - Update tournament status
  updateTournamentStatus: async (data: UpdateTournamentStatusRequest): Promise<any> => {
    const response = await tournamentsApi.post('/tournaments', data);
    return response.data;
  },

  // PUT /api/tournaments - Update tournament details
  updateTournament: async (data: UpdateTournamentRequest): Promise<any> => {
    const response = await tournamentsApi.put('/tournaments', data);
    return response.data;
  },

  // PATCH /api/tournaments - Create new tournament
  createTournament: async (data: CreateTournamentRequest): Promise<any> => {
    const response = await tournamentsApi.patch('/tournaments', data);
    return response.data;
  },

  // DELETE /api/tournaments/:id - Delete tournament
  deleteTournament: async (id: string): Promise<{ id: string }> => {
    const response = await tournamentsApi.delete(`/tournaments/${id}`);
    return response.data;
  },
};

export default tournamentsService;
