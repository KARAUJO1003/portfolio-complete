import type { CreateProjectRequest, ProjectDto, UpdateProjectRequest } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listProjects() {
  const response = await api.get<{ projects: ProjectDto[] }>("/projects");
  return response.data.projects;
}

export async function createProject(input: CreateProjectRequest) {
  const response = await api.post<{ project: ProjectDto }>("/projects", input);
  return response.data.project;
}

export async function updateProject(id: string, input: UpdateProjectRequest) {
  const response = await api.put<{ project: ProjectDto }>(`/projects/${id}`, input);
  return response.data.project;
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`);
}
