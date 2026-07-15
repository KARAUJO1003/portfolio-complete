import type { LoginRequest, LoginResponse } from "@portfolio/contracts";
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
