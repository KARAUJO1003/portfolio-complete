import type { RequestHandler } from "express";
import {
  createExperienceRequestSchema,
  updateExperienceRequestSchema,
} from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./experiences.service";

export const listExperiences: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const experiences = await service.list(request.user.id);
    response.json({ experiences });
  } catch (error) {
    next(error);
  }
};

export const createExperience: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = createExperienceRequestSchema.parse(request.body);
    const experience = await service.create(request.user.id, input);
    response.status(201).json({ experience });
  } catch (error) {
    next(error);
  }
};

export const updateExperience: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = updateExperienceRequestSchema.parse(request.body);
    const experience = await service.update(request.user.id, request.params.id, input);
    response.json({ experience });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.user.id, request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
