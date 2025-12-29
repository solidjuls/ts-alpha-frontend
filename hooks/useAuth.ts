import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import authService, {
  LoginRequest,
  ImpersonateRequest,
  ResetPasswordRequest,
  ResetPasswordConfirmRequest,
  CreateUserRequest,
  RegisterRequest,
  EmailVerifyRequest,
  EmailVerifyConfirmRequest
} from '../services/auth.service';
import { getToken, getUserFromToken, removeToken, isTokenExpired, UserPayload } from '../utils/cookies';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  health: () => [...authKeys.all, 'health'] as const,
};

// Hook for getting user profile from localStorage token
export const useProfile = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      removeToken();
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Decode token to get user info
    const userFromToken = getUserFromToken();
    setUser(userFromToken);
    setIsLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return {
    data: user,
    isLoading,
    error: null,
  };
};

// Hook for login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      // Force a full page reload to reset all auth state
      window.location.href = '/';
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

// Hook for impersonate mutation
export const useImpersonate = () => {
  return useMutation({
    mutationFn: (data: ImpersonateRequest) => authService.impersonate(data),
    onSuccess: () => {
      // Force a full page reload to reset all auth state
      window.location.href = '/';
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
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Force a full page reload to reset all auth state
      window.location.href = '/login';
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
    },
  });
};

// // Hook for password reset request
// export const useResetPasswordRequest = () => {
//   return useMutation({
//     mutationFn: (data: ResetPasswordRequest) => authService.resetPasswordRequest(data),
//     onError: (error: any) => {
//       console.error('Password reset request failed:', error);
//     },
//   });
// };

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

// Hook for email verification request mutation
export const useEmailVerificationRequest = () => {
  return useMutation({
    mutationFn: (data: EmailVerifyRequest) => authService.requestEmailVerification(data),
    onError: (error: any) => {
      console.error('Email verification request failed:', error);
    },
  });
};

// Hook for email verification confirmation mutation
export const useEmailVerificationConfirm = () => {
  return useMutation({
    mutationFn: (data: EmailVerifyConfirmRequest) => authService.confirmEmailVerification(data),
    onError: (error: any) => {
      console.error('Email verification confirmation failed:', error);
    },
  });
};

// Hook for password reset request mutation
export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPasswordRequest(data),
    onError: (error: any) => {
      console.error('Password reset request failed:', error);
    },
  });
};

// Hook for password reset confirmation mutation
export const useResetPasswordConfirm = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordConfirmRequest) => authService.resetPasswordConfirm(data),
    onError: (error: any) => {
      console.error('Password reset confirmation failed:', error);
    },
  });
};

// Custom hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: profile, isLoading } = useProfile();

  return {
    isAuthenticated: !!profile,
    isLoading,
    user: profile,
  };
};

// Hook to get current user info synchronously (for components that need immediate access)
export const useCurrentUser = (): UserPayload | null => {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  return user;
};
