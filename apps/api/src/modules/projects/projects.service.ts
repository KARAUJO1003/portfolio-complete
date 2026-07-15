import type { CreateProjectRequest, UpdateProjectRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toProjectDto } from "./projects.mapper";
import * as repository from "./projects.repository";

export async function list(ownerId: string) {
  const projects = await repository.listProjects(ownerId);
  return projects.map(toProjectDto);
}

export async function create(ownerId: string, input: CreateProjectRequest) {
  const project = await repository.createProject(ownerId, input);
  return toProjectDto(project);
}

export async function update(ownerId: string, id: string, input: UpdateProjectRequest) {
  const project = await repository.updateProject(ownerId, id, input);
  if (!project) throw new ApiError("Project not found", 404);
  return toProjectDto(project);
}

export async function remove(ownerId: string, id: string) {
  const project = await repository.deleteProject(ownerId, id);
  if (!project) throw new ApiError("Project not found", 404);
}
