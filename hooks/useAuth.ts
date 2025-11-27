import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import authService, {
  LoginRequest,
  ImpersonateRequest,
  LoginResponse,
  ResetPasswordRequest,
  CreateUserRequest,
  RegisterRequest
} from '../services/auth.service';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  health: () => [...authKeys.all, 'health'] as const,
};

// Hook for getting user profile
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data: LoginResponse) => {
      // Update the profile cache with the login response
      queryClient.setQueryData(authKeys.profile(), {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        tournamentsAdmin: [],
        tournamentsRegistered: data.tournaments || [],
      });

      // Redirect to home page
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

// Hook for impersonate mutation
export const useImpersonate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ImpersonateRequest) => authService.impersonate(data),
    onSuccess: (data: LoginResponse) => {
      // Update the profile cache with the impersonated user response
      queryClient.setQueryData(authKeys.profile(), {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        tournamentsAdmin: [],
        tournamentsRegistered: data.tournaments || [],
      });

      // Redirect to home page
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Impersonate failed:', error);
    },
  });
};

// Hook for registration mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data) => {
      // Update the profile cache with the registration response

      queryClient.setQueryData(authKeys.profile(), {
        id: data.user.id,
        email: data.user.email,
        name: data.user.playdek_name,
        role: data.user.role,
        tournamentsAdmin: [],
        tournamentsRegistered: data.user.tournaments || [],
      });

      // Redirect to home page
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // Redirect to login page
      router.push('/login');
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
    },
  });
};

// Hook for password reset request
export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPasswordRequest(data),
    onError: (error: any) => {
      console.error('Password reset request failed:', error);
    },
  });
};

// Hook for creating user (for testing)
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => authService.createUser(userData),
    onError: (error: any) => {
      console.error('User creation failed:', error);
    },
  });
};

// Hook for health check
export const useAuthHealth = () => {
  return useQuery({
    queryKey: authKeys.health(),
    queryFn: authService.healthCheck,
    retry: 3,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Custom hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: profile, isLoading, error } = useProfile();
  
  return {
    isAuthenticated: !!profile && !error,
    isLoading,
    user: profile,
  };
};
