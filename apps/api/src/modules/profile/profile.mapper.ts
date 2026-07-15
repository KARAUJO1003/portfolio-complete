import type { ProfileDto } from "@portfolio/contracts";
import type { ProfileDocument } from "./profile.model";

export function toProfileDto(profile: ProfileDocument): ProfileDto {
  return {
    id: String(profile._id),
    ownerId: profile.ownerId,
    name: profile.name,
    headline: profile.headline,
    summary: profile.summary,
    objective: profile.objective,
    location: profile.location,
    address: profile.address,
    birthDate: profile.birthDate,
    driverLicense: profile.driverLicense,
    email: profile.email,
    phone: profile.phone,
    website: profile.website,
    github: profile.github,
    linkedin: profile.linkedin,
    avatarPath: profile.avatarPath,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}
