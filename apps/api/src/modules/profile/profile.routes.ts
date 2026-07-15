import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { PROFILE_PERMISSIONS } from "./profile.permissions";
import * as controller from "./profile.controller";

export const profileRoutes = Router();

profileRoutes.get(
  "/me",
  authenticate,
  requirePermission(PROFILE_PERMISSIONS.view),
  controller.getMine,
);

profileRoutes.put(
  "/me",
  authenticate,
  requirePermission(PROFILE_PERMISSIONS.update),
  controller.upsertMine,
);
