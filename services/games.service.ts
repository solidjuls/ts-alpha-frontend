import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api';

export interface GameRating {
  rating: number;
  previousRating: number;
}

export interface GameType {
  id: string;
  created_at: Date | null;
  updated_at: Date | null;
  usaPlayerId: string;
  ussrPlayerId: string;
  usaRatingDifference: number;
  ussrRatingDifference: number;
  tournamentId: string;
  tournamentName: string;
  game_code: string;
  reported_at: Date;
  gameWinner: string;
  endTurn: number | null;
  endMode: string | null;
  gameDate: Date;
  video1: string | null;
  videoURL: string;
  reporter_id: string | null;
  usaCountryCode: string;
  ussrCountryCode: string;
  usaPlayer: string;
  ussrPlayer: string;
  ratingsUSA: GameRating;
  ratingsUSSR: GameRating;
}

export interface GameListResponse {
  results: Game[];
  totalRows: number;
}

export interface GetGamesParams {
  id?: string;
  p?: number; // page
  pageSize?: number;
  userFilter?: string; // comma-separated user IDs
  toFilter?: string; // comma-separated tournament IDs
  video?: boolean; // filter games with videos
}

export interface RecreateGameParams {
  oldId: string;
  gameDate?: string;
  op?: 'delete';
  gameWinner?: string;
  gameCode?: string;
  tournamentId?: string;
  usaPlayerId?: string;
  ussrPlayerId?: string;
  endTurn?: string;
  endMode?: string;
  video1?: string;
}

export interface SubmitGameData {
  gameWinner: string;
  gameCode: string;
  tournamentId: string;
  usaPlayerId: string;
  ussrPlayerId: string;
  endTurn: string;
  endMode: string;
  video1?: string;
}

class GamesService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getGames(params: GetGamesParams = {}): Promise<GameListResponse> {
    const queryParams = new URLSearchParams();

    if (params.id) queryParams.append('id', params.id);
    if (params.p) queryParams.append('p', params.p.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.userFilter) queryParams.append('userFilter', params.userFilter);
    if (params.toFilter) queryParams.append('toFilter', params.toFilter);
    if (params.video) queryParams.append('video', 'true');

    const response = await this.axiosInstance.get(`/games?${queryParams.toString()}`);
    return response.data;
  }

  async getTopGames(count: number = 5): Promise<GameListResponse> {
    const response = await this.axiosInstance.get(`/games/top/${count}`);
    return response.data;
  }

  async getGameById(id: string) {
    const response = await this.axiosInstance.get(`/games/${id}`);
    return response.data;
  }

  async getGamesForHomepage(): Promise<GameListResponse> {
    return this.getTopGames(5);
  }

  async getGamesForResultsPage(page: number = 1, filters: Omit<GetGamesParams, 'p' | 'pageSize'> = {}): Promise<GameListResponse> {
    return this.getGames({
      ...filters,
      p: page,
      pageSize: 20,
    });
  }

  async submitGame(data: SubmitGameData): Promise<any> {
    const response = await this.axiosInstance.post('/games/submit', {
      data: data
    });
    return response.data;
  }

  async recreateGame(params: RecreateGameParams): Promise<any> {
    const response = await this.axiosInstance.post('/games/recreate', {
      data: params
    });
    return response.data;
  }

  async deleteGame(gameId: string): Promise<any> {
    return this.recreateGame({
      oldId: gameId,
      op: 'delete'
    });
  }
}

export const gamesService = new GamesService();
export default gamesService;
