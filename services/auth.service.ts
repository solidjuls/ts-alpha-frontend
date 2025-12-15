import axios from 'axios';
import { getToken, setToken, removeToken } from '../utils/cookies';

// Create axios instance for NestJS backend
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach Authorization header
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log 401 errors but don't automatically remove token
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized on auth API:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  mail: string;
  pwd: string;
}

export interface ImpersonateRequest {
  email: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  id: string;
  role: number;
  tournaments: number[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  playdek_name: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
}

export interface CreateUserResponse {
  success: boolean;
  user: {
    name: string;
    email: string;
    id: string;
    role: number;
    tournaments: number[];
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  playdek_name: string;
  countryId?: string;
  cityId?: string;
  phoneNumber?: string;
  preferredGamingPlatform?: string;
  preferredGameDuration?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    playdek_name: string;
    email: string;
    id: string;
    role: number;
    tournaments: number[];
  };
}

export interface ResetPasswordRequest {
  mail: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface EmailVerifyRequest {
  email: string;
}

export interface EmailVerifyConfirmRequest {
  token: string;
}

export interface EmailVerifyResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: number;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    const data = response.data;

    // Save token to localStorage
    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  // Impersonate user (superadmin only)
  impersonate: async (data: ImpersonateRequest): Promise<LoginResponse> => {
    const response = await authApi.post('/auth/impersonate', data);
    const responseData = response.data;

    // Save token to localStorage
    if (responseData.token) {
      setToken(responseData.token);
    }

    return responseData;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean }> => {
    removeToken();

    // Optionally call backend to invalidate session (if needed)
    try {
      await authApi.post('/auth/logout');
    } catch {
      // Ignore errors - token is already removed locally
    }

    return { success: true };
  },

  // Get current user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await authApi.get('/auth/profile');
    return response.data;
  },

  // Request password reset
  resetPasswordRequest: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await authApi.post('/auth/reset-password-request', data);
    return response.data;
  },

  // Create new user (for testing purposes)
  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await authApi.post('/auth/create-user', userData);
    return response.data;
  },

  // Request email verification
  requestEmailVerification: async (data: EmailVerifyRequest): Promise<EmailVerifyResponse> => {
    const response = await authApi.post('/auth/email-verify', data);
    return response.data;
  },

  // Confirm email verification
  confirmEmailVerification: async (data: EmailVerifyConfirmRequest): Promise<EmailVerifyResponse> => {
    const response = await authApi.post('/auth/email-verify/confirm', data);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await authApi.get('/auth/health');
    return response.data;
  },
};

export default authService;
