import type { RequestHandler } from "express";
import { env } from "../../config/env";
import { ensureAdminUser, getUserFromToken } from "../../modules/auth/auth.service";
import { ApiError } from "../errors/api-error";

let devBypassUserId: string | null = null;

function getBearerToken(authorization?: string) {
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length);
}

export const authenticate: RequestHandler = async (request, _response, next) => {
  if (!env.authEnabled) {
    const admin = await ensureAdminUser();
    devBypassUserId = String(admin?._id || devBypassUserId || "dev-admin");
    request.user = {
      id: devBypassUserId,
      name: admin?.name || "Dev Admin",
      email: admin?.email || "dev@portfolio.local",
      roles: ["owner"],
      permissions: ["*:*"],
      isAdmin: true,
    };
    next();
    return;
  }

  const token =
    getBearerToken(request.headers.authorization) ||
    request.cookies?.[env.authCookieName];

  if (!token) {
    next(new ApiError("Unauthenticated", 401));
    return;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    next(new ApiError("Unauthenticated", 401));
    return;
  }

  request.user = user;
  next();
};
