"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUserDto, LoginRequest } from "@portfolio/contracts";
import { loginRequest, logoutRequest, meRequest } from "@/core/auth/api/auth-api";
import { env } from "@/core/config/env";

type AuthContextValue = {
  user: AuthUserDto | null;
  isLoading: boolean;
  login: (input: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUserDto | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const devBypassUser: AuthUserDto = {
  id: "dev-admin",
  name: "Dev Admin",
  email: "dev@portfolio.local",
  roles: ["owner"],
  permissions: ["*:*"],
  isAdmin: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(
    env.authEnabled ? null : devBypassUser,
  );
  const [isLoading, setIsLoading] = useState(env.authEnabled);

  useEffect(() => {
    if (!env.authEnabled) return;

    let active = true;

    meRequest()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(input: LoginRequest) {
    if (!env.authEnabled) {
      setUser(devBypassUser);
      return;
    }

    const result = await loginRequest(input);
    setUser(result.user);
  }

  async function logout() {
    if (!env.authEnabled) {
      setUser(devBypassUser);
      return;
    }

    await logoutRequest();
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      logout,
      setUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
