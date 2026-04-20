import { useMutation, useQuery } from '@tanstack/react-query';
import playoffsService, { PlayoffEntryDto, PlayoffSaveResponse, PlayoffTournament, SchedulePlayoffMatchRequest, SetPlayoffWinnerRequest } from '../services/playoffs.service';

// Query keys for playoffs
export const PLAYOFFS_QUERY_KEYS = {
  all: ['playoffs'] as const,
  list: () => [...PLAYOFFS_QUERY_KEYS.all, 'list'] as const,
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

export const useUpdatePlayoffBracket = () => {
  return useMutation<PlayoffSaveResponse, Error, PlayoffEntryDto[]>({
    mutationFn: (entries: PlayoffEntryDto[]) => playoffsService.updatePlayoffBracket(entries),
    onSuccess: (data) => {
      console.log('Playoff bracket updated successfully:', data);
    },
    onError: (error) => {
      console.error('Error updating playoff bracket:', error);
    },
  });
};

export const useAllPlayoffs = () => {
  return useQuery<PlayoffTournament[], Error>({
    queryKey: PLAYOFFS_QUERY_KEYS.list(),
    queryFn: () => playoffsService.getAllPlayoffs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSchedulePlayoffMatch = () => {
  return useMutation<void, Error, SchedulePlayoffMatchRequest>({
    mutationFn: (request) => playoffsService.schedulePlayoffMatch(request),
    onSuccess: () => {
      console.log('Playoff match scheduled successfully');
    },
    onError: (error) => {
      console.error('Error scheduling playoff match:', error);
    },
  });
};

export const useSetPlayoffWinner = () => {
  return useMutation<void, Error, SetPlayoffWinnerRequest>({
    mutationFn: (request) => playoffsService.setPlayoffWinner(request),
    onSuccess: () => {
      console.log('Playoff winner set successfully');
    },
    onError: (error) => {
      console.error('Error setting playoff winner:', error);
    },
  });
};

