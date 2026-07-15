import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().default(""),
  summary: z.string().default(""),
  objective: z.string().default(""),
  location: z.string().default(""),
  address: z.string().default(""),
  birthDate: z.string().default(""),
  driverLicense: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().default(""),
  website: z.string().url().or(z.literal("")).default(""),
  github: z.string().url().or(z.literal("")).default(""),
  linkedin: z.string().url().or(z.literal("")).default(""),
  avatarPath: z.string().default(""),
});

export const upsertProfileRequestSchema = profileSchema;

export type ProfileDto = z.infer<typeof profileSchema> & {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertProfileRequest = z.infer<typeof upsertProfileRequestSchema>;
