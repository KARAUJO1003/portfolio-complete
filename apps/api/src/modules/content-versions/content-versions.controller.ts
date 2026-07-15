import type { ContentVersionKind } from "@portfolio/contracts";
import { createContentVersionRequestSchema, updateContentVersionRequestSchema } from "@portfolio/contracts";
import type { RequestHandler } from "express";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./content-versions.service";

export const listVersions: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const kind = request.query.kind as ContentVersionKind | undefined;
    if (kind && !["portfolio", "resume"].includes(kind)) throw new ApiError("Invalid version kind", 400);
    response.json({ versions: await service.list(request.user.id, kind) });
  } catch (error) { next(error); }
};

export const getVersion: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    response.json({ version: await service.get(request.user.id, request.params.id) });
  } catch (error) { next(error); }
};

export const createVersion: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const version = await service.create(request.user.id, createContentVersionRequestSchema.parse(request.body));
    response.status(201).json({ version });
  } catch (error) { next(error); }
};

export const updateVersion: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const version = await service.update(request.user.id, request.params.id, updateContentVersionRequestSchema.parse(request.body));
    response.json({ version });
  } catch (error) { next(error); }
};

export const publishVersion: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    response.json({ version: await service.publish(request.user.id, request.params.id) });
  } catch (error) { next(error); }
};

export const deleteVersion: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    await service.remove(request.user.id, request.params.id);
    response.status(204).send();
  } catch (error) { next(error); }
};
