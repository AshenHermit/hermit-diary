import { createEvent, EventHandler } from "@/lib/event-utils";
import { NEXT_PUBLIC_API_URL } from "@constants";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export class APIError extends AxiosError {}

export class ApiClient {
  axios: AxiosInstance;
  errorCallback: EventHandler<[string]>;

  constructor(axiosClient: AxiosInstance) {
    this.axios = axiosClient;
    this.errorCallback = createEvent();
  }

  async processResponse<T>(res: Promise<AxiosResponse<any, any>>) {
    try {
      let response = await res;
      return response.data as T;
    } catch (e: any) {
      let message = e.message;
      try {
        message = e.response.data.message;
      } catch (err) {}
      this.errorCallback(message);
      throw new APIError(message);
    }
  }

  async get<T, R>(endpoint: string, data?: R) {
    return this.processResponse<T>(this.axios.get(endpoint, { params: data }));
  }
  async post<T, R>(endpoint: string, data?: R) {
    return this.processResponse<T>(this.axios.post(endpoint, data));
  }
  async patch<T, R>(endpoint: string, data?: R) {
    return this.processResponse<T>(this.axios.patch(endpoint, data));
  }
  async delete<T, R>(endpoint: string, data?: R) {
    return this.processResponse<T>(
      this.axios.delete(endpoint, { params: data })
    );
  }

  async postFile<T>(endpoint: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.processResponse<T>(
      this.axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }
}
