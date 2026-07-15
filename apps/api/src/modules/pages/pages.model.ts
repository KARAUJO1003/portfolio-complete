import { Schema, model, models } from "mongoose";
import type { PublicationStatus } from "@portfolio/contracts";

export type CustomPageDocument = {
  _id: string;
  ownerId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PublicationStatus;
  order: number;
  showInNavigation: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const customPageSchema = new Schema<CustomPageDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    order: { type: Number, default: 0 },
    showInNavigation: { type: Boolean, default: false },
  },
  { timestamps: true },
);

customPageSchema.index({ ownerId: 1, slug: 1 }, { unique: true });

export const CustomPageModel =
  models.CustomPage || model<CustomPageDocument>("CustomPage", customPageSchema);
