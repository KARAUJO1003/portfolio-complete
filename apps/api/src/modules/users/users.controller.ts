import type { RequestHandler } from "express";
import { createUserRequestSchema, updateUserRequestSchema } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./users.service";

export const listUsers: RequestHandler = async (_request, response, next) => {
  try {
    const users = await service.list();
    response.json({ users });
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (request, response, next) => {
  try {
    const input = createUserRequestSchema.parse(request.body);
    const user = await service.create(input);
    response.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (request, response, next) => {
  try {
    const input = updateUserRequestSchema.parse(request.body);
    const user = await service.update(request.params.id, input);
    response.json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.params.id, request.user.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
