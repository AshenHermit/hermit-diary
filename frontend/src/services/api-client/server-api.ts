import { NEXT_PUBLIC_API_URL } from "@constants";
import axios from "axios";
import { ApiClient } from "./api-client";

function createAxiosClient() {
  const axiosClient = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
  });
  return axiosClient;
}

export const apiClient = new ApiClient(createAxiosClient());
