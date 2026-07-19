import { api } from "@/core/api/axios-instance";

export async function trackVisit(input: { path: string; referrer?: string; visitorId: string }) {
  await api.post("/public/analytics/visit", input);
}
