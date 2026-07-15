import { Schema, model, models } from "mongoose";
import type { ProjectVisibility } from "@portfolio/contracts";

export type SkillDocument = {
  _id: string;
  ownerId: string;
  title: string;
  category: string;
  startedAt: string;
  description: string;
  icon: string;
  order: number;
  visibility: ProjectVisibility;
  createdAt: Date;
  updatedAt: Date;
};

const skillSchema = new Schema<SkillDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: "Geral" },
    startedAt: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visibility: {
      portfolio: { type: Boolean, default: true },
      resume: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export const SkillModel = models.Skill || model<SkillDocument>("Skill", skillSchema);
