import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tournamentsService, {
  CreateTournamentRequest,
  CreateSubtournamentRequest,
  SubtournamentResponse,
  UpdateTournamentRequest,
  RegisterTournamentRequest,
  UpdateTournamentStatusRequest,
  BulkRegisterResponse,
  GenerateScheduleResponse,
  TournamentAdmin,
  AddTournamentAdminRequest,
  RemoveTournamentAdminRequest,
  AddToWaitlistRequest,
  RemoveFromWaitlistRequest,
  ResultTextItem,
  ScheduleAdminResponse,
} from '../services/tournaments.service';

// Query keys for tournaments
export const tournamentKeys = {
  all: ['tournaments'] as const,
  lists: () => [...tournamentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tournamentKeys.lists(), { filters }] as const,
  details: () => [...tournamentKeys.all, 'detail'] as const,
  detail: (id: string) => [...tournamentKeys.details(), id] as const,
  players: (id: number) => [...tournamentKeys.all, 'players', id] as const,
};

// Get tournaments by status
export const useTournamentsByStatus = (statusArray: number[]) => {
  return useQuery({
    queryKey: tournamentKeys.list({ status: statusArray }),
    queryFn: () => tournamentsService.getTournamentsByStatus(statusArray),
    enabled: statusArray.length > 0,
  });
};

// Get ongoing tournaments with no scheduled games
export const useOngoingTournamentsWithoutSchedule = ({ enabled = true}: { enabled: boolean }) => {
  return useQuery({
    queryKey: [...tournamentKeys.all, 'ongoing-without-schedule'],
    queryFn: () => tournamentsService.getOngoingTournamentsWithoutSchedule(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled
  });
};

// Get tournaments by IDs
export const useTournamentsById = (ids: string[]) => {
  return useQuery({
    queryKey: tournamentKeys.list({ ids }),
    queryFn: () => tournamentsService.getTournamentsById(ids),
    enabled: ids.length > 0,
  });
};

// Get registered players for a tournament
export const useRegisteredPlayers = (tournamentId: number) => {
  return useQuery({
    queryKey: tournamentKeys.players(tournamentId),
    queryFn: () => tournamentsService.getRegisteredPlayers(tournamentId),
    enabled: !!tournamentId,
  });
};

// Create tournament mutation
export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentRequest) => tournamentsService.createTournament(data),
    onSuccess: () => {
      // Invalidate and refetch tournaments
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
    onError: (error: any) => {
      console.error('Create tournament failed:', error);
    },
  });
};

// Update tournament mutation
export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTournamentRequest) => tournamentsService.updateTournament(data),
    onSuccess: (_, variables) => {
      // Invalidate specific tournament and lists
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(variables.id.toString()) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Update tournament failed:', error);
    },
  });
};

// Update tournament status mutation
export const useUpdateTournamentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTournamentStatusRequest) => tournamentsService.updateTournamentStatus(data),
    onSuccess: (_, variables) => {
      // Invalidate specific tournament and lists
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(variables.tournamentId.toString()) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Update tournament status failed:', error);
    },
  });
};

// Register for tournament mutation
export const useRegisterForTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterTournamentRequest) => tournamentsService.registerForTournament(data),
    onSuccess: (_, variables) => {
      // Invalidate registered players for this tournament
      queryClient.invalidateQueries({ queryKey: tournamentKeys.players(variables.id) });
      // Also invalidate tournament lists in case registration affects display
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Tournament registration failed:', error);
    },
  });
};

// Manual register user for tournament mutation (admin only)
export const useManualRegisterForTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { tournamentId: number; userId: string }) =>
      tournamentsService.registerUserForTournament(data.tournamentId, data.userId),
    onSuccess: (_, variables) => {
      // Invalidate registered players for this tournament
      queryClient.invalidateQueries({ queryKey: tournamentKeys.players(variables.tournamentId) });
      // Also invalidate tournament lists in case registration affects display
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Manual tournament registration failed:', error);
    },
  });
};

// Unregister from tournament mutation
export const useUnregisterFromTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, registrationId, userId }: { tournamentId: number; registrationId?: number; userId?: string }) =>
      tournamentsService.unregisterFromTournament(tournamentId, registrationId, userId),
    onSuccess: (_, variables) => {
      // Invalidate registered players for this tournament
      queryClient.invalidateQueries({ queryKey: tournamentKeys.players(variables.tournamentId) });
      // Also invalidate tournament lists in case registration affects display
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Tournament unregistration failed:', error);
    },
  });
};

// Forfeit player from tournament mutation
export const useForfeitPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, registrationId }: { tournamentId: number; registrationId: number }) =>
      tournamentsService.forfeitPlayer(tournamentId, registrationId),
    onSuccess: (_, variables) => {
      // Invalidate registered players for this tournament
      queryClient.invalidateQueries({ queryKey: tournamentKeys.players(variables.tournamentId) });
      // Also invalidate tournament lists in case it affects display
      queryClient.invalidateQueries({ queryKey: tournamentKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Tournament forfeit failed:', error);
    },
  });
};

// Delete tournament mutation
export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tournamentsService.deleteTournament(id),
    onSuccess: () => {
      // Invalidate all tournament queries
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
    onError: (error: any) => {
      console.error('Delete tournament failed:', error);
    },
  });
};

