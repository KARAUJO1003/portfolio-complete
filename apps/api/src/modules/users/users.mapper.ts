import type { AuthUserDto } from "@portfolio/contracts";
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
