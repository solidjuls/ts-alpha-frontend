import { useQuery } from '@tanstack/react-query';
import { citiesService, City } from 'services/cities.service';

// Query keys for cities
export const citiesKeys = {
  all: ['cities'] as const,
  lists: () => [...citiesKeys.all, 'list'] as const,
  search: (query?: string) => [...citiesKeys.lists(), 'search', query] as const,
};

// Hook to get cities with optional search
export const useCities = (searchQuery?: string) => {
  return useQuery({
    queryKey: citiesKeys.search(searchQuery),
    queryFn: () => citiesService.getCities(searchQuery),
    enabled: true, // Always enabled, but can be empty search
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
