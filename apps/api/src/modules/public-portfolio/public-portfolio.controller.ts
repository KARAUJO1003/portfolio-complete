import type { RequestHandler } from "express";
import * as service from "./public-portfolio.service";

export const getPortfolio: RequestHandler = async (_request, response, next) => {
  try {
    const portfolio = await service.getPublicPortfolio();
    response.json({ portfolio });
  } catch (error) {
    next(error);
  }
};
