import type { CustomPageDto } from "./page";
import type { ProfileDto } from "./profile";
import type { ProjectDto } from "./project";
import type { SkillDto } from "./skill";
import type { ExperienceDto } from "./experience";
import type { ContentVersionSection } from "./content-version";
import type { GitHubSnapshotDto } from "./github";
import type { CustomSectionDto } from "./custom-section";

export type PublicPortfolioDto = {
  profile: ProfileDto | null;
  projects: ProjectDto[];
  skills: SkillDto[];
  experiences: ExperienceDto[];
  navigationPages: CustomPageDto[];
  github: GitHubSnapshotDto | null;
  customSections: CustomSectionDto[];
  version: {
    id: string;
    name: string;
    slug: string;
    template: string;
    sections: ContentVersionSection[];
  } | null;
};
