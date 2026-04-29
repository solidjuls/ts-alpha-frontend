import { AxiosInstance } from 'axios';
import { createAuthenticatedAxios } from '../utils/api';

// DTO for a single playoff entry
export interface PlayoffEntryDto {
  id?: number;
  tournamentId: number;
  nextSquare: string | null;
  playoffSquare: string;
  userId: number | null;
  userName: string | null;
  seed: number | null;
  winnerUserId: number | null;
}

// Request type for setting a winner
export interface SetPlayoffWinnerRequest {
  id: number;
}

// Response type from the API (adjust based on actual backend response)
export interface PlayoffSaveResponse {
  success: boolean;
  message?: string;
}

// Response type for getAllPlayoffs
export interface PlayoffTournament {
  id: number;
  name: string;
}

// Request type for scheduling a playoff match    justify-content: center;
export interface SchedulePlayoffMatchRequest {
  usaPlayerId: string;
  ussrPlayerId: string;
  tournamentId: number;
}

class PlayoffsService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createAuthenticatedAxios();
  }

  /**
   * Get the playoff bracket for a tournament
   * @param tournamentId The tournament ID
   */
  async getPlayoffBracket(tournamentId: number): Promise<PlayoffEntryDto[]> {
    const response = await this.axiosInstance.get(`/playoffs/${tournamentId}`);
    return response.data;
  }

  /**
   * Save the entire playoff bracket to the backend
   * @param entries Array of playoff entries (all slots, including empty ones)
   */
  async savePlayoffBracket(entries: PlayoffEntryDto[]): Promise<PlayoffSaveResponse> {
    const response = await this.axiosInstance.post('/playoffs', entries);
    return response.data;
  }

  /**
   * Update an existing playoff bracket
   * @param entries Array of playoff entries (all slots, including empty ones)
   */
  async updatePlayoffBracket(entries: PlayoffEntryDto[]): Promise<PlayoffSaveResponse> {
    const response = await this.axiosInstance.put('/playoffs', entries);
    return response.data;
  }

  /**
   * Get all playoff tournaments for dropdown selection
   */
  async getAllPlayoffs(): Promise<PlayoffTournament[]> {
    const response = await this.axiosInstance.get('/playoffs/getAll');
    return response.data;
  }

  /**
   * Schedule a playoff match between two players
   */
  async schedulePlayoffMatch(request: SchedulePlayoffMatchRequest): Promise<void> {
    await this.axiosInstance.post('/playoffs/schedule', request);
  }

  /**
   * Set the winner of a playoff match
   */
  async setPlayoffWinner(request: SetPlayoffWinnerRequest): Promise<void> {
    await this.axiosInstance.put('/playoffs/winner', request);
  }
}

export const playoffsService = new PlayoffsService();
export default playoffsService;

