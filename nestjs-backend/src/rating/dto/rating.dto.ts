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

export interface GetPlayerRatingsQueryDto {
  // Pagination
  p?: string; // page
  pso?: string; // page size
  
  // Filters
  playerFilter?: string; // comma-separated player IDs
  countrySelected?: string; // country ID
  playdeck?: string; // playdek name filter
  name?: string; // first name + last name search
  federation?: string; // country name search
  
  // Sorting
  orderBy?: 'rating' | 'name' | 'country';
  orderDirection?: 'asc' | 'desc';
}
