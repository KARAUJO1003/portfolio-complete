import type { CreateExperienceRequest, UpdateExperienceRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toExperienceDto } from "./experiences.mapper";
import * as repository from "./experiences.repository";

export async function list(ownerId: string) {
  const experiences = await repository.listExperiences(ownerId);
  return experiences.map(toExperienceDto);
}

export async function create(ownerId: string, input: CreateExperienceRequest) {
  const experience = await repository.createExperience(ownerId, input);
  return toExperienceDto(experience);
}

export async function update(ownerId: string, id: string, input: UpdateExperienceRequest) {
  const experience = await repository.updateExperience(ownerId, id, input);
  if (!experience) throw new ApiError("Experience not found", 404);
  return toExperienceDto(experience);
}

export async function remove(ownerId: string, id: string) {
  const experience = await repository.deleteExperience(ownerId, id);
  if (!experience) throw new ApiError("Experience not found", 404);
}
