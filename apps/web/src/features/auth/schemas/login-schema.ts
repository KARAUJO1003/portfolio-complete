import { loginRequestSchema } from "@portfolio/contracts";
import type { z } from "zod";

export const loginFormSchema = loginRequestSchema;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
