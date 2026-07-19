"use client";

import type { ReactNode } from "react";

/**
 * `PortfolioHome` e Server Component; o scroll suave para uma secao da mesma
 * pagina precisa de um handler de clique, entao isola-se aqui como Client
 * Component. O Next.js intercepta o hashchange de um `<a href="#id">` puro e
 * reseta o scroll antes do browser rolar de verdade - scrollIntoView manual
 * contorna isso (ver docs/admin-redesign-tasks.md).
 */
export function SidebarNavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="group flex items-center gap-3 hover:bg-muted px-3 py-1.5 rounded-lg w-fit font-medium hover:text-foreground text-xs transition-colors"
      href={href}
      onClick={(event) => {
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }}
    >
      <span className="group-hover:bg-foreground bg-border w-8 group-hover:w-12 h-px transition-all duration-200" />
      <span>{children}</span>
    </a>
  );
}
