import { apiClient } from "@/services/api-client/client-api";

export async function logoutProfile() {
  return await apiClient.post<boolean, {}>("auth/logout");
}
