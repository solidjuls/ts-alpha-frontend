import axios, { AxiosInstance } from 'axios';
import { GameRecreate } from '../types/game.types';
import { createAuthenticatedAxios } from 'utils/api';

export interface RecreateGameRequest extends GameRecreate {
  // No additional fields needed - GameRecreate has all required fields
}

export interface RecreateGameResponse {
  success: boolean;
  [key: string]: any;
}

class RecreateService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createAuthenticatedAxios()
  }
  
  async recreateGame(data: RecreateGameRequest): Promise<RecreateGameResponse> {
    const response = await this.axiosInstance.post('/games/recreate', { data });
    return response.data;
  }

  async getRecreateHealth(): Promise<{ status: string }> {
    const response = await this.axiosInstance.get('/games/health');
    return response.data;
  }
}

export const recreateService = new RecreateService();
