import axios, { AxiosInstance } from 'axios';
import { getToken } from './cookies';

/**
 * Create an axios instance with authentication interceptor
 * This adds the Authorization header with the JWT token from localStorage
 */
export const createAuthenticatedAxios = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to attach Authorization header
  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log 401 errors but don't automatically remove token
      // The token might be valid but the user just doesn't have permission for this endpoint
      if (error.response?.status === 401) {
        console.warn('401 Unauthorized:', error.config?.url);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Singleton instance for general API calls
let apiInstance: AxiosInstance | null = null;

export const getApiInstance = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = createAuthenticatedAxios();
  }
  return apiInstance;
};

export default getApiInstance;

