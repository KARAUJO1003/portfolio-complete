import type { RequestHandler } from "express";
import {
  createCustomPageRequestSchema,
  updateCustomPageRequestSchema,
} from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./pages.service";

export const listPages: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const pages = await service.list(request.user.id);
    response.json({ pages });
  } catch (error) {
    next(error);
  }
};

export const getPublishedPage: RequestHandler = async (request, response, next) => {
  try {
    const page = await service.findPublished(request.params.slug);
    response.json({ page });
  } catch (error) {
    next(error);
  }
};

export const createPage: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = createCustomPageRequestSchema.parse(request.body);
    const page = await service.create(request.user.id, input);
    response.status(201).json({ page });
  } catch (error) {
    next(error);
  }
};

export const updatePage: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = updateCustomPageRequestSchema.parse(request.body);
    const page = await service.update(request.user.id, request.params.id, input);
    response.json({ page });
  } catch (error) {
    next(error);
  }
};

export const deletePage: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.user.id, request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
