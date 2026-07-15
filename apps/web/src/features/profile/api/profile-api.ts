import type { ProfileDto, UpsertProfileRequest } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function getMyProfile() {
  const response = await api.get<{ profile: ProfileDto | null }>("/profile/me");
  return response.data.profile;
}

export async function saveMyProfile(input: UpsertProfileRequest) {
  const response = await api.put<{ profile: ProfileDto }>("/profile/me", input);
  return response.data.profile;
}
