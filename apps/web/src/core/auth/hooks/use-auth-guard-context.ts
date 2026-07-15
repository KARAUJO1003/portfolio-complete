"use client";

import { useContext } from "react";
import { AuthGuardContext } from "@/core/auth/contexts/auth-guard-context";

export function useAuthGuardContext() {
  return useContext(AuthGuardContext);
}
