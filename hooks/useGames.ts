import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import gamesService, { GameListResponse, GetGamesParams, Game, SubmitGameData, RecreateGameParams } from '../services/games.service';

// Query keys for React Query
export const GAMES_QUERY_KEYS = {
  all: ['games'] as const,
  lists: () => [...GAMES_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetGamesParams) => [...GAMES_QUERY_KEYS.lists(), params] as const,
  details: () => [...GAMES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...GAMES_QUERY_KEYS.details(), id] as const,
  top: (count: number) => [...GAMES_QUERY_KEYS.all, 'top', count] as const,
  homepage: () => [...GAMES_QUERY_KEYS.all, 'homepage'] as const,
  resultsPage: (page: number, filters: Omit<GetGamesParams, 'p' | 'pageSize'>) => 
    [...GAMES_QUERY_KEYS.all, 'resultsPage', page, filters] as const,
};

// Hook for getting games with filters and pagination
export const useGames = (
  params: GetGamesParams = {},
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.list(params),
    queryFn: () => gamesService.getGames(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook for getting top N games
export const useTopGames = (
  count: number = 5,
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.top(count),
    queryFn: () => gamesService.getTopGames(count),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Hook for getting a single game by ID
export const useGame = (
  id: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.detail(id),
    queryFn: () => gamesService.getGameById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook specifically for homepage (top 5 games)
export const useGamesForHomepage = (
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.homepage(),
    queryFn: () => gamesService.getGamesForHomepage(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Hook specifically for results page (20 games per page)
export const useGamesForResultsPage = (
  page: number = 1,
  filters: Omit<GetGamesParams, 'p' | 'pageSize'> = {},
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.resultsPage(page, filters),
    queryFn: () => gamesService.getGamesForResultsPage(page, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while loading new page
    ...options,
  });
};

// Hook for games with video filter
export const useGamesWithVideos = (
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.list({ p: page, pageSize, video: true }),
    queryFn: () => gamesService.getGames({ p: page, pageSize, video: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for games by specific users
export const useGamesByUsers = (
  userIds: string[],
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  const userFilter = userIds.join(',');
  
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.list({ userFilter, p: page, pageSize }),
    queryFn: () => gamesService.getGames({ userFilter, p: page, pageSize }),
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for games by tournaments
export const useGamesByTournaments = (
  tournamentIds: string[],
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions<GameListResponse, Error>
) => {
  const toFilter = tournamentIds.join(',');
  
  return useQuery({
    queryKey: GAMES_QUERY_KEYS.list({ toFilter, p: page, pageSize }),
    queryFn: () => gamesService.getGames({ toFilter, p: page, pageSize }),
    enabled: tournamentIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    ...options,
  });
};

// Hook for submitting a game
export const useSubmitGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitGameData) => gamesService.submitGame(data),
    onSuccess: () => {
      // Invalidate and refetch games lists
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.homepage() });
    },
    onError: (error: any) => {
      console.error('Submit game failed:', error);
    },
  });
};

// Hook for recreating a game (can also be used for deletion)
export const useRecreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RecreateGameParams) => gamesService.recreateGame(params),
    onSuccess: () => {
      // Invalidate and refetch games lists and details
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.homepage() });
    },
    onError: (error: any) => {
      console.error('Recreate game failed:', error);
    },
  });
};

// Hook for deleting a game
export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: string) => gamesService.deleteGame(gameId),
    onSuccess: () => {
      // Invalidate and refetch games lists and details
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEYS.homepage() });
    },
    onError: (error: any) => {
      console.error('Delete game failed:', error);
    },
  });
};
