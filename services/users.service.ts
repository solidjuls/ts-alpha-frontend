import axios, { AxiosInstance } from 'axios';

// User interfaces
export interface User {
  id: string;
  name: string;
  countryCode?: string;
  rating?: number;
}

export interface UserDetail {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone_number?: string;
  last_login_at?: string;
  preferred_gaming_platform?: string;
  preferred_game_duration?: string;
  timezone_id?: string;
  cities?: {
    id: number;
    name: string;
  };
  countries?: {
    id: number;
    country_name: string;
  };
  rating?: number;
}

export interface GetUsersParams {
  tournamentId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface UsersListResponse {
  results: User[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone_number?: string;
  preferredGamingPlatform?: string;
  preferredGameDuration?: string;
  city?: number;
  country?: number;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  preferredGamingPlatform?: string;
  preferredGameDuration?: string;
  city?: number;
  country?: number;
}

class UsersService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Get all users with optional filters
  async getUsers(params: GetUsersParams = {}): Promise<UsersListResponse | User[]> {
    const queryParams = new URLSearchParams();

    if (params.tournamentId) queryParams.append('tournamentId', params.tournamentId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await this.axiosInstance.get(`/users?${queryParams.toString()}`);
    return response.data?.results;
  }

  // Get users by tournament (returns simple User[] array)
  async getUsersByTournament(tournamentId: string): Promise<User[]> {
    const response = await this.axiosInstance.get(`/users?tournamentId=${tournamentId}`);
    return response.data;
  }

  // Get all users with pagination (returns UsersListResponse)
  async getAllUsers(page: number = 1, pageSize: number = 50, search?: string): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    if (search) queryParams.append('search', search);

    const response = await this.axiosInstance.get(`/users?${queryParams.toString()}`);
    return response.data;
  }

  // Get all users with email (admin only)
  async getAllUsersWithEmail(page: number = 1, pageSize: number = 50, search?: string): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    queryParams.append('includeEmail', 'true');
    if (search) queryParams.append('search', search);

    const response = await this.axiosInstance.get(`/users?${queryParams.toString()}`);
    return response.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserDetail> {
    const response = await this.axiosInstance.get(`/users/${id}`);
    return response.data;
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<{ message: string }> {
    const response = await this.axiosInstance.put('/users', userData);
    return response.data;
  }

  // Update existing user
  async updateUser(userData: UpdateUserData): Promise<{ message: string }> {
    const response = await this.axiosInstance.post('/users', userData);
    return response.data;
  }
}

// Export singleton instance
export const usersService = new UsersService();
export default usersService;
