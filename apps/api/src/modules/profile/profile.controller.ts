import type { RequestHandler } from "express";
import { upsertProfileRequestSchema } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./profile.service";

export const getMine: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const profile = await service.getMyProfile(request.user.id);
    response.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const upsertMine: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = upsertProfileRequestSchema.parse(request.body);
    const profile = await service.saveMyProfile(request.user.id, input);
    response.json({ profile });
  } catch (error) {
    next(error);
  }
};
