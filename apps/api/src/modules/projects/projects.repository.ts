import type { CreateProjectRequest, UpdateProjectRequest } from "@portfolio/contracts";
import { ProjectLikeModel } from "../project-likes/project-like.model";
import { ProjectModel } from "./projects.model";

export async function listProjects(ownerId: string) {
  return ProjectModel.find({ ownerId }).sort({ order: 1, createdAt: -1 });
}

export async function countLikesInRange(ownerId: string, from: Date, to?: Date) {
  const projects = await ProjectModel.find({ ownerId }).select("_id").lean();
  const projectIds = projects.map((project) => String(project._id));
  if (!projectIds.length) return 0;

  const createdAt: Record<string, Date> = { $gte: from };
  if (to) createdAt.$lt = to;

  return ProjectLikeModel.countDocuments({ projectId: { $in: projectIds }, createdAt });
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
