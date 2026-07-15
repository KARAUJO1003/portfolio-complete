import type { CreateSkillRequest, UpdateSkillRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toSkillDto } from "./skills.mapper";
import * as repository from "./skills.repository";

export async function list(ownerId: string) {
  const skills = await repository.listSkills(ownerId);
  return skills.map(toSkillDto);
}

export async function create(ownerId: string, input: CreateSkillRequest) {
  const skill = await repository.createSkill(ownerId, input);
  return toSkillDto(skill);
}

export async function update(ownerId: string, id: string, input: UpdateSkillRequest) {
  const skill = await repository.updateSkill(ownerId, id, input);
  if (!skill) throw new ApiError("Skill not found", 404);
  return toSkillDto(skill);
}

export async function remove(ownerId: string, id: string) {
  const skill = await repository.deleteSkill(ownerId, id);
  if (!skill) throw new ApiError("Skill not found", 404);
}
