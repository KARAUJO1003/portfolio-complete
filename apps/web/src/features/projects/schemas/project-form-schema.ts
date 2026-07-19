import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().default(""),
  description: z.string().default(""),
  coverPath: z.string().default(""),
  demoUrl: z.string().url().or(z.literal("")).default(""),
  repoUrl: z.string().url().or(z.literal("")).default(""),
  technologiesText: z.string().default(""),
  featured: z.boolean().default(false),
  order: z.coerce.number().int("Ordem deve ser um número inteiro.").min(0, "Ordem não pode ser negativa.").default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  showOnPortfolio: z.boolean().default(true),
  showOnResume: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
