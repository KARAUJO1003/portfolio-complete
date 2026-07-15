import type { CreateProjectRequest, UpdateProjectRequest } from "@portfolio/contracts";
import { ProjectModel } from "./projects.model";

export async function listProjects(ownerId: string) {
  return ProjectModel.find({ ownerId }).sort({ order: 1, createdAt: -1 });
}

export async function createProject(ownerId: string, data: CreateProjectRequest) {
  return ProjectModel.create({ ...data, ownerId });
}

export async function updateProject(ownerId: string, id: string, data: UpdateProjectRequest) {
  return ProjectModel.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: data },
    { new: true },
  );
}

export async function deleteProject(ownerId: string, id: string) {
  return ProjectModel.findOneAndDelete({ _id: id, ownerId });
}
