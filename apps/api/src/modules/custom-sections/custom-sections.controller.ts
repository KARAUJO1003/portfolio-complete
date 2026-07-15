import { createCustomSectionRequestSchema, updateCustomSectionRequestSchema } from "@portfolio/contracts";
import type { RequestHandler } from "express";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./custom-sections.service";
export const listSections: RequestHandler = async (req, res, next) => { try { if (!req.user) throw new ApiError("Unauthenticated", 401); res.json({ sections: await service.list(req.user.id) }); } catch (error) { next(error); } };
export const createSection: RequestHandler = async (req, res, next) => { try { if (!req.user) throw new ApiError("Unauthenticated", 401); res.status(201).json({ section: await service.create(req.user.id, createCustomSectionRequestSchema.parse(req.body)) }); } catch (error) { next(error); } };
export const updateSection: RequestHandler = async (req, res, next) => { try { if (!req.user) throw new ApiError("Unauthenticated", 401); res.json({ section: await service.update(req.user.id, req.params.id, updateCustomSectionRequestSchema.parse(req.body)) }); } catch (error) { next(error); } };
export const deleteSection: RequestHandler = async (req, res, next) => { try { if (!req.user) throw new ApiError("Unauthenticated", 401); await service.remove(req.user.id, req.params.id); res.status(204).send(); } catch (error) { next(error); } };
