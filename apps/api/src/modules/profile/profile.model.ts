import { Schema, model, models } from "mongoose";

export type ProfileDocument = {
  _id: string;
  ownerId: string;
  name: string;
  headline: string;
  summary: string;
  objective: string;
  location: string;
  address: string;
  birthDate: string;
  driverLicense: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  avatarPath: string;
  createdAt: Date;
  updatedAt: Date;
};

const profileSchema = new Schema<ProfileDocument>(
  {
    ownerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    headline: { type: String, default: "" },
    summary: { type: String, default: "" },
    objective: { type: String, default: "" },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    birthDate: { type: String, default: "" },
    driverLicense: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    avatarPath: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ProfileModel =
  models.Profile || model<ProfileDocument>("Profile", profileSchema);
