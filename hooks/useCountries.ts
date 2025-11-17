import { useQuery } from '@tanstack/react-query';
import { countriesService, Country } from 'services/countries.service';

// Query keys for countries
export const countriesKeys = {
  all: ['countries'] as const,
  lists: () => [...countriesKeys.all, 'list'] as const,
  search: (query?: string) => [...countriesKeys.lists(), 'search', query] as const,
};

// Hook to get countries with optional search
export const useCountries = (searchQuery?: string) => {
  return useQuery({
    queryKey: countriesKeys.search(searchQuery),
    queryFn: () => countriesService.getCountries(searchQuery),
    enabled: !searchQuery || searchQuery.length >= 3, // Only fetch if no query or query >= 3 chars
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
