import axios, { AxiosInstance } from 'axios';
import { createAuthenticatedAxios } from 'utils/api';

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
  randomSides: boolean;
  bestOf: number | null;
  idUsa: string;
  idUssr: string;
}

export interface ScheduleListResponse {
  results: ScheduleItem[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
  defaultTournament: string;
}

export interface GetScheduleParams {
  userId?: string;
  tournamentId?: string;
  a?: number;
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
  randomSides: boolean;
  dueDate: string;
  gameCode: string;
}

export interface UpdateScheduleParams {
  id: string;
  dueDate?: string;
  gameCode?: string;
}

export interface UpdateScheduleOpponentParams {
  id: string;
  opponentId: string;
  dueDate: string;
  randomSides: boolean;
}

export interface ReplacePlayerParams {
  tournamentId: string;
  oldPlayerId: string;
  newPlayerId: string;
}

export interface RemovePlayerParams {
  tournamentId: string;
  playerId: string;
}

export interface BatchScheduleItem {
  t: string;
  usa: string;
  ussr: string;
  randomSides: boolean;
  d: string;
  gc: string;
}

export interface CsvScheduleRow {
  due_date: string;
  game_code: string;
  usa_player_id: string;
  ussr_player_id: string;
  random?: 1 | 0
}

export interface UploadCsvScheduleParams {
  file: CsvScheduleRow[];
  tournament: string;
}

export interface CsvUploadResponse {
  success: boolean;
  message: string;
  created: number;
  errors: string[];
}

class ScheduleService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createAuthenticatedAxios()
  }
  
  async getSchedules(params: GetScheduleParams = {}): Promise<ScheduleListResponse> {
    const queryParams = new URLSearchParams();

    if (params.userId) queryParams.append('userId', params.userId);
    if (params.tournamentId) queryParams.append('tournamentId', params.tournamentId);
    if (params.a) queryParams.append('a', params.a.toString());
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
        randomSides: params.randomSides,
        d: params.dueDate,
        gc: params.gameCode
      }
    });
    return response.data;
  }

  async updateSchedule(params: UpdateScheduleParams): Promise<{ message: string }> {
    const response = await this.axiosInstance.post('/schedule', {
      data: {
        id: params.id,
        due_date: params.dueDate,
        game_code: params.gameCode,
      }
    });
    return response.data;
  }

  async updateScheduleOpponent(params: UpdateScheduleOpponentParams): Promise<{ message: string }> {
    const response = await this.axiosInstance.post('/schedule', {
      data: {
        id: params.id,
        opponent_id: params.opponentId,
        due_date: params.dueDate,
        random_sides: params.randomSides,
      }
    });
    return response.data;
  }

  async replacePlayer(params: ReplacePlayerParams): Promise<any> {
    const response = await this.axiosInstance.patch('/schedule', {
      data: {
        pold: params.oldPlayerId,
        pnew: params.newPlayerId,
        t: Number(params.tournamentId)
      }
    });
    return response.data;
  }

  async removePlayer(params: RemovePlayerParams): Promise<any> {
    const response = await this.axiosInstance.patch('/schedule', {
      data: {
        u: Number(params.playerId),
        t: Number(params.tournamentId)
      }
    });
    return response.data;
  }

  async deleteSchedule(id: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/schedule/${id}`);
    return response.data;
  }

  async uploadCsvSchedule(params: UploadCsvScheduleParams): Promise<CsvUploadResponse> {
    const response = await this.axiosInstance.post('/schedule/upload-csv', {
      data: params
    });
    return response.data;
  }

  async getScheduleHealth(): Promise<{ status: string }> {
    const response = await this.axiosInstance.get('/schedule/health');
    return response.data;
  }

  async createSchedulesBatch(schedules: BatchScheduleItem[]): Promise<{ message: string }> {
    const response = await this.axiosInstance.put('/schedule', { data: schedules });
    return response.data;
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
