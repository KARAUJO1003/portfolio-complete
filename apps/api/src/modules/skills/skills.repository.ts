import type { CreateSkillRequest, UpdateSkillRequest } from "@portfolio/contracts";
import { SkillModel } from "./skills.model";

export async function listSkills(ownerId: string) {
  return SkillModel.find({ ownerId }).sort({ order: 1, createdAt: -1 });
}

export async function createSkill(ownerId: string, data: CreateSkillRequest) {
  return SkillModel.create({ ...data, ownerId });
}

export async function updateSkill(ownerId: string, id: string, data: UpdateSkillRequest) {
  return SkillModel.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: data },
    { new: true },
  );
}

export async function deleteSkill(ownerId: string, id: string) {
  return SkillModel.findOneAndDelete({ _id: id, ownerId });
}
