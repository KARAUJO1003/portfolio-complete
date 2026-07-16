import type { ProjectVisibility, PublicationStatus } from "@portfolio/contracts";
import { Schema, model, models } from "mongoose";

export type CustomSectionDocument = {
  _id: string; ownerId: string; title: string; key: string; content: string; contentFormat: "html" | "markdown"; order: number;
  status: PublicationStatus; visibility: ProjectVisibility; createdAt: Date; updatedAt: Date;
};

const schema = new Schema<CustomSectionDocument>({
  ownerId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  key: { type: String, required: true },
  content: { type: String, default: "" },
  contentFormat: { type: String, enum: ["html", "markdown"], default: "html" },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  visibility: {
    portfolio: { type: Boolean, default: true },
    resume: { type: Boolean, default: false },
  },
}, { timestamps: true });

schema.index({ ownerId: 1, key: 1 }, { unique: true });
export const CustomSectionModel = models.CustomSection || model<CustomSectionDocument>("CustomSection", schema);
