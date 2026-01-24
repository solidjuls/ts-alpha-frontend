import { Game } from 'types/game.types';
import { createAuthenticatedAxios } from '../utils/api';

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

export interface WinTypeStatsItem {
  total_games: string;
  wins: string;
  losses: string;
  ties: string;
  defcon_wins: string;
  final_scoring_wins: string;
  vp_track_wins: string;
  wargames_wins: string;
  forfeit_wins: string;
  timer_wins: string;
  cuban_wins: string;
  scoring_card_wins: string;
  unknown_wins: string;
  defcon_losses: string;
  final_scoring_losses: string;
  vp_track_losses: string;
  wargames_losses: string;
  forfeit_losses: string;
  timer_losses: string;
  cuban_losses: string;
  scoring_card_losses: string;
  unknown_losses: string;
}

export interface WinTypeStats {
  usaStats: WinTypeStatsItem[]
  ussrStats: WinTypeStatsItem[]
}

export interface GetChartDataParams {
  userId: string;
  fromDate: string;
  type: 'winType';
}

class GamesService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = createAuthenticatedAxios();
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

  async getChartData(params: GetChartDataParams): Promise<WinTypeStats> {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', params.userId);
    queryParams.append('type', params.type);
    queryParams.append('fromDate', params.fromDate);

    const response = await this.axiosInstance.get(`/games/chart-data?${queryParams.toString()}`);
    return response.data;
  }
}

export const gamesService = new GamesService();
export default gamesService;
