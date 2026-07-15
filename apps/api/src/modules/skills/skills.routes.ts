import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { SKILLS_PERMISSIONS } from "./skills.permissions";
import * as controller from "./skills.controller";

export const skillsRoutes = Router();

skillsRoutes.get(
  "/",
  authenticate,
  requirePermission(SKILLS_PERMISSIONS.view),
  controller.listSkills,
);

skillsRoutes.post(
  "/",
  authenticate,
  requirePermission(SKILLS_PERMISSIONS.create),
  controller.createSkill,
);

skillsRoutes.put(
  "/:id",
  authenticate,
  requirePermission(SKILLS_PERMISSIONS.update),
  controller.updateSkill,
);

skillsRoutes.delete(
  "/:id",
  authenticate,
  requirePermission(SKILLS_PERMISSIONS.delete),
  controller.deleteSkill,
);
