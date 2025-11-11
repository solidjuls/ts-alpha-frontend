import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  usersService,
  User,
  UserDetail,
  UsersListResponse,
  GetUsersParams,
  CreateUserData,
  UpdateUserData,
} from '../services/users.service';

// Query keys for cache management
export const USERS_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetUsersParams) => [...USERS_QUERY_KEYS.lists(), params] as const,
  details: () => [...USERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USERS_QUERY_KEYS.details(), id] as const,
  byTournament: (tournamentId: string) => [...USERS_QUERY_KEYS.all, 'byTournament', tournamentId] as const,
  allUsers: (page: number, pageSize: number, search?: string) => 
    [...USERS_QUERY_KEYS.all, 'allUsers', page, pageSize, search] as const,
};

// Hook to get users with flexible parameters
export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.list(params),
    queryFn: () => usersService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get users by tournament
export const useUsersByTournament = (tournamentId: string) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.byTournament(tournamentId),
    queryFn: () => usersService.getUsersByTournament(tournamentId),
    enabled: !!tournamentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all users with pagination
export const useAllUsers = (page: number = 1, pageSize: number = 50, search?: string) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.allUsers(page, pageSize, search),
    queryFn: () => usersService.getAllUsers(page, pageSize, search),
    keepPreviousData: true, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get user by ID
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => usersService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users lists
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });
};

// Hook to update an existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserData) => usersService.updateUser(userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch users lists
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      
      // If we have the user ID, invalidate the specific user detail
      // Note: We'd need to modify the service to return user ID or find it another way
      // For now, we'll invalidate all user details
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.details() });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });
};

// Utility hook to prefetch users by tournament
export const usePrefetchUsersByTournament = () => {
  const queryClient = useQueryClient();

  return (tournamentId: string) => {
    queryClient.prefetchQuery({
      queryKey: USERS_QUERY_KEYS.byTournament(tournamentId),
      queryFn: () => usersService.getUsersByTournament(tournamentId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Utility hook to prefetch user details
export const usePrefetchUserById = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: USERS_QUERY_KEYS.detail(id),
      queryFn: () => usersService.getUserById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};
