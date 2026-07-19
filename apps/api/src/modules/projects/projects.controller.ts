import type { RequestHandler } from "express";
import { createProjectRequestSchema, updateProjectRequestSchema } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./projects.service";

export const listProjects: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const projects = await service.list(request.user.id);
    response.json({ projects });
  } catch (error) {
    next(error);
  }
};

export const createProject: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = createProjectRequestSchema.parse(request.body);
    const project = await service.create(request.user.id, input);
    response.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

export const updateProject: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = updateProjectRequestSchema.parse(request.body);
    const project = await service.update(request.user.id, request.params.id, input);
    response.json({ project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.user.id, request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getLikesTrend: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const trend = await service.getLikesTrend(request.user.id);
    response.json(trend);
  } catch (error) {
    next(error);
  }
};
