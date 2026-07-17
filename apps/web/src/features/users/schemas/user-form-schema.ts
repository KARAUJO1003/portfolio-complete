import { z } from "zod";
import { userRoleSchema } from "@portfolio/contracts";

export const userFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.union([z.string().min(8), z.literal("")]).default(""),
  role: userRoleSchema.default("editor"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
