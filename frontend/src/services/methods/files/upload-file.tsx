import { apiClient } from "@/services/api-client/client-api";

export type UploadResult = {
  message: string;
  filePath: string;
  url: string;
} | null;

export async function uploadFile(file: File) {
  return await apiClient.postFile<UploadResult>("files/upload", file);
}
