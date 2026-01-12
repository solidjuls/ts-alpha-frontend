import { useQuery } from '@tanstack/react-query';
import { ratingService, GetPlayerRatingsParams, GetRatingHistoryParams } from 'services/rating.service';

// Query keys for consistent caching
export const ratingKeys = {
  all: ['rating'] as const,
  players: () => [...ratingKeys.all, 'players'] as const,
  playersList: (params: GetPlayerRatingsParams) => [...ratingKeys.players(), params] as const,
  health: () => [...ratingKeys.all, 'health'] as const,
  history: (params: GetRatingHistoryParams) => [...ratingKeys.all, 'history', params] as const,
};

// Hook for getting player ratings with pagination and filtering
export const usePlayerRatings = (params: GetPlayerRatingsParams = {}) => {
  return useQuery({
    queryKey: ratingKeys.playersList(params),
    queryFn: () => ratingService.getPlayerRatings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    // Keep previous data while fetching new data (for smooth pagination)
    placeholderData: (previousData) => previousData,
  });
};

// Hook for rating service health check
export const useRatingHealth = () => {
  return useQuery({
    queryKey: ratingKeys.health(),
    queryFn: () => ratingService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for getting rating history for a user
export const useRatingHistory = (params: GetRatingHistoryParams) => {
  return useQuery({
    queryKey: ratingKeys.history(params),
    queryFn: () => ratingService.getRatingHistory(params),
    enabled: !!params.userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
