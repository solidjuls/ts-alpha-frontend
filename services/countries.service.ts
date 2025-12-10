import axios, { AxiosInstance } from 'axios';

// Country interfaces
export interface Country {
  id: string;
  country_name: string;
  tld_code: string;
}

class CountriesService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getCountries(searchQuery?: string): Promise<Country[]> {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await this.axiosInstance.get('/countries', { params });
    return response.data;
  }

  // Backward compatibility method
  async getAllCountries(): Promise<Country[]> {
    return this.getCountries();
  }
}

export const countriesService = new CountriesService();
export default countriesService;
