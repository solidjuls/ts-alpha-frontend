import { useQuery } from '@tanstack/react-query';
import { standingsService } from '../services/standings.service';

export interface PlayerStanding {
  userId: string;
  name: string;
  secondaryName?: string;
  standingName: string;
  tldCode: string;
  gamesWon: number;
  gamesLost: number;
  gamesTied: number;
  winRate: number;
  sos: number;
}

export interface StandingsQueryParams {
  tournamentId: string;
  division?: string;
}

export const useStandings = ({ tournamentId, division }: StandingsQueryParams) => {
  return useQuery({
    queryKey: ['standings', tournamentId, division],
    queryFn: () => standingsService.getStandings(tournamentId, division),
    enabled: !!tournamentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useStandingsHealth = () => {
  return useQuery({
    queryKey: ['standings', 'health'],
    queryFn: () => standingsService.getStandingsHealth(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
