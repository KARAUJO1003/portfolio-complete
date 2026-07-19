import type { RequestHandler } from "express";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./analytics.service";

export const trackVisit: RequestHandler = async (request, response, next) => {
  try {
    const body = (request.body ?? {}) as Record<string, unknown>;
    await service.trackVisit({
      path: typeof body.path === "string" ? body.path : "",
      referrer: typeof body.referrer === "string" ? body.referrer : undefined,
      requestHost: request.hostname,
      userAgent: request.headers["user-agent"] ?? "",
      visitorId: typeof body.visitorId === "string" ? body.visitorId : "",
    });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getOverview: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const overview = await service.getOverview();
    response.json(overview);
  } catch (error) {
    next(error);
  }
};
