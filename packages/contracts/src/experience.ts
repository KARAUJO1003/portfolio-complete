import { z } from "zod";
import { projectVisibilitySchema } from "./project";

export const experienceTypeSchema = z.enum([
  "work",
  "education",
  "certification",
  "link",
]);

export const experienceSchema = z.object({
  type: experienceTypeSchema.default("work"),
  title: z.string().min(1),
  organization: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
  url: z.string().url().or(z.literal("")).default(""),
  order: z.coerce.number().default(0),
  visibility: projectVisibilitySchema.default({
    portfolio: false,
    resume: true,
  }),
});

export const createExperienceRequestSchema = experienceSchema;
export const updateExperienceRequestSchema = experienceSchema.partial();

export type ExperienceType = z.infer<typeof experienceTypeSchema>;
export type CreateExperienceRequest = z.infer<typeof createExperienceRequestSchema>;
export type UpdateExperienceRequest = z.infer<typeof updateExperienceRequestSchema>;

export type ExperienceDto = CreateExperienceRequest & {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
