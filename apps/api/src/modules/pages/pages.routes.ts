import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import { PAGES_PERMISSIONS } from "./pages.permissions";
import * as controller from "./pages.controller";

export const pagesRoutes = Router();

pagesRoutes.get("/public/:slug", controller.getPublishedPage);

pagesRoutes.get(
  "/",
  authenticate,
  requirePermission(PAGES_PERMISSIONS.view),
  controller.listPages,
);

pagesRoutes.post(
  "/",
  authenticate,
  requirePermission(PAGES_PERMISSIONS.create),
  controller.createPage,
);

pagesRoutes.put(
  "/:id",
  authenticate,
  requirePermission(PAGES_PERMISSIONS.update),
  controller.updatePage,
);

pagesRoutes.delete(
  "/:id",
  authenticate,
  requirePermission(PAGES_PERMISSIONS.delete),
  controller.deletePage,
);
