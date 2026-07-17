import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { ROLE_PERMISSION_PRESETS, type LoginRequest } from "@portfolio/contracts";
import { env } from "../../config/env";
import { ApiError } from "../../shared/errors/api-error";
import { sendPasswordResetEmail } from "../../shared/email/resend-client";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetTokenHash,
  updateUserById,
} from "../users/users.repository";
import { toAuthUserDto } from "../users/users.mapper";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

type TokenPayload = {
  sub: string;
};

export async function ensureAdminUser() {
  const basePermissions = ROLE_PERMISSION_PRESETS.owner;
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

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = hashResetToken(token);
  const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await updateUserById(String(user._id), { resetTokenHash, resetTokenExpiresAt });

  const resetUrl = `${env.webUrl}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await findUserById(userId);
  if (!user) throw new ApiError("User not found", 404);

  const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError("Senha atual incorreta", 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUserById(userId, { passwordHash });
}

export async function resetPassword(token: string, password: string) {
  const resetTokenHash = hashResetToken(token);
  const user = await findUserByResetTokenHash(resetTokenHash);
  if (!user) {
    throw new ApiError("Token invalido ou expirado", 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await updateUserById(String(user._id), {
    passwordHash,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
