import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      title: "Validation error",
      message: "Invalid request payload",
      issues: error.issues,
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.status).json({
      title: error.name,
      message: error.message,
      details: error.details,
    });
    return;
  }

  response.status(500).json({
    title: "Internal server error",
    message: "Unexpected server error",
  });
};
