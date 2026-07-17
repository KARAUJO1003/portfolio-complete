import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export type AuthUserDto = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
};

export type LoginResponse = {
  token: string;
  user: AuthUserDto;
};
