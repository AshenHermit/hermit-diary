import { apiClient } from "@services/api-client/client-api";
import { SocialLink, User } from "@services/types/user";

export async function getUserSocialLinks(userId: number) {
  return await apiClient.get<SocialLink[], {}>(`users/${userId}/sociallinks`);
}

export async function addUserSocialLink(userId: number) {
  return await apiClient.post<SocialLink, {}>(`users/${userId}/sociallinks`);
}

export async function updateUserSocialLink(
  userId: number,
  socialLink: SocialLink
) {
  return await apiClient.patch<boolean, SocialLink>(
    `users/${userId}/sociallinks/${socialLink.id}`,
    socialLink
  );
}

export async function deleteSocialLink(userId: number, socialLink: SocialLink) {
  return await apiClient.delete<boolean, {}>(
    `users/${userId}/sociallinks/${socialLink.id}`
  );
}
