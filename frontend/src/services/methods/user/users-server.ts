import { apiClient } from "@/services/api-client/server-api";
import { User } from "@/services/types/user";

export async function getUser(userId: number) {
  return await apiClient.get<User, {}>(`users/${userId}`);
}
