import { z } from "zod";
import { publicationStatusSchema, projectVisibilitySchema } from "./project";

export const customSectionSchema = z.object({
  title: z.string().min(1),
  key: z.string().min(1),
  content: z.string().default(""),
  contentFormat: z.enum(["html", "markdown"]).default("html"),
  order: z.coerce.number().default(0),
  status: publicationStatusSchema.default("draft"),
  visibility: projectVisibilitySchema.default({ portfolio: true, resume: false }),
});

export const createCustomSectionRequestSchema = customSectionSchema;
export const updateCustomSectionRequestSchema = customSectionSchema.partial();
export type CreateCustomSectionRequest = z.infer<typeof createCustomSectionRequestSchema>;
export type UpdateCustomSectionRequest = z.infer<typeof updateCustomSectionRequestSchema>;
export type CustomSectionDto = CreateCustomSectionRequest & {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
