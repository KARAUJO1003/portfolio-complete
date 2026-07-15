import { Schema, model, models } from "mongoose";
export type {{PASCAL}}Document = {
  _id: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
{{FIELDS_TYPE}}
};
const schema = new Schema<{{PASCAL}}Document>({
  ownerId: { type: String, required: true, index: true },
{{FIELDS_MODEL}}
}, { timestamps: true });
export const {{PASCAL}}Model = models.{{PASCAL}} || model<{{PASCAL}}Document>("{{COLLECTION}}", schema);
