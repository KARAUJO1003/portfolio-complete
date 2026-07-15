import { Schema, model, models } from "mongoose";

export type ProjectLikeDocument = {
  _id: string;
  projectId: string;
  visitorHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const projectLikeSchema = new Schema<ProjectLikeDocument>(
  {
    projectId: { type: String, required: true, index: true },
    visitorHash: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

projectLikeSchema.index({ projectId: 1, visitorHash: 1 }, { unique: true });

export const ProjectLikeModel =
  models.ProjectLike || model<ProjectLikeDocument>("ProjectLike", projectLikeSchema);
