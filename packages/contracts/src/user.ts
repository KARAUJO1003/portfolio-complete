import { z } from "zod";

export const userRoleSchema = z.enum(["owner", "admin", "editor", "viewer"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const USER_ROLES: UserRole[] = ["owner", "admin", "editor", "viewer"];

const CONTENT_MODULES = [
  "profile",
  "projects",
  "skills",
  "experiences",
  "pages",
  "custom-sections",
] as const;

function crud(modules: readonly string[], actions: string[]) {
  return modules.flatMap((module) => actions.map((action) => `${module}:${action}`));
}

export const ROLE_PERMISSION_PRESETS: Record<UserRole, string[]> = {
  owner: ["*:*"],
  admin: [
    "admin:access",
    ...crud(CONTENT_MODULES, ["view", "create", "update", "delete"]),
    "content-versions:view",
    "content-versions:create",
    "content-versions:update",
    "content-versions:publish",
    "content-versions:delete",
    "uploads:create",
    "users:view",
    "users:create",
    "users:update",
    "users:delete",
  ],
  editor: [
    "admin:access",
    ...crud(CONTENT_MODULES, ["view", "create", "update"]),
    "content-versions:view",
    "content-versions:create",
    "content-versions:update",
    "uploads:create",
  ],
  viewer: ["admin:access", ...crud(CONTENT_MODULES, ["view"]), "content-versions:view"],
};

export const createUserRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: userRoleSchema.default("editor"),
});

export const updateUserRequestSchema = z.object({
  name: z.string().min(1).optional(),
  role: userRoleSchema.optional(),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;

export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
