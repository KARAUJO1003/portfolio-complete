import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { PROJECTS_PERMISSIONS } from "./projects.permissions";
import * as controller from "./projects.controller";

export const projectsRoutes = Router();

projectsRoutes.get(
  "/",
  authenticate,
  requirePermission(PROJECTS_PERMISSIONS.view),
  controller.listProjects,
);

projectsRoutes.get(
  "/likes-trend",
  authenticate,
  requirePermission(PROJECTS_PERMISSIONS.view),
  controller.getLikesTrend,
);

projectsRoutes.post(
  "/",
  authenticate,
  requirePermission(PROJECTS_PERMISSIONS.create),
  controller.createProject,
);

projectsRoutes.put(
  "/:id",
  authenticate,
  requirePermission(PROJECTS_PERMISSIONS.update),
  controller.updateProject,
);

projectsRoutes.delete(
  "/:id",
  authenticate,
  requirePermission(PROJECTS_PERMISSIONS.delete),
  controller.deleteProject,
);
