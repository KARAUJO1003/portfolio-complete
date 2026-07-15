import { ProjectModel } from "../projects/projects.model";
import { ProjectLikeModel } from "./project-like.model";

export async function findPublicProjectById(projectId: string) {
  return ProjectModel.findOne({
    _id: projectId,
    status: "published",
    "visibility.portfolio": true,
  });
}

export async function createLike(projectId: string, visitorHash: string) {
  return ProjectLikeModel.create({ projectId, visitorHash });
}

export async function findLike(projectId: string, visitorHash: string) {
  return ProjectLikeModel.findOne({ projectId, visitorHash });
}

export async function deleteLike(projectId: string, visitorHash: string) {
  return ProjectLikeModel.findOneAndDelete({ projectId, visitorHash });
}

export async function countLikes(projectId: string) {
  return ProjectLikeModel.countDocuments({ projectId });
}

export async function syncProjectLikesCount(projectId: string, likesCount: number) {
  return ProjectModel.findByIdAndUpdate(projectId, { $set: { likesCount } }, { new: true });
}
