import { Schema, model, models } from "mongoose";

export type UserDocument = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: [] },
    permissions: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel = models.User || model<UserDocument>("User", userSchema);
