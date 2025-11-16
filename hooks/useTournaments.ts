import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tournamentsService, {
  CreateTournamentRequest,
  UpdateTournamentRequest,
  RegisterTournamentRequest,
  UpdateTournamentStatusRequest,
  TournamentAdmin,
  AddTournamentAdminRequest,
  RemoveTournamentAdminRequest,
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
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(variables.id.toString()) });
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
