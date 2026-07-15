import { Router } from "express";
import mongoose from "mongoose";

export const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  response.json({
    ok: true,
    service: "portfolio-api",
    mongo: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});
