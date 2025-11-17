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
      baseURL: 'http://localhost:4002/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllCountries(): Promise<Country[]> {
    const response = await this.axiosInstance.get('/countries');
    return response.data;
  }
}

export const countriesService = new CountriesService();
export default countriesService;
