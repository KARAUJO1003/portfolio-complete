import type { GitHubSnapshotDto } from "@portfolio/contracts";
import { env } from "../../config/env";

const cache = new Map<string, { expiresAt: number; value: GitHubSnapshotDto }>();
const cacheTtlMs = 10 * 60 * 1000;

export async function getGitHubSnapshot(profileUrl: string): Promise<GitHubSnapshotDto | null> {
  const username = getUsername(profileUrl);
  if (!username) return null;

  const cached = cache.get(username);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-platform",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.githubToken) headers.Authorization = `Bearer ${env.githubToken}`;

  try {
    const [profileResponse, reposResponse, activityResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=8`, { headers }),
    ]);
    if (!profileResponse.ok || !reposResponse.ok || !activityResponse.ok) return cached?.value ?? null;

    const profile = await profileResponse.json() as Record<string, unknown>;
    const repositories = await reposResponse.json() as Array<Record<string, unknown>>;
    const activity = await activityResponse.json() as Array<Record<string, unknown>>;
    const value: GitHubSnapshotDto = {
      username,
      avatarUrl: String(profile.avatar_url ?? ""),
      profileUrl: String(profile.html_url ?? profileUrl),
      followers: Number(profile.followers ?? 0),
      following: Number(profile.following ?? 0),
      publicRepositories: Number(profile.public_repos ?? 0),
      repositories: repositories.map((repo) => ({
        id: Number(repo.id),
        name: String(repo.name ?? ""),
        description: String(repo.description ?? ""),
        url: String(repo.html_url ?? ""),
        homepage: String(repo.homepage ?? ""),
        language: String(repo.language ?? ""),
        stars: Number(repo.stargazers_count ?? 0),
        forks: Number(repo.forks_count ?? 0),
        topics: Array.isArray(repo.topics) ? repo.topics.map(String) : [],
        updatedAt: String(repo.updated_at ?? ""),
      })),
      activity: activity.map((event) => ({
        id: String(event.id ?? ""),
        type: String(event.type ?? "Activity"),
        repository: String((event.repo as Record<string, unknown> | undefined)?.name ?? ""),
        createdAt: String(event.created_at ?? ""),
      })),
      cachedAt: new Date().toISOString(),
    };
    cache.set(username, { expiresAt: Date.now() + cacheTtlMs, value });
    return value;
  } catch {
    return cached?.value ?? null;
  }
}

function getUsername(value: string) {
  if (!value) return "";
  try {
    return new URL(value).pathname.split("/").filter(Boolean)[0] ?? "";
  } catch {
    return value.replace(/^@/, "").trim();
  }
}
