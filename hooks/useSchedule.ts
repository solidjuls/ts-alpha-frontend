import { useQuery, useMutation, useQueryClient, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import scheduleService, {
  ScheduleListResponse,
  GetScheduleParams,
  AddScheduleParams,
  UpdateScheduleParams,
  ReplacePlayerParams,
  RemovePlayerParams,
  UploadCsvScheduleParams,
  CsvUploadResponse
} from '../services/schedule.service';

// Query keys for React Query
export const SCHEDULE_QUERY_KEYS = {
  all: ['schedule'] as const,
  lists: () => [...SCHEDULE_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetScheduleParams) => [...SCHEDULE_QUERY_KEYS.lists(), params] as const,
  byUser: (userId: string, page: number, pageSize: number) => 
    [...SCHEDULE_QUERY_KEYS.all, 'byUser', userId, page, pageSize] as const,
  byTournament: (tournamentId: string, page: number, pageSize: number) => 
    [...SCHEDULE_QUERY_KEYS.all, 'byTournament', tournamentId, page, pageSize] as const,
  health: () => [...SCHEDULE_QUERY_KEYS.all, 'health'] as const,
};

// Hook for getting schedules with filters
export const useSchedules = (
  params: GetScheduleParams = {},
  options?: Omit<UseQueryOptions<ScheduleListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.list(params),
    queryFn: () => scheduleService.getSchedules(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData, // Keep previous data while loading new data (React Query v5)
    ...options,
  });
};

// Hook for getting schedules by user
export const useSchedulesByUser = (
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  options?: Omit<UseQueryOptions<ScheduleListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.byUser(userId, page, pageSize),
    queryFn: () => scheduleService.getSchedulesByUser(userId, page, pageSize),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
    ...options,
  });
};

// Hook for getting schedules by tournament
export const useSchedulesByTournament = (
  tournamentId: string,
  page: number = 1,
  pageSize: number = 20,
  options?: Omit<UseQueryOptions<ScheduleListResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.byTournament(tournamentId, page, pageSize),
    queryFn: () => scheduleService.getSchedulesByTournament(tournamentId, page, pageSize),
    enabled: !!tournamentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
    ...options,
  });
};

// Hook for adding schedule
export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AddScheduleParams) => scheduleService.addSchedule(params),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.all });
    },
  });
};

// Hook for updating schedule
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateScheduleParams) => scheduleService.updateSchedule(params),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.all });
    },
  });
};

// Hook for replacing player
export const useReplacePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReplacePlayerParams) => scheduleService.replacePlayer(params),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.all });
    },
  });
};

// Hook for removing player
export const useRemovePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RemovePlayerParams) => scheduleService.removePlayer(params),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.all });
    },
  });
};

// Hook for deleting schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.deleteSchedule(id),
    onSuccess: () => {
      // Invalidate and refetch schedule queries
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.all });
    },
  });
};

// Hook for uploading CSV schedule
export const useUploadCsvSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadCsvScheduleParams) => scheduleService.uploadCsvSchedule(params),
    onSuccess: () => {
      // Invalidate and refetch schedule lists
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error('CSV upload failed:', error);
    },
  });
};

// Hook for schedule health check
export const useScheduleHealth = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.health(),
    queryFn: () => scheduleService.getScheduleHealth(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
