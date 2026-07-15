import { Schema, model, models } from "mongoose";
import type { ExperienceType, ProjectVisibility } from "@portfolio/contracts";

export type ExperienceDocument = {
  _id: string;
  ownerId: string;
  type: ExperienceType;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  url: string;
  order: number;
  visibility: ProjectVisibility;
  createdAt: Date;
  updatedAt: Date;
};

const experienceSchema = new Schema<ExperienceDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["work", "education", "certification", "link"],
      default: "work",
    },
    title: { type: String, required: true },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visibility: {
      portfolio: { type: Boolean, default: false },
      resume: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export const ExperienceModel =
  models.Experience || model<ExperienceDocument>("Experience", experienceSchema);
