import type { CreateSkillRequest, SkillDto, UpdateSkillRequest } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listSkills() {
  const response = await api.get<{ skills: SkillDto[] }>("/skills");
  return response.data.skills;
}

export async function createSkill(input: CreateSkillRequest) {
  const response = await api.post<{ skill: SkillDto }>("/skills", input);
  return response.data.skill;
}

export async function updateSkill(id: string, input: UpdateSkillRequest) {
  const response = await api.put<{ skill: SkillDto }>(`/skills/${id}`, input);
  return response.data.skill;
}

export async function deleteSkill(id: string) {
  await api.delete(`/skills/${id}`);
}
