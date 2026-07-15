import { CustomPageModel } from "../pages/pages.model";
import { ProfileModel } from "../profile/profile.model";
import { ProjectModel } from "../projects/projects.model";
import { SkillModel } from "../skills/skills.model";
import { ExperienceModel } from "../experiences/experiences.model";
import { toCustomPageDto } from "../pages/pages.mapper";
import { toProfileDto } from "../profile/profile.mapper";
import { toProjectDto } from "../projects/projects.mapper";
import { toSkillDto } from "../skills/skills.mapper";
import { toExperienceDto } from "../experiences/experiences.mapper";
import { ContentVersionModel } from "../content-versions/content-versions.model";
import { getGitHubSnapshot } from "../github/github.service";
import { CustomSectionModel } from "../custom-sections/custom-sections.model";
import { toCustomSectionDto } from "../custom-sections/custom-sections.mapper";

export async function getPublicPortfolio() {
  const profile = await ProfileModel.findOne().sort({ updatedAt: -1 });
  const ownerId = profile?.ownerId;

  const ownerFilter = ownerId ? { ownerId } : {};

  const [version, projects, skills, experiences, navigationPages, customSections] = await Promise.all([
    ownerId
      ? ContentVersionModel.findOne({ ownerId, kind: "portfolio", status: "published" }).sort({ publishedAt: -1 })
      : null,
    ProjectModel.find({
      ...ownerFilter,
      status: "published",
      "visibility.portfolio": true,
    }).sort({ order: 1, createdAt: -1 }),
    SkillModel.find({
      ...ownerFilter,
      "visibility.portfolio": true,
    }).sort({ order: 1, createdAt: -1 }),
    ExperienceModel.find({
      ...ownerFilter,
      "visibility.portfolio": true,
    }).sort({ order: 1, startDate: -1 }),
    CustomPageModel.find({
      ...ownerFilter,
      status: "published",
      showInNavigation: true,
    }).sort({ order: 1, createdAt: -1 }),
    CustomSectionModel.find({
      ...ownerFilter,
      status: "published",
      "visibility.portfolio": true,
    }).sort({ order: 1, createdAt: -1 }),
  ]);

  const sections = [...(version?.sections ?? [])].sort((a, b) => a.order - b.order);
  const hasVersion = Boolean(version);
  const sectionMap = new Map(sections.map((section) => [section.id, section]));
  const isEnabled = (id: string) => !hasVersion || Boolean(sectionMap.get(id)?.enabled);
  const filterItems = <T extends { _id: unknown }>(items: T[], sectionId: string) => {
    const section = sectionMap.get(sectionId);
    if (!isEnabled(sectionId)) return [];
    if (!section || section.selectionMode === "all") return items;
    const selected = new Set(section.itemIds);
    return items.filter((item) => selected.has(String(item._id)));
  };

  const visibleProjects = filterItems(projects, "projects");
  const visibleSkills = filterItems(skills, "skills");
  const visibleExperiences = filterItems(experiences, "experiences");
  const visiblePages = filterItems(navigationPages, "pages");
  const visibleCustomSections = filterItems(customSections, "custom-sections");
  const github = isEnabled("github") && profile?.github ? await getGitHubSnapshot(profile.github) : null;

  return {
    profile: profile && (isEnabled("hero") || isEnabled("about")) ? toProfileDto(profile) : null,
    projects: visibleProjects.map(toProjectDto),
    skills: visibleSkills.map(toSkillDto),
    experiences: visibleExperiences.map(toExperienceDto),
    navigationPages: visiblePages.map(toCustomPageDto),
    github,
    customSections: visibleCustomSections.map(toCustomSectionDto),
    version: version
      ? {
          id: String(version._id),
          name: version.name,
          slug: version.slug,
          template: version.template,
          sections,
        }
      : null,
  };
}
