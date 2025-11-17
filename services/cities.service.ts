import axios, { AxiosInstance } from 'axios';

// City interfaces
export interface City {
  id: string;
  name: string;
}

class CitiesService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:4002/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getCities(searchQuery?: string): Promise<City[]> {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await this.axiosInstance.get('/cities', { params });
    return response.data;
  }
}

export const citiesService = new CitiesService();
export default citiesService;
