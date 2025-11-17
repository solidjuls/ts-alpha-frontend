import axios, { AxiosInstance } from 'axios';

export interface ScheduleItem {
  id: string;
  tournamentId: string;
  tournamentName: string;
  usaPlayerId: string;
  ussrPlayerId: string;
  nameUsa: string;
  nameUssr: string;
  countryUsa: string;
  countryUssr: string;
  dueDate: string;
  gameDate: string | null;
  gameWinner: string | null;
  gameResultsId: string | null;
  gameCode: string;
  idUsa: string;
  idUssr: string;
}

export interface ScheduleListResponse {
  results: ScheduleItem[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
}

export interface GetScheduleParams {
  userId?: string;
  tournamentId?: string;
  page?: number;
  pageSize?: number;
  onlyPending?: boolean;
  orderBy?: 'dueDate' | 'gameDate' | 'tournamentName';
  orderDirection?: 'asc' | 'desc';
}

export interface AddScheduleParams {
  tournamentId: string;
  usaPlayerId: string;
  ussrPlayerId: string;
  dueDate: string;
  gameCode: string;
}

export interface UpdateScheduleParams {
  id: string;
  dueDate?: string;
  gameCode?: string;
}

export interface ReplacePlayerParams {
  tournamentId: string;
  oldPlayerId: string;
  newPlayerId: string;
}

class ScheduleService {
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

  async getSchedules(params: GetScheduleParams = {}): Promise<ScheduleListResponse> {
    const queryParams = new URLSearchParams();

    if (params.userId) queryParams.append('userId', params.userId);
    if (params.tournamentId) queryParams.append('tournamentId', params.tournamentId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.onlyPending) queryParams.append('onlyPending', 'true');
    if (params.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);

    const response = await this.axiosInstance.get(`/schedule?${queryParams.toString()}`);
    return response.data;
  }

  async getSchedulesByTournament(tournamentId: string, page: number = 1, pageSize: number = 20): Promise<ScheduleListResponse> {
    return this.getSchedules({ tournamentId, page, pageSize });
  }

  async getSchedulesByUser(userId: string, page: number = 1, pageSize: number = 20): Promise<ScheduleListResponse> {
    return this.getSchedules({ userId, page, pageSize });
  }

  async addSchedule(params: AddScheduleParams): Promise<{ message: string }> {
    const response = await this.axiosInstance.put('/schedule', {
      data: {
        usa: params.usaPlayerId,
        ussr: params.ussrPlayerId,
        t: params.tournamentId,
        d: params.dueDate,
        gc: params.gameCode
      }
    });
    return response.data;
  }

  async updateSchedule(params: UpdateScheduleParams): Promise<{ message: string }> {
    const response = await this.axiosInstance.put('/schedule', params);
    return response.data;
  }

  async replacePlayer(params: ReplacePlayerParams): Promise<{ message: string }> {
    const response = await this.axiosInstance.post('/schedule', params);
    return response.data;
  }

  async deleteSchedule(id: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/schedule/${id}`);
    return response.data;
  }

  async getScheduleHealth(): Promise<{ status: string }> {
    const response = await this.axiosInstance.get('/schedule/health');
    return response.data;
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
