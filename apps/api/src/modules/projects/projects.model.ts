import { Schema, model, models } from "mongoose";
import type { PublicationStatus, ProjectVisibility } from "@portfolio/contracts";

export type ProjectDocument = {
  _id: string;
  ownerId: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverPath: string;
  demoUrl: string;
  repoUrl: string;
  technologies: string[];
  featured: boolean;
  order: number;
  status: PublicationStatus;
  visibility: ProjectVisibility;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const projectSchema = new Schema<ProjectDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    coverPath: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    visibility: {
      portfolio: { type: Boolean, default: true },
      resume: { type: Boolean, default: false },
    },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ ownerId: 1, slug: 1 }, { unique: true });

export const ProjectModel =
  models.Project || model<ProjectDocument>("Project", projectSchema);
