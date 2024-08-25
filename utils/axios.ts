import axios, { AxiosInstance } from "axios";
import { setupCache, CacheAxiosResponse, CacheRequestConfig } from "axios-cache-interceptor";

// Define the API instance as `let` so we can reassign it in a singleton pattern
let api: AxiosInstance | undefined;

export const getAxiosInstance = (): AxiosInstance => {
  if (!api) {
    // Create the axios instance with caching only once
    api = setupCache(
      axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
        headers: {
          "Content-Type": "application/json",
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

export default getAxiosInstance;
