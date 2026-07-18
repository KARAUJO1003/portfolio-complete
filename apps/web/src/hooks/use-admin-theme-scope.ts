"use client";

import { useEffect } from "react";

/**
 * Portais (Drawer/vaul, AlertDialog/Base UI) anexam em document.body,
 * fora da div .admin-shell. Sem isso, conteudo portalizado (drawers,
 * confirm dialogs) cai de volta nos tokens de :root em vez dos tokens
 * do tema Mira escopados ao admin. Ver docs/admin-visual-references.md.
 */
export function useAdminThemeScope() {
  useEffect(() => {
    document.body.classList.add("admin-shell");
    return () => {
      document.body.classList.remove("admin-shell");
    };
  }, []);
}
