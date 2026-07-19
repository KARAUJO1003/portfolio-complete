import type { CreateProjectRequest, UpdateProjectRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toProjectDto } from "./projects.mapper";
import * as repository from "./projects.repository";

export async function list(ownerId: string) {
  const projects = await repository.listProjects(ownerId);
  return projects.map(toProjectDto);
}

export async function create(ownerId: string, input: CreateProjectRequest) {
  const project = await repository.createProject(ownerId, input);
  return toProjectDto(project);
}

export async function update(ownerId: string, id: string, input: UpdateProjectRequest) {
  const project = await repository.updateProject(ownerId, id, input);
  if (!project) throw new ApiError("Project not found", 404);
  return toProjectDto(project);
}

export async function remove(ownerId: string, id: string) {
  const project = await repository.deleteProject(ownerId, id);
  if (!project) throw new ApiError("Project not found", 404);
}

const LIKES_TREND_WINDOW_DAYS = 7;

/**
 * Compara curtidas ativas criadas nos ultimos N dias com as N dias
 * anteriores - dado real (timestamp de verdade em ProjectLikeModel), nao
 * uma tendencia inventada. Descurtir apaga o registro, entao isso reflete
 * o saldo liquido de curtidas ativas por periodo, nao um historico completo
 * de eventos - ainda assim e um sinal honesto de "esta subindo ou caindo".
 */
export async function getLikesTrend(ownerId: string) {
  const now = new Date();
  const recentSince = new Date(now.getTime() - LIKES_TREND_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const previousSince = new Date(now.getTime() - LIKES_TREND_WINDOW_DAYS * 2 * 24 * 60 * 60 * 1000);

  const [recentCount, previousCount] = await Promise.all([
    repository.countLikesInRange(ownerId, recentSince),
    repository.countLikesInRange(ownerId, previousSince, recentSince),
  ]);

  const trend: "up" | "down" | "stable" =
    recentCount > previousCount ? "up" : recentCount < previousCount ? "down" : "stable";
  const changePct =
    previousCount > 0
      ? Math.round(((recentCount - previousCount) / previousCount) * 100)
      : recentCount > 0
        ? 100
        : null;

  return { recentCount, previousCount, trend, changePct, windowDays: LIKES_TREND_WINDOW_DAYS };
}
