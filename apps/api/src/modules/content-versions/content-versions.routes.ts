import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requirePermission } from "../../shared/permissions/require-permission";
import * as controller from "./content-versions.controller";
import { CONTENT_VERSIONS_PERMISSIONS } from "./content-versions.permissions";

export const contentVersionsRoutes = Router();

contentVersionsRoutes.get("/", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.view), controller.listVersions);
contentVersionsRoutes.get("/:id", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.view), controller.getVersion);
contentVersionsRoutes.post("/", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.create), controller.createVersion);
contentVersionsRoutes.put("/:id", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.update), controller.updateVersion);
contentVersionsRoutes.post("/:id/publish", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.publish), controller.publishVersion);
contentVersionsRoutes.delete("/:id", authenticate, requirePermission(CONTENT_VERSIONS_PERMISSIONS.delete), controller.deleteVersion);
