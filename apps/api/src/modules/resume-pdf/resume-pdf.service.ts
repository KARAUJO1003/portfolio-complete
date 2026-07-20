import { ExperienceModel } from "../experiences/experiences.model";
import { ProfileModel } from "../profile/profile.model";
import { ProjectModel } from "../projects/projects.model";
import { SkillModel } from "../skills/skills.model";
import { ContentVersionModel } from "../content-versions/content-versions.model";
import { CustomSectionModel } from "../custom-sections/custom-sections.model";
import { bullet, bulletSpans, generateClassicAtsPdf, heading, numbered, paragraph, spans, subheading } from "./resume-pdf.generator";
import { hasVisibleText, htmlToInlineSpans, htmlToPdfLines } from "./html-to-pdf-lines";

type ResumePdfOptions = {
  sections?: string[];
  versionId?: string;
};

const defaultSections = new Set([
  "profile",
  "summary",
  "work",
  "skills",
  "achievements",
  "certifications",
  "education",
  "custom-sections",
  "objective",
]);

export async function generateClassicAts(ownerId: string, options: ResumePdfOptions = {}) {
  return generateAts(ownerId, options, false);
}

export async function generateCompactAts(ownerId: string, options: ResumePdfOptions = {}) {
  return generateAts(ownerId, options, true);
}

/**
 * Versao publica (sem autenticacao) do PDF - usada pelo botao "Curriculo" do
 * site publico. Resolve o owner a partir da propria versao publicada (o
 * portfolio publico ja e single-tenant, mesmo padrao de
 * `public-portfolio.service.ts`), em vez de exigir um usuario logado.
 * Usa o template salvo na versao (`classic-ats`/`compact-ats`), nao um
 * default fixo.
 */
export async function generatePublicResumePdf() {
  const version = await ContentVersionModel.findOne({ kind: "resume", status: "published" }).sort({
    publishedAt: -1,
  });
  if (!version) return null;

  const compact = version.template === "compact-ats";
  return generateAts(version.ownerId, { versionId: String(version._id) }, compact);
}

