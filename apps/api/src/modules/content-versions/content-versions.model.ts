import type { ContentVersionKind, ContentVersionSection, ContentVersionStatus } from "@portfolio/contracts";
import { Schema, model, models } from "mongoose";

export type ContentVersionDocument = {
  _id: string;
  ownerId: string;
  kind: ContentVersionKind;
  name: string;
  slug: string;
  template: string;
  status: ContentVersionStatus;
  sections: ContentVersionSection[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const sectionSchema = new Schema<ContentVersionSection>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    selectionMode: { type: String, enum: ["all", "selected"], default: "all" },
    itemIds: { type: [String], default: [] },
  },
  { _id: false },
);

const contentVersionSchema = new Schema<ContentVersionDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    kind: { type: String, enum: ["portfolio", "resume"], required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    template: { type: String, default: "default" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    sections: { type: [sectionSchema], default: [] },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

contentVersionSchema.index({ ownerId: 1, kind: 1, slug: 1 }, { unique: true });

export const ContentVersionModel =
  models.ContentVersion || model<ContentVersionDocument>("ContentVersion", contentVersionSchema);
