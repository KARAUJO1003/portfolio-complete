import type { Request, RequestHandler } from "express";
import { can, type Permission, type PermissionUser } from "@portfolio/permissions";
import { ApiError } from "../errors/api-error";

type RequestWithUser = Request & {
  user?: PermissionUser;
};

export function requirePermission(permission: Permission): RequestHandler {
  return (request, _response, next) => {
    const user = (request as RequestWithUser).user;

    if (!user) {
      next(new ApiError("Unauthenticated", 401));
      return;
    }

    if (!can(user, permission)) {
      next(new ApiError("Forbidden", 403));
      return;
    }

    next();
  };
}
