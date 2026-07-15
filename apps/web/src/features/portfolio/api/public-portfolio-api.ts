import type { PublicPortfolioDto } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function getPublicPortfolio() {
  const response = await api.get<{ portfolio: PublicPortfolioDto }>("/public/portfolio");
  return response.data.portfolio;
}

export async function likePublicProject(projectId: string, visitorId: string) {
  const response = await api.post<{ liked: boolean; likesCount: number }>(
    `/public/projects/${projectId}/like`,
    { visitorId },
  );

  return response.data;
}
