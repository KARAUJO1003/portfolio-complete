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
  cachedAt: string;
};
