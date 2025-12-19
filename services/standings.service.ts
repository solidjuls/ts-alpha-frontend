import { PlayerStanding } from '../hooks/useStandings';
import { createAuthenticatedAxios } from '../utils/api';

export interface StandingsResponse extends Array<PlayerStanding> {}

// Create axios instance for NestJS backend with auth
const standingsApi = createAuthenticatedAxios();

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
