import type { RequestHandler } from "express";
import * as service from "./project-likes.service";

export const likeProject: RequestHandler = async (request, response, next) => {
  try {
    const result = await service.likeProject(request.params.projectId, request.body.visitorId);
    response.json(result);
  } catch (error) {
    next(error);
  }
};
