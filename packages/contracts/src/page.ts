import { z } from "zod";
import { publicationStatusSchema } from "./project";

export const customPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  contentFormat: z.enum(["html", "markdown"]).default("html"),
  status: publicationStatusSchema.default("draft"),
  order: z.coerce.number().default(0),
  showInNavigation: z.boolean().default(false),
});

export const createCustomPageRequestSchema = customPageSchema;
export const updateCustomPageRequestSchema = customPageSchema.partial();

export type CreateCustomPageRequest = z.infer<typeof createCustomPageRequestSchema>;
export type UpdateCustomPageRequest = z.infer<typeof updateCustomPageRequestSchema>;

export type CustomPageDto = CreateCustomPageRequest & {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