async function generateAts(ownerId: string, options: ResumePdfOptions, compact: boolean) {
  const version = options.versionId
    ? await ContentVersionModel.findOne({ _id: options.versionId, ownerId, kind: "resume" })
    : options.sections?.length
      ? null
      : await ContentVersionModel.findOne({ ownerId, kind: "resume", status: "published" }).sort({ publishedAt: -1 });
  const versionSections = [...(version?.sections ?? [])].sort((a, b) => a.order - b.order);
  const enabledSections = options.sections?.length
    ? new Set(options.sections)
    : versionSections.length
      ? new Set(versionSections.filter((section) => section.enabled).map((section) => section.id))
      : defaultSections;
  const sectionMap = new Map(versionSections.map((section) => [section.id, section]));
  const isSelected = (sectionId: string, id: unknown) => {
    const section = sectionMap.get(sectionId);
    return !section || section.selectionMode === "all" || section.itemIds.includes(String(id));
  };
  const [profile, allSkills, allProjects, allExperiences, allCustomSections] = await Promise.all([
    ProfileModel.findOne({ ownerId }),
    SkillModel.find({ ownerId, "visibility.resume": true }).sort({ order: 1, createdAt: -1 }),
    ProjectModel.find({ ownerId, "visibility.resume": true }).sort({ order: 1, createdAt: -1 }),
    ExperienceModel.find({ ownerId, "visibility.resume": true }).sort({ order: 1, startDate: -1 }),
    CustomSectionModel.find({ ownerId, status: "published", "visibility.resume": true }).sort({ order: 1 }),
  ]);
  const skills = allSkills.filter((item) => isSelected("skills", item._id));
  const projects = allProjects.filter((item) => isSelected("projects", item._id));
  const experiences = allExperiences.filter((item) => {
    const sectionId = item.type === "work"
      ? "work"
      : item.type === "certification"
        ? "certifications"
        : item.type === "education"
          ? "education"
          : /conquista|distinc/i.test(item.organization)
            ? "achievements"
            : "experiences";
    return isSelected(sectionId, item._id);
  });
  const customSections = allCustomSections.filter((item) => isSelected("custom-sections", item._id));

  const lines = [];
  const name = profile?.name || "Currículo";

  if (enabledSections.has("profile")) {
    lines.push({ text: name.toUpperCase(), size: 15, bold: true, color: "brand" as const });
    const contactParts = [
      profile?.address || profile?.location,
      profile?.website,
      profile?.phone,
      profile?.email,
    ].filter(Boolean);
    if (contactParts.length) lines.push(paragraph(contactParts.join(" | ")));

    const metaParts = [profile?.birthDate, profile?.driverLicense, profile?.headline].filter(Boolean);
    if (metaParts.length) lines.push(paragraph(metaParts.join(" | ")));
  }

  if (enabledSections.has("summary") && hasVisibleText(profile?.summary)) {
    lines.push(heading("Resumo profissional"), ...htmlToPdfLines(profile.summary));
  }

  const workExperiences = experiences.filter((experience) => experience.type === "work");
  if (enabledSections.has("work") && workExperiences.length) {
    lines.push(heading("Histórico profissional"));
    for (const experience of workExperiences) {
      const dateRange = formatDateRange(experience.startDate, experience.endDate, experience.current);
      lines.push(bullet(`**${experience.title.toUpperCase()}**${dateRange ? ` - ${dateRange}` : ""}`));
      lines.push(
        paragraph(
          `**${[experience.organization, experience.location].filter(Boolean).join(" - ").toUpperCase()}**`,
          { indent: 20 },
        ),
      );
      if (experience.description) lines.push(...htmlToPdfLines(experience.description));
    }
  }

  if (enabledSections.has("skills") && skills.length) {
    const personalSkills = skills.filter((skill) => /pessoal|soft/i.test(skill.category));
    const technicalSkills = skills.filter((skill) => !personalSkills.includes(skill));

    if (technicalSkills.length) {
      lines.push(heading("Competências"), subheading("Técnicas:"));
      lines.push(bullet(`**${technicalSkills.map((skill) => skill.title).join(", ")}**`));
    }

    if (personalSkills.length) {
      lines.push(subheading("Pessoais:"));
      personalSkills.forEach((skill) =>
        lines.push(bulletSpans(hasVisibleText(skill.description) ? htmlToInlineSpans(skill.description) : [{ text: skill.title }])),
      );
    }
  }

  const achievements = experiences.filter(
    (experience) => experience.type === "link" && /conquista|distinc/i.test(experience.organization),
  );
  if (enabledSections.has("achievements") && achievements.length) {
    lines.push(heading("Conquistas e distinções"));
    achievements.forEach((achievement, index) =>
      lines.push(numbered(achievement.description || achievement.title, index + 1)),
    );
  }

  const certifications = experiences.filter((experience) => experience.type === "certification");
  if (enabledSections.has("certifications") && certifications.length) {
    lines.push(heading("Certificações"));
    certifications.forEach((certification) =>
      lines.push(bullet(`**${certification.title}**${certification.organization ? ` (${certification.organization})` : ""}`)),
    );
  }

  const education = experiences.filter((experience) => experience.type === "education");
  if (enabledSections.has("education") && education.length) {
    lines.push(heading("Formação acadêmica"));
    education.forEach((item) => {
      const dateRange = formatDateRange(item.startDate, item.endDate, item.current);
      lines.push(
        spans(
          { text: item.title, bold: true },
          { text: ` - ${item.location || ""} | ${item.organization || ""} ` },
          { text: dateRange, bold: true },
        ),
      );
    });
  }

  if (enabledSections.has("projects") && projects.length) {
    lines.push(heading("Projetos"));
    projects.forEach((project) => lines.push(bullet(`${project.title} - ${project.summary}`)));
  }

  if (enabledSections.has("custom-sections") && customSections.length) {
    customSections
      .filter((section) => hasVisibleText(section.content))
      .forEach((section) => lines.push(heading(section.title), ...htmlToPdfLines(section.content)));
  }

  if (enabledSections.has("objective") && hasVisibleText(profile?.objective)) {
    lines.push(heading("Objetivo"), ...htmlToPdfLines(profile.objective));
  }

  return {
    filename: `${slugify(name)}-${compact ? "compact-ats" : "classic-ats"}.pdf`,
    buffer: generateClassicAtsPdf(lines, { compact }),
  };
}

function formatDateRange(startDate: string, endDate: string, current: boolean) {
  if (!startDate && !endDate && !current) return "";
  return [startDate, current ? "Atualmente" : endDate].filter(Boolean).join(" - ");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
