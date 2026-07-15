import type { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    title: "Not found",
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
};
