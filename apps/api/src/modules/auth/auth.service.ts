import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { LoginRequest } from "@portfolio/contracts";
import { env } from "../../config/env";
import { ApiError } from "../../shared/errors/api-error";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../users/users.repository";
import { toAuthUserDto } from "../users/users.mapper";

type TokenPayload = {
  sub: string;
};

export async function ensureAdminUser() {
  const basePermissions = [
    "admin:access",
    "profile:view",
    "profile:update",
    "projects:view",
    "projects:create",
    "projects:update",
    "projects:delete",
    "skills:view",
    "skills:create",
    "skills:update",
    "skills:delete",
    "experiences:view",
    "experiences:create",
    "experiences:update",
    "experiences:delete",
    "pages:view",
    "pages:create",
    "pages:update",
    "pages:delete",
    "custom-sections:view",
    "custom-sections:create",
    "custom-sections:update",
    "custom-sections:delete",
    "content-versions:view",
    "content-versions:create",
    "content-versions:update",
    "content-versions:publish",
    "content-versions:delete",
    "uploads:create",
  ];
  const existing = await findUserByEmail(env.adminEmail);
  if (existing) {
    const mergedPermissions = Array.from(
      new Set([...(existing.permissions ?? []), ...basePermissions]),
    );

    return updateUserById(String(existing._id), {
      roles: Array.from(new Set([...(existing.roles ?? []), "owner"])),
      permissions: mergedPermissions,
      isAdmin: true,
    });
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);

  return createUser({
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
    roles: ["owner"],
    permissions: basePermissions,
    isAdmin: true,
  });
}

export async function loginWithCredentials(input: LoginRequest) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new ApiError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError("Invalid credentials", 401);
  }

  const token = signAuthToken(String(user._id));

  return {
    token,
    user: toAuthUserDto(user),
  };
}

export function signAuthToken(userId: string) {
  return jwt.sign({ sub: userId } satisfies TokenPayload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export async function getUserFromToken(token: string) {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    if (!payload.sub) return null;

    const user = await findUserById(payload.sub);
    return user ? toAuthUserDto(user) : null;
  } catch {
    return null;
  }
}
