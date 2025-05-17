import { NEXT_PUBLIC_API_URL } from "@constants";
import axios from "axios";
import { ApiClient } from "./api-client";

function createAxiosClient() {
  const axiosClient = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
  });
  axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
      if (match) {
        config.headers.Authorization = `Bearer ${match[1]}`;
      }
    }
    return config;
  });
  return axiosClient;
}

export const apiClient = new ApiClient(createAxiosClient());
