import axios from 'axios';
import { GameRecreate } from '../types/game.types';

export interface RecreateGameRequest extends GameRecreate {
  // No additional fields needed - GameRecreate has all required fields
}

export interface RecreateGameResponse {
  success: boolean;
  [key: string]: any;
}

// Create axios instance for NestJS backend
const recreateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

class RecreateService {
  async recreateGame(data: RecreateGameRequest): Promise<RecreateGameResponse> {
    const response = await recreateApi.post('/games/recreate', { data });
    return response.data;
  }

  async getRecreateHealth(): Promise<{ status: string }> {
    const response = await recreateApi.get('/games/health');
    return response.data;
  }
}

export const recreateService = new RecreateService();
