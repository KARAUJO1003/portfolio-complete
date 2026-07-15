import { z } from "zod";

export const publicationStatusSchema = z.enum(["draft", "published", "archived"]);

export const projectVisibilitySchema = z.object({
  portfolio: z.boolean().default(true),
  resume: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().default(""),
  description: z.string().default(""),
  coverPath: z.string().default(""),
  demoUrl: z.string().url().or(z.literal("")).default(""),
  repoUrl: z.string().url().or(z.literal("")).default(""),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
  status: publicationStatusSchema.default("draft"),
  visibility: projectVisibilitySchema.default({
    portfolio: true,
    resume: false,
  }),
});

export const createProjectRequestSchema = projectSchema;
export const updateProjectRequestSchema = projectSchema.partial();

export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
export type ProjectVisibility = z.infer<typeof projectVisibilitySchema>;
export type CreateProjectRequest = z.infer<typeof createProjectRequestSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectRequestSchema>;

export type ProjectDto = CreateProjectRequest & {
  id: string;
  ownerId: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
};
