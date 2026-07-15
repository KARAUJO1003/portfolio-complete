import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { EXPERIENCES_PERMISSIONS } from "./experiences.permissions";
import * as controller from "./experiences.controller";

export const experiencesRoutes = Router();

experiencesRoutes.get(
  "/",
  authenticate,
  requirePermission(EXPERIENCES_PERMISSIONS.view),
  controller.listExperiences,
);

experiencesRoutes.post(
  "/",
  authenticate,
  requirePermission(EXPERIENCES_PERMISSIONS.create),
  controller.createExperience,
);

experiencesRoutes.put(
  "/:id",
  authenticate,
  requirePermission(EXPERIENCES_PERMISSIONS.update),
  controller.updateExperience,
);

experiencesRoutes.delete(
  "/:id",
  authenticate,
  requirePermission(EXPERIENCES_PERMISSIONS.delete),
  controller.deleteExperience,
);
