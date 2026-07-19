"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Crossfade sutil ao trocar de pagina no admin. Cada pagina monta seu
 * proprio `AdminShell` (nao ha `app/admin/layout.tsx` compartilhado hoje),
 * entao o conteudo anterior desmonta antes de qualquer saida terminar - so a
 * entrada anima de verdade. Ainda assim resolve a sensacao de troca "travada"
 * entre paginas do admin, sem exigir reestruturar o layout.
 *
 * `className` replica o `flex flex-col gap-8` de `components/ds/page.tsx`
 * (unico consumidor hoje): sem isso, este wrapper vira um bloco extra entre
 * `<Page>` e o conteudo, quebrando o `gap-8` original do `Page` (que so
 * espaca filhos diretos) - os blocos da pagina colapsavam para 0px de
 * espaco entre si. Achado revisando espacamento do dashboard.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="flex flex-col gap-8">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
        initial={{ opacity: 0, y: 6 }}
        key={pathname}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
