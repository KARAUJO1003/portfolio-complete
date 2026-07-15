import { Router } from "express";
import * as controller from "./project-likes.controller";

export const projectLikesRoutes = Router();

projectLikesRoutes.post("/:projectId/like", controller.likeProject);
