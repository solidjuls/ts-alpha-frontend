import { useQuery } from '@tanstack/react-query';
import { countriesService, Country } from 'services/countries.service';

// Query keys for countries
export const countriesKeys = {
  all: ['countries'] as const,
  lists: () => [...countriesKeys.all, 'list'] as const,
};

// Hook to get all countries
export const useCountries = () => {
  return useQuery({
    queryKey: countriesKeys.lists(),
    queryFn: () => countriesService.getAllCountries(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
