import type { RequestHandler } from "express";
import { createSkillRequestSchema, updateSkillRequestSchema } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./skills.service";

export const listSkills: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const skills = await service.list(request.user.id);
    response.json({ skills });
  } catch (error) {
    next(error);
  }
};

export const createSkill: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = createSkillRequestSchema.parse(request.body);
    const skill = await service.create(request.user.id, input);
    response.status(201).json({ skill });
  } catch (error) {
    next(error);
  }
};

export const updateSkill: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = updateSkillRequestSchema.parse(request.body);
    const skill = await service.update(request.user.id, request.params.id, input);
    response.json({ skill });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.user.id, request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
