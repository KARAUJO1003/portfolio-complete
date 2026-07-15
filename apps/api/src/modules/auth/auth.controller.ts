import type { CookieOptions, RequestHandler } from "express";
import { env } from "../../config/env";
import { loginRequestSchema } from "./auth.schemas";
import { loginWithCredentials } from "./auth.service";

export const login: RequestHandler = async (request, response, next) => {
  try {
    const input = loginRequestSchema.parse(request.body);
    const result = await loginWithCredentials(input);

    response.cookie(env.authCookieName, result.token, authCookieOptions());

    response.json(result);
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = (request, response) => {
  response.json({ user: request.user });
};

export const logout: RequestHandler = (_request, response) => {
  response.clearCookie(env.authCookieName, authCookieOptions());
  response.status(204).send();
};

function authCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
}
