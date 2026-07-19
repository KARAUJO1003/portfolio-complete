import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./shared/errors/error-handler";
import { notFoundHandler } from "./shared/errors/not-found-handler";
import { analyticsRoutes, publicAnalyticsRoutes } from "./modules/analytics/analytics.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { contentVersionsRoutes } from "./modules/content-versions/content-versions.routes";
import { customSectionsRoutes } from "./modules/custom-sections/custom-sections.routes";
import { experiencesRoutes } from "./modules/experiences/experiences.routes";
import { healthRoutes } from "./modules/health/health.routes";
import { pagesRoutes } from "./modules/pages/pages.routes";
import { profileRoutes } from "./modules/profile/profile.routes";
import { projectLikesRoutes } from "./modules/project-likes/project-likes.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";
import { publicPortfolioRoutes } from "./modules/public-portfolio/public-portfolio.routes";
import { resumePdfRoutes } from "./modules/resume-pdf/resume-pdf.routes";
import { skillsRoutes } from "./modules/skills/skills.routes";
import { uploadsRoutes } from "./modules/uploads/uploads.routes";
import { usersRoutes } from "./modules/users/users.routes";
// <generated-module-imports>

export function createApp() {
  const app = express();
  const devOrigins = new Set([
    env.webUrl,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
  ]);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || devOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(env.filesBasePath, express.static(env.uploadsRoot));

  app.use("/health", healthRoutes);
  app.use("/analytics", analyticsRoutes);
  app.use("/public/analytics", publicAnalyticsRoutes);
  app.use("/auth", authRoutes);
  app.use("/content-versions", contentVersionsRoutes);
  app.use("/custom-sections", customSectionsRoutes);
  app.use("/experiences", experiencesRoutes);
  app.use("/pages", pagesRoutes);
  app.use("/profile", profileRoutes);
  app.use("/public/projects", projectLikesRoutes);
  app.use("/projects", projectsRoutes);
  app.use("/public/portfolio", publicPortfolioRoutes);
  app.use("/resume-pdf", resumePdfRoutes);
  app.use("/skills", skillsRoutes);
  app.use("/uploads", uploadsRoutes);
  app.use("/users", usersRoutes);
  // <generated-module-routes>

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
