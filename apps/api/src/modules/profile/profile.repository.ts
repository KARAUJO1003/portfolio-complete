import type { UpsertProfileRequest } from "@portfolio/contracts";
import { ProfileModel } from "./profile.model";

export async function findProfileByOwner(ownerId: string) {
  return ProfileModel.findOne({ ownerId });
}

export async function upsertProfile(ownerId: string, data: UpsertProfileRequest) {
  return ProfileModel.findOneAndUpdate(
    { ownerId },
    { $set: { ...data, ownerId } },
    { new: true, upsert: true },
  );
}
