import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import scheduleService, { 
  ScheduleListResponse, 
  GetScheduleParams, 
  AddScheduleParams, 
  UpdateScheduleParams, 
  ReplacePlayerParams 
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
  options?: UseQueryOptions<ScheduleListResponse, Error>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.list(params),
    queryFn: () => scheduleService.getSchedules(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // Keep previous data while loading new page
    ...options,
  });
};

// Hook for getting schedules by user
export const useSchedulesByUser = (
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions<ScheduleListResponse, Error>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.byUser(userId, page, pageSize),
    queryFn: () => scheduleService.getSchedulesByUser(userId, page, pageSize),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for getting schedules by tournament
export const useSchedulesByTournament = (
  tournamentId: string,
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions<ScheduleListResponse, Error>
) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.byTournament(tournamentId, page, pageSize),
    queryFn: () => scheduleService.getSchedulesByTournament(tournamentId, page, pageSize),
    enabled: !!tournamentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
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
