import type { SkillDto } from "@portfolio/contracts";
import type { SkillDocument } from "./skills.model";

export function toSkillDto(skill: SkillDocument): SkillDto {
  return {
    id: String(skill._id),
    ownerId: skill.ownerId,
    title: skill.title,
    category: skill.category,
    startedAt: skill.startedAt,
    description: skill.description,
    icon: skill.icon,
    order: skill.order,
    visibility: skill.visibility ?? { portfolio: true, resume: true },
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  };
}
