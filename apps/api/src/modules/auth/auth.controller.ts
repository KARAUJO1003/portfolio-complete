import type { CookieOptions, RequestHandler } from "express";
import { env } from "../../config/env";
import { ApiError } from "../../shared/errors/api-error";
import {
  changePasswordRequestSchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  resetPasswordRequestSchema,
} from "./auth.schemas";
import { changePassword, loginWithCredentials, requestPasswordReset, resetPassword } from "./auth.service";

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

export const forgotPassword: RequestHandler = async (request, response, next) => {
  try {
    const input = forgotPasswordRequestSchema.parse(request.body);
    await requestPasswordReset(input.email);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler: RequestHandler = async (request, response, next) => {
  try {
    const input = resetPasswordRequestSchema.parse(request.body);
    await resetPassword(input.token, input.password);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const changePasswordHandler: RequestHandler = async (request, response, next) => {
  try {
    if (!request.user) throw new ApiError("Unauthenticated", 401);
    const input = changePasswordRequestSchema.parse(request.body);
    await changePassword(request.user.id, input.currentPassword, input.newPassword);
    response.status(204).send();
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
