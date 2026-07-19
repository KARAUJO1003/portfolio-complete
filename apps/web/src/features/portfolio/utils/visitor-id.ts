const visitorStorageKey = "portfolio.visitorId";

/** Id anonimo persistido no localStorage - compartilhado entre likes e analytics de visita. */
export function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "";

  const current = window.localStorage.getItem(visitorStorageKey);
  if (current) return current;

  const next = crypto.randomUUID();
  window.localStorage.setItem(visitorStorageKey, next);
  return next;
}
