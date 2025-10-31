import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tournamentsService, {
  Tournament,
  RegisteredPlayer,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  RegisterTournamentRequest,
  UpdateTournamentStatusRequest,
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
    enabled: !!params,
  });
};
