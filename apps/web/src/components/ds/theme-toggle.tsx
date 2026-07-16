"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted)
    return (
      <Button
        aria-label="Alternar tema"
        className="w-16"
        disabled
        variant="ghost"
      />
    );
  const dark = resolvedTheme !== "light";
  return (
    <Button
      aria-label={`Usar tema ${dark ? "claro" : "escuro"}`}
      title={`Usar tema ${dark ? "claro" : "escuro"}`}
      variant="ghost"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? "Claro" : "Escuro"}
    </Button>
  );
}
