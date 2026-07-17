import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { USERS_PERMISSIONS } from "./users.permissions";
import * as controller from "./users.controller";

export const usersRoutes = Router();

usersRoutes.get(
  "/",
  authenticate,
  requirePermission(USERS_PERMISSIONS.view),
  controller.listUsers,
);

usersRoutes.post(
  "/",
  authenticate,
  requirePermission(USERS_PERMISSIONS.create),
  controller.createUser,
);

usersRoutes.put(
  "/:id",
  authenticate,
  requirePermission(USERS_PERMISSIONS.update),
  controller.updateUser,
);

usersRoutes.delete(
  "/:id",
  authenticate,
  requirePermission(USERS_PERMISSIONS.delete),
  controller.deleteUser,
);
