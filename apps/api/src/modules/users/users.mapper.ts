import type { AuthUserDto, UserDto, UserRole } from "@portfolio/contracts";
import type { UserDocument } from "./user.model";

export function toAuthUserDto(user: UserDocument): AuthUserDto {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    roles: user.roles ?? [],
    permissions: user.permissions ?? [],
    isAdmin: Boolean(user.isAdmin),
  };
}

export function toUserDto(user: UserDocument): UserDto {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: (user.roles?.[0] as UserRole | undefined) ?? "editor",
    isAdmin: Boolean(user.isAdmin),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
