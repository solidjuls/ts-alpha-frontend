import { AxiosInstance } from 'axios';
import { createAuthenticatedAxios } from '../utils/api';

// City interfaces
export interface City {
  id: string;
  name: string;
}

class CitiesService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createAuthenticatedAxios();
  }

  async getCities(searchQuery?: string): Promise<City[]> {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await this.axiosInstance.get('/cities', { params });
    return response.data;
  }
}

export const citiesService = new CitiesService();
export default citiesService;
