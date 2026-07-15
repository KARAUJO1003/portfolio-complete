import { Router } from "express";
import { authenticate } from "../../shared/auth/authenticate";
import * as controller from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/login", controller.login);
authRoutes.get("/me", authenticate, controller.me);
authRoutes.post("/logout", controller.logout);
