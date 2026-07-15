import { Schema, model, models } from "mongoose";

export type UploadDocument = {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

const uploadSchema = new Schema<UploadDocument>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    createdBy: { type: String },
  },
  { timestamps: true },
);

export const UploadModel =
  models.Upload || model<UploadDocument>("Upload", uploadSchema);
