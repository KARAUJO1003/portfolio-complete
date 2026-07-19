"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackVisit } from "@/features/portfolio/api/analytics-api";
import { getOrCreateVisitorId } from "@/features/portfolio/utils/visitor-id";

const HEARTBEAT_MS = 60_000;

/**
 * Beacon de analytics do portfolio publico: manda uma visita no mount e um
 * heartbeat periodico enquanto a aba estiver visivel (pausa em background) -
 * e o sinal de "ativo agora" no dashboard do admin. Sem cookie de terceiro,
 * sem sessao persistente; so o mesmo id anonimo de visitante ja usado pelas
 * curtidas (localStorage).
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return undefined;

    function send() {
      if (document.hidden) return;
      trackVisit({ path: pathname, referrer: document.referrer || undefined, visitorId }).catch(() => undefined);
    }

    send();
    const interval = setInterval(send, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
