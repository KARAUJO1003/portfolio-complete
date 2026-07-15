import { z } from "zod";

export const experienceFormSchema = z.object({
  type: z.enum(["work", "education", "certification", "link"]).default("work"),
  title: z.string().min(1),
  organization: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
  url: z.string().url().or(z.literal("")).default(""),
  order: z.coerce.number().default(0),
  showOnPortfolio: z.boolean().default(false),
  showOnResume: z.boolean().default(true),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
