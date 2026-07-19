import { api } from "@/core/api/axios-instance";

export type AnalyticsOverviewDto = {
  activeNow: number;
  dailyVisits: { date: string; value: number }[];
  deviceBreakdown: { label: string; value: number }[];
  referrerBreakdown: { label: string; value: number }[];
};

export async function getAnalyticsOverview() {
  const response = await api.get<AnalyticsOverviewDto>("/analytics/overview");
  return response.data;
}
