import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../../config/env";
import { authenticate } from "../../shared/auth/authenticate";
import { requireFeature } from "../../shared/feature-flags/require-feature";
import * as controller from "./uploads.controller";

const storage = multer.diskStorage({
  destination(request, _file, callback) {
    const folder = String(request.body.folder || "general")
      .split(/[\\/]+/)
      .filter(Boolean)
      .map((part) => part.replace(/[^a-zA-Z0-9-_]/g, "-"))
      .join(path.sep);

    const destination = path.resolve(env.uploadsRoot, folder);
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename(_request, file, callback) {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 80);
    callback(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadsRoutes = Router();

uploadsRoutes.post(
  "/",
  authenticate,
  requireFeature("uploads.local.enabled"),
  upload.single("file"),
  controller.uploadFile,
);
