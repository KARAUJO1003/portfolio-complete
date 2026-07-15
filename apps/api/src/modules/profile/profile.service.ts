import type { UpsertProfileRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toProfileDto } from "./profile.mapper";
import * as repository from "./profile.repository";

export async function getMyProfile(ownerId: string) {
  const profile = await repository.findProfileByOwner(ownerId);
  return profile ? toProfileDto(profile) : null;
}

export async function saveMyProfile(ownerId: string, input: UpsertProfileRequest) {
  const profile = await repository.upsertProfile(ownerId, input);
  if (!profile) {
    throw new ApiError("Profile could not be saved", 500);
  }
  return toProfileDto(profile);
}
