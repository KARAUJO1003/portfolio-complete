import { z } from "zod";

export const contentVersionKindSchema = z.enum(["portfolio", "resume"]);
export const contentVersionStatusSchema = z.enum(["draft", "published", "archived"]);
export const contentVersionSectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
  selectionMode: z.enum(["all", "selected"]).default("all"),
  itemIds: z.array(z.string()).default([]),
});

export const createContentVersionRequestSchema = z.object({
  kind: contentVersionKindSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  template: z.string().default("default"),
  sections: z.array(contentVersionSectionSchema).default([]),
});

export const updateContentVersionRequestSchema = createContentVersionRequestSchema
  .omit({ kind: true })
  .partial();

export type ContentVersionKind = z.infer<typeof contentVersionKindSchema>;
export type ContentVersionStatus = z.infer<typeof contentVersionStatusSchema>;
export type ContentVersionSection = z.infer<typeof contentVersionSectionSchema>;
export type CreateContentVersionRequest = z.infer<typeof createContentVersionRequestSchema>;
export type UpdateContentVersionRequest = z.infer<typeof updateContentVersionRequestSchema>;

export type ContentVersionDto = CreateContentVersionRequest & {
  id: string;
  ownerId: string;
  status: ContentVersionStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
