export interface CityDto {
  id: string;
  name: string;
}

export interface GetCitiesQueryDto {
  q?: string; // Search query
}
