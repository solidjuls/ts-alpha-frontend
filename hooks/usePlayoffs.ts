import { useMutation } from '@tanstack/react-query';
import playoffsService, { PlayoffEntryDto, PlayoffSaveResponse } from '../services/playoffs.service';

// Query keys for playoffs
export const PLAYOFFS_QUERY_KEYS = {
  all: ['playoffs'] as const,
  save: () => [...PLAYOFFS_QUERY_KEYS.all, 'save'] as const,
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

