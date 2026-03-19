import { useMutation, useQuery } from '@tanstack/react-query';
import playoffsService, { PlayoffEntryDto, PlayoffSaveResponse } from '../services/playoffs.service';

// Query keys for playoffs
export const PLAYOFFS_QUERY_KEYS = {
  all: ['playoffs'] as const,
  bracket: (tournamentId: number) => [...PLAYOFFS_QUERY_KEYS.all, 'bracket', tournamentId] as const,
  save: () => [...PLAYOFFS_QUERY_KEYS.all, 'save'] as const,
};

export const usePlayoffBracket = (tournamentId: number) => {
  return useQuery<PlayoffEntryDto[], Error>({
    queryKey: PLAYOFFS_QUERY_KEYS.bracket(tournamentId),
    queryFn: () => playoffsService.getPlayoffBracket(tournamentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSavePlayoffBracket = () => {
  return useMutation<PlayoffSaveResponse, Error, PlayoffEntryDto[]>({
    mutationFn: (entries: PlayoffEntryDto[]) => playoffsService.savePlayoffBracket(entries),
    onSuccess: (data) => {
      console.log('Playoff bracket saved successfully:', data);
    },
    onError: (error) => {
      console.error('Error saving playoff bracket:', error);
    },
  });
};