// Get user's registered tournaments
export const useUserRegisteredTournaments = () => {
  return useQuery({
    queryKey: [...tournamentKeys.all, 'user', 'registered'],
    queryFn: () => tournamentsService.getUserRegisteredTournaments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get tournaments where user is admin
export const useUserAdminTournaments = () => {
  return useQuery({
    queryKey: [...tournamentKeys.all, 'user', 'admin'],
    queryFn: () => tournamentsService.getUserAdminTournaments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user's available tournaments with default schedule
export const useUserAvailableTournamentsWithSchedule = () => {
  return useQuery({
    queryKey: [...tournamentKeys.all, 'user', 'available-with-schedule'],
    queryFn: () => tournamentsService.getUserAvailableTournamentsWithSchedule(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Generic tournaments query hook
export const useTournaments = (params?: {
  id?: string;
  status?: string;
  players?: string;
}) => {
  return useQuery({
    queryKey: tournamentKeys.list(params || {}),
    queryFn: () => tournamentsService.getTournaments(params),
    // Always enabled - when no params provided, it fetches all tournaments
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Tournament Admin Management Hooks

export const useTournamentAdmins = (tournamentId: number) => {
  return useQuery({
    queryKey: [...tournamentKeys.detail(tournamentId.toString()), 'admins'],
    queryFn: () => tournamentsService.getTournamentAdmins(tournamentId),
    enabled: !!tournamentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddTournamentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddTournamentAdminRequest) => tournamentsService.addTournamentAdmin(data),
    onSuccess: (_, variables) => {
      // Invalidate tournament admins query
      queryClient.invalidateQueries({
        queryKey: [...tournamentKeys.detail(variables.tournamentId.toString()), 'admins']
      });
      // Invalidate tournament details to refresh adminId/adminName arrays
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId.toString())
      });
    },
  });
};

export const useRemoveTournamentAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveTournamentAdminRequest) => tournamentsService.removeTournamentAdmin(data),
    onSuccess: (_, variables) => {
      // Invalidate tournament admins query
      queryClient.invalidateQueries({
        queryKey: [...tournamentKeys.detail(variables.tournamentId.toString()), 'admins']
      });
      // Invalidate tournament details to refresh adminId/adminName arrays
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId.toString())
      });
    },
  });
};

// Waitlist Management Hooks

export const useWaitlistPlayers = (tournamentId: number) => {
  return useQuery({
    queryKey: [...tournamentKeys.detail(tournamentId.toString()), 'waitlist'],
    queryFn: () => tournamentsService.getWaitlistPlayers(tournamentId),
    enabled: !!tournamentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddToWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, data }: { tournamentId: number; data: AddToWaitlistRequest }) =>
      tournamentsService.addToWaitlist(tournamentId, data),
    onSuccess: (_, variables) => {
      // Invalidate waitlist query
      queryClient.invalidateQueries({
        queryKey: [...tournamentKeys.detail(variables.tournamentId.toString()), 'waitlist']
      });
      // Also invalidate tournament details
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId.toString())
      });
    },
  });
};

export const useRemoveFromWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, data }: { tournamentId: number; data: RemoveFromWaitlistRequest }) =>
      tournamentsService.removeFromWaitlist(tournamentId, data),
    onSuccess: (_, variables) => {
      // Invalidate waitlist query
      queryClient.invalidateQueries({
        queryKey: [...tournamentKeys.detail(variables.tournamentId.toString()), 'waitlist']
      });
      // Also invalidate tournament details
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(variables.tournamentId.toString())
      });
    },
  });
};

export const useToggleWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: number) => tournamentsService.toggleWaitlist(tournamentId),
    onSuccess: (_, tournamentId) => {
      // Invalidate tournament details to refresh waitlist status
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId.toString())
      });
      // Also invalidate the list
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.lists()
      });
    },
  });
};

// Bulk register random users mutation
export const useBulkRegisterUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: number) =>
      tournamentsService.bulkRegisterRandomUsers(tournamentId),
    onSuccess: (_, tournamentId) => {
      // Invalidate registered players query
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.players(tournamentId)
      });
      // Also invalidate tournament details
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId.toString())
      });
    },
  });
};

// Generate random schedule mutation
export const useGenerateRandomSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: number) =>
      tournamentsService.generateRandomSchedule(tournamentId),
    onSuccess: (_, tournamentId) => {
      // Invalidate schedule queries if they exist
      queryClient.invalidateQueries({
        queryKey: ['schedule', tournamentId]
      });
      // Also invalidate tournament details
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId.toString())
      });
    },
  });
};

// Create subtournament (playoff) mutation
export const useCreateSubtournament = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SubtournamentResponse,
    Error,
    { parentId: number; data: CreateSubtournamentRequest }
  >({
    mutationFn: ({ parentId, data }) =>
      tournamentsService.createSubtournament(parentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
    onError: (error: any) => {
      console.error('Create subtournament failed:', error);
    },
  });
};

// Generate result text for a tournament in a date range
export const useGenerateResultText = () => {
  return useMutation<ResultTextItem[], Error, { tournamentId: number; startDate: string; endDate: string; video: number }>({
    mutationFn: ({ tournamentId, startDate, endDate, video }) =>
      tournamentsService.generateResultText(tournamentId, startDate, endDate, video),
    onError: (error: any) => {
      console.error('Generate result text failed:', error);
    },
  });
};

// Get schedule admin data for a tournament
export const useScheduleAdmin = (tournamentId: string) => {
  return useQuery({
    queryKey: [...tournamentKeys.all, 'schedule-admin', tournamentId],
    queryFn: () => tournamentsService.getScheduleAdmin(tournamentId),
    enabled: !!tournamentId,
  });
};
