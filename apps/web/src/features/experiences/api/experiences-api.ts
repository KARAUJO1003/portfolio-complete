import type {
  CreateExperienceRequest,
  ExperienceDto,
  UpdateExperienceRequest,
} from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listExperiences() {
  const response = await api.get<{ experiences: ExperienceDto[] }>("/experiences");
  return response.data.experiences;
}

export async function createExperience(input: CreateExperienceRequest) {
  const response = await api.post<{ experience: ExperienceDto }>("/experiences", input);
  return response.data.experience;
}

export async function updateExperience(id: string, input: UpdateExperienceRequest) {
  const response = await api.put<{ experience: ExperienceDto }>(`/experiences/${id}`, input);
  return response.data.experience;
}

export async function deleteExperience(id: string) {
  await api.delete(`/experiences/${id}`);
}
