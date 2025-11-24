import getAxiosInstance from "utils/axios";

export interface PlayerRatingDto {
  id: string;
  rank: number;
  name: string;
  first_name: string;
  last_name: string;
  countryCode?: string;
  country_name?: string;
  rating: number;
  playdek_name?: string;
}

export interface PlayerRatingListResponse {
  results: PlayerRatingDto[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
}

export interface GetPlayerRatingsParams {
  page?: number;
  pageSize?: number;
  playerFilter?: string[];
  countrySelected?: string;
  playdeck?: string;
  name?: string;
  federation?: string;
  orderBy?: 'rating' | 'name' | 'country';
  orderDirection?: 'asc' | 'desc';
}

class RatingService {
  async getPlayerRatings(params: GetPlayerRatingsParams = {}): Promise<PlayerRatingListResponse> {
    const {
      page = 1,
      pageSize = 20,
      playerFilter,
      countrySelected,
      playdeck,
      name,
      federation,
      orderBy = 'rating',
      orderDirection = 'desc',
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('p', page.toString());
    queryParams.append('pso', pageSize.toString());
    queryParams.append('orderBy', orderBy);
    queryParams.append('orderDirection', orderDirection);

    if (playerFilter && playerFilter.length > 0) {
      queryParams.append('playerFilter', playerFilter.join(','));
    }
    if (countrySelected) {
      queryParams.append('countrySelected', countrySelected);
    }
    if (playdeck) {
      queryParams.append('playdeck', playdeck);
    }
    if (name) {
      queryParams.append('name', name);
    }
    if (federation) {
      queryParams.append('federation', federation);
    }

    const response = await getAxiosInstance().get(`/api/rating?${queryParams.toString()}`);
    return response.data;
  }
}

export const ratingService = new RatingService();
