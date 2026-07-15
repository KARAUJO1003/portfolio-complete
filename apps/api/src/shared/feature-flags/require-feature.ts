import type { RequestHandler } from "express";
import { isFeatureEnabled } from "@portfolio/feature-flags";
import { ApiError } from "../errors/api-error";

export function requireFeature(flag: string): RequestHandler {
  return (_request, _response, next) => {
    if (!isFeatureEnabled(flag)) {
      next(new ApiError("Feature disabled", 404, { flag }));
      return;
    }

    next();
  };
}
