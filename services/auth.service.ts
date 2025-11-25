import axios from 'axios';

// Create axios instance for NestJS backend
const authApi = axios.create({
  baseURL: 'http://localhost:4002/api',
  withCredentials: true, // Important for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginRequest {
  mail: string;
  pwd: string;
}

export interface LoginResponse {
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

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: number;
  tournamentsAdmin: number[];
  tournamentsRegistered: number[];
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean }> => {
    const response = await authApi.post('/auth/logout');
    return response.data;
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

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await authApi.get('/auth/health');
    return response.data;
  },
};

export default authService;
