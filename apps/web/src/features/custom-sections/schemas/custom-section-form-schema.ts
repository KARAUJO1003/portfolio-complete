import { z } from "zod";

export const customSectionFormSchema = z.object({
  title: z.string().min(1),
  key: z.string().min(1),
  content: z.string().default(""),
  contentFormat: z.enum(["html", "markdown"]).default("html"),
  order: z.coerce.number().int("Ordem deve ser um número inteiro.").min(0, "Ordem não pode ser negativa.").default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  showOnPortfolio: z.boolean().default(true),
  showOnResume: z.boolean().default(false),
});

export type CustomSectionFormValues = z.infer<typeof customSectionFormSchema>;
