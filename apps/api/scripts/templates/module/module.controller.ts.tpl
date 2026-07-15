import type { RequestHandler } from "express";
import { ApiError } from "../../shared/errors/api-error";
import { {{CAMEL}}Schema, update{{PASCAL}}Schema } from "./{{MODULE}}.schemas";
import * as service from "./{{MODULE}}.service";
export const list: RequestHandler = async (req,res,next) => { try { if (!req.user) throw new ApiError("Unauthenticated",401); res.json({ items: await service.list(req.user.id) }); } catch(error){ next(error); } };
export const create: RequestHandler = async (req,res,next) => { try { if (!req.user) throw new ApiError("Unauthenticated",401); res.status(201).json({ item: await service.create(req.user.id, {{CAMEL}}Schema.parse(req.body)) }); } catch(error){ next(error); } };
export const update: RequestHandler = async (req,res,next) => { try { if (!req.user) throw new ApiError("Unauthenticated",401); res.json({ item: await service.update(req.user.id, req.params.id, update{{PASCAL}}Schema.parse(req.body)) }); } catch(error){ next(error); } };
export const remove: RequestHandler = async (req,res,next) => { try { if (!req.user) throw new ApiError("Unauthenticated",401); await service.remove(req.user.id, req.params.id); res.status(204).send(); } catch(error){ next(error); } };
