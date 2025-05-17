import { apiClient } from "@services/api-client/client-api";
import { User } from "@services/types/user";

export async function getProfile(data?: {}) {
  return await apiClient.get<User, typeof data>("users/profile");
}

export async function updateProfile(data: Partial<User>) {
  return await apiClient.patch<User, typeof data>("users/profile", data);
}
