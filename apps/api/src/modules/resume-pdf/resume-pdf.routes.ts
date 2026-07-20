import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import { requireFeature } from "../../shared/feature-flags/require-feature";
import * as controller from "./resume-pdf.controller";

export const resumePdfRoutes = Router();

resumePdfRoutes.post(
  "/classic-ats",
  authenticate,
  requireFeature("resume.pdf.enabled"),
  controller.generateClassicAts,
);
resumePdfRoutes.post(
  "/compact-ats",
  authenticate,
  requireFeature("resume.pdf.templates"),
  controller.generateCompactAts,
);

export const publicResumePdfRoutes = Router();
publicResumePdfRoutes.get("/", requireFeature("resume.pdf.enabled"), controller.generatePublicResumePdf);
