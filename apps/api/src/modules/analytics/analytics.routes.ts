import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import * as controller from "./analytics.controller";

export const analyticsRoutes = Router();
analyticsRoutes.get("/overview", authenticate, controller.getOverview);

export const publicAnalyticsRoutes = Router();
publicAnalyticsRoutes.post("/visit", controller.trackVisit);
