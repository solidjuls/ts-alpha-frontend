import axios from 'axios';
import { PlayerStanding } from '../hooks/useStandings';

export interface StandingsResponse extends Array<PlayerStanding> {}

// Create axios instance for NestJS backend
const standingsApi = axios.create({
  baseURL: 'http://localhost:4002/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

class StandingsService {
  async getStandings(tournamentId: string, division?: string): Promise<StandingsResponse> {
    const params = new URLSearchParams({ id: tournamentId });

    if (division) {
      params.append('division', division);
    }

    const response = await standingsApi.get(`/standings?${params.toString()}`);
    return response.data;
  }

  async getStandingsHealth(): Promise<{ status: string }> {
    const response = await standingsApi.get('/standings/health');
    return response.data;
  }
}

export const standingsService = new StandingsService();
