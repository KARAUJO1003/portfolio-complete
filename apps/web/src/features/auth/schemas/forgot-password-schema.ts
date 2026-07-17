import type { z } from "zod";
import { forgotPasswordRequestSchema } from "@portfolio/contracts";

export const forgotPasswordFormSchema = forgotPasswordRequestSchema;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
