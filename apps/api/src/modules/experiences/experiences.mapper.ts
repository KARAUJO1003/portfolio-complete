import type { ExperienceDto } from "@portfolio/contracts";
import type { ExperienceDocument } from "./experiences.model";

export function toExperienceDto(experience: ExperienceDocument): ExperienceDto {
  return {
    id: String(experience._id),
    ownerId: experience.ownerId,
    type: experience.type,
    title: experience.title,
    organization: experience.organization,
    location: experience.location,
    startDate: experience.startDate,
    endDate: experience.endDate,
    current: experience.current,
    description: experience.description,
    url: experience.url,
    order: experience.order,
    visibility: experience.visibility ?? { portfolio: false, resume: true },
    createdAt: experience.createdAt.toISOString(),
    updatedAt: experience.updatedAt.toISOString(),
  };
}
