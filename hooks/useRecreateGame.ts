import { useMutation, useQuery } from '@tanstack/react-query';
import { recreateService, RecreateGameRequest, RecreateGameResponse } from '../services/recreate.service';

export const useRecreateGame = () => {
  return useMutation({
    mutationFn: (data: RecreateGameRequest) => recreateService.recreateGame(data),
    onSuccess: (data: RecreateGameResponse) => {
      console.log('Game recreated successfully:', data);
    },
    onError: (error: any) => {
      console.error('Error recreating game:', error);
    },
  });
};

export const useRecreateHealth = () => {
  return useQuery({
    queryKey: ['recreate', 'health'],
    queryFn: () => recreateService.getRecreateHealth(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
