import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function loginRequest(input: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", input);
  return response.data;
}

export async function meRequest() {
  const response = await api.get<{ user: LoginResponse["user"] }>("/auth/me");
  return response.data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function forgotPasswordRequest(input: ForgotPasswordRequest) {
  await api.post("/auth/forgot-password", input);
}

export async function resetPasswordRequest(input: ResetPasswordRequest) {
  await api.post("/auth/reset-password", input);
}

export async function changePasswordRequest(input: ChangePasswordRequest) {
  await api.post("/auth/change-password", input);
}
