import { Router } from "express";
import * as controller from "./public-portfolio.controller";

export const publicPortfolioRoutes = Router();

publicPortfolioRoutes.get("/", controller.getPortfolio);
