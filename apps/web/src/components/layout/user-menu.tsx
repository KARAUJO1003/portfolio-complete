"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ExternalLinkIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { Menu, MenuGroup, MenuItem, MenuLinkItem, MenuPopup, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { useAuth } from "@/core/auth/contexts/auth-context";

export function UserMenu() {
  const auth = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  async function handleLogout() {
    await auth.logout();
    window.location.href = "/login";
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label="Menu da conta"
        className="flex size-9 items-center justify-center rounded-full border border-border bg-surface-raised text-xs font-semibold transition-colors hover:bg-muted"
      >
        {getInitials(auth.user?.name)}
      </MenuTrigger>
      <MenuPopup>
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium text-foreground">{auth.user?.name ?? "Usuario"}</p>
          <p className="truncate text-xs text-muted-foreground">{auth.user?.email}</p>
        </div>
        <MenuSeparator />
        <MenuGroup>
          <MenuLinkItem render={<Link href="/admin/account" />}>
            <UserIcon />
            Minha conta
          </MenuLinkItem>
          <MenuLinkItem render={<Link href="/" />}>
            <ExternalLinkIcon />
            Site público
          </MenuLinkItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem onClick={() => setTheme(dark ? "light" : "dark")}>
          {dark ? <SunIcon /> : <MoonIcon />}
          Usar tema {dark ? "claro" : "escuro"}
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Sair
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
}
