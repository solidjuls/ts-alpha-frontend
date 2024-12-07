import axios, { AxiosInstance } from "axios";
import {
  setupCache,
  AxiosCacheInstance,
  CacheAxiosResponse,
  CacheRequestConfig,
  buildKeyGenerator,
} from "axios-cache-interceptor";

// Define the API instance as `let` so we can reassign it in a singleton pattern
let api: AxiosCacheInstance | undefined;

export const getAxiosInstance = (): AxiosCacheInstance => {
  if (!api) {
    // Create the axios instance with caching only once
    api = setupCache(
      axios.create({
        baseURL: process.env.VERCEL_URL,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // You can specify specific domains instead of "*"
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }),
      {
        ttl: 1000 * 60 * 5,
        interpretHeader: true,
        methods: ["get"],
      },
    );
  }

  return api; // Return the singleton axios instance
};

export const clearAllCache = async (key) => {
  await api?.storage?.remove(key)
};

export default getAxiosInstance;
