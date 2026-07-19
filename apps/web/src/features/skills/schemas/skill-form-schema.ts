import { z } from "zod";

export const skillFormSchema = z.object({
  title: z.string().min(1),
  category: z.string().default("Geral"),
  startedAt: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().default(""),
  order: z.coerce.number().int("Ordem deve ser um número inteiro.").min(0, "Ordem não pode ser negativa.").default(0),
  showOnPortfolio: z.boolean().default(true),
  showOnResume: z.boolean().default(true),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;
