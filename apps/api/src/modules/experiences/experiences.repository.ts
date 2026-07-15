import type { CreateExperienceRequest, UpdateExperienceRequest } from "@portfolio/contracts";
import { ExperienceModel } from "./experiences.model";

export async function listExperiences(ownerId: string) {
  return ExperienceModel.find({ ownerId }).sort({ order: 1, startDate: -1 });
}

export async function createExperience(ownerId: string, data: CreateExperienceRequest) {
  return ExperienceModel.create({ ...data, ownerId });
}

export async function updateExperience(ownerId: string, id: string, data: UpdateExperienceRequest) {
  return ExperienceModel.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: data },
    { new: true },
  );
}

export async function deleteExperience(ownerId: string, id: string) {
  return ExperienceModel.findOneAndDelete({ _id: id, ownerId });
}
