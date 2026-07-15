import { z } from "zod";
import { projectVisibilitySchema } from "./project";

export const skillSchema = z.object({
  title: z.string().min(1),
  category: z.string().default("Geral"),
  startedAt: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().default(""),
  order: z.coerce.number().default(0),
  visibility: projectVisibilitySchema.default({
    portfolio: true,
    resume: true,
  }),
});

export const createSkillRequestSchema = skillSchema;
export const updateSkillRequestSchema = skillSchema.partial();

export type CreateSkillRequest = z.infer<typeof createSkillRequestSchema>;
export type UpdateSkillRequest = z.infer<typeof updateSkillRequestSchema>;

export type SkillDto = CreateSkillRequest & {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
