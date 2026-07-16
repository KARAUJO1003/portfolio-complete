export type GitHubRepositoryDto = {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
};

export type GitHubActivityDto = {
  id: string;
  type: string;
  repository: string;
  createdAt: string;
  action?: string;
  count?: number;
  title?: string;
  url?: string;
};

export type GitHubContributionDayDto = {
  count: number;
  date: string;
  level: number;
};

export type GitHubSnapshotDto = {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepositories: number;
  repositories: GitHubRepositoryDto[];
  activity: GitHubActivityDto[];
  contributions: GitHubContributionDayDto[];
  contributionsTotal: number;
  cachedAt: string;
};
