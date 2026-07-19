import { Schema, model, models } from "mongoose";

export type PageVisitDocument = {
  _id: string;
  visitorHash: string;
  path: string;
  referrerHost: string;
  deviceType: "desktop" | "mobile" | "tablet";
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Nao escopado por ownerId de proposito: o portfolio publico ja e single-tenant
 * hoje (`getPublicPortfolio` tambem nao escopa por owner, ver public-portfolio.service.ts).
 */
const pageVisitSchema = new Schema<PageVisitDocument>(
  {
    visitorHash: { type: String, required: true, index: true },
    path: { type: String, default: "" },
    referrerHost: { type: String, default: "" },
    deviceType: { type: String, enum: ["desktop", "mobile", "tablet"], default: "desktop" },
  },
  { timestamps: true },
);

pageVisitSchema.index({ createdAt: -1 });

export const PageVisitModel =
  models.PageVisit || model<PageVisitDocument>("PageVisit", pageVisitSchema);
