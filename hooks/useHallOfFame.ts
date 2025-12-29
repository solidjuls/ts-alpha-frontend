import { useQuery } from '@tanstack/react-query';
import { hallOfFameService, HallOfFameResponse } from '../services/hall-of-fame.service';

export const HALL_OF_FAME_QUERY_KEYS = {
  all: ['hall-of-fame'] as const,
};

export const useHallOfFame = () => {
  return useQuery<HallOfFameResponse, Error>({
    queryKey: HALL_OF_FAME_QUERY_KEYS.all,
    queryFn: () => hallOfFameService.getHallOfFame(),
    staleTime: 10 * 60 * 1000, // 10 minutes - this data doesn't change often
  });
};

