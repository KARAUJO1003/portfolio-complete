import type { RequestHandler } from "express";
import { ApiError } from "../../shared/errors/api-error";
import * as service from "./resume-pdf.service";

export const generateClassicAts: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);

    const result = await service.generateClassicAts(request.user.id, {
      sections: Array.isArray(request.body?.sections) ? request.body.sections : undefined,
      versionId: typeof request.body?.versionId === "string" ? request.body.versionId : undefined,
    });

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    response.send(result.buffer);
  } catch (error) {
    next(error);
  }
};

export const generateCompactAts: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const result = await service.generateCompactAts(request.user.id, {
      sections: Array.isArray(request.body?.sections) ? request.body.sections : undefined,
      versionId: typeof request.body?.versionId === "string" ? request.body.versionId : undefined,
    });
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    response.send(result.buffer);
  } catch (error) { next(error); }
};
