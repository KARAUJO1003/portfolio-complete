import {
  MotionHoverCard,
  MotionItem,
  MotionReveal,
  MotionScrollReveal,
  MotionScrollStack,
  MotionStagger,
} from "@/components/ds/motion";
import { BrandLogo } from "@/components/ds/brand-logo";
import { GitHubContributionGraph } from "@/components/ds/github-contribution-graph";
import { HtmlContent } from "@/components/ds/html-content";
import { ThemeToggle } from "@/components/ds/theme-toggle";
import { PublicShell } from "@/components/layout/public-shell";
import { resolveFileUrl } from "@/core/files/file-url";
import { cn } from "@/lib/utils";
import { AnimatedDisclosure } from "@/features/portfolio/components/animated-disclosure";
import { PortfolioFloatingMenu } from "@/features/portfolio/components/portfolio-floating-menu";
import { ProjectCover } from "@/features/portfolio/components/project-cover";
import { ProjectDetailsDrawer } from "@/features/portfolio/components/project-details-drawer";
import { ProjectLikeButton } from "@/features/portfolio/components/project-like-button";
import { SidebarNavLink } from "@/features/portfolio/components/sidebar-nav-link";
import type {
  ExperienceDto,
  ProjectDto,
  PublicPortfolioDto,
  SkillDto,
} from "@portfolio/contracts";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const fallbackProfile = {
  name: "Kaesyo Felix",
  headline: "Desenvolvedor de software",
  summary:
    "Desenvolvedor fullstack focado em interfaces modernas, produtos web e sistemas integrados com boa experiencia de uso.",
  about:
    "Estudante de Engenharia de Software com interesse em interfaces modernas, desenvolvimento web, APIs e produtos fullstack bem estruturados.",
  github: "https://github.com/KARAUJO1003",
  linkedin: "https://www.linkedin.com/in/ka%C3%A9syo-f%C3%A9lix-837345271/",
  instagram: "https://www.instagram.com/kaesyo_/",
  avatar: "https://github.com/KARAUJO1003.png",
};

const fallbackSkills = [
  {
    title: "Next.js",
    startedAt: "03/2023",
    description: "Interfaces web modernas.",
  },
  {
    title: "TypeScript",
    startedAt: "05/2023",
    description: "Contratos claros entre front, API e regras.",
  },
  {
    title: "Tailwind CSS",
    startedAt: "06/2023",
    description: "Design responsivo e consistente.",
  },
  {
    title: "React Hook Form & Zod",
    startedAt: "01/2024",
    description: "Formularios robustos.",
  },
  {
    title: "Node JS & Express",
    startedAt: "01/2024",
    description: "APIs REST, auth, uploads e integracoes.",
  },
];

const fallbackProjects = [
  {
    id: "",
    title: "Finance Fire",
    summary:
      "Aplicativo fullstack de gestao financeira com Next.js, MongoDB, TailwindCSS, Shadcn UI, Recharts, TypeScript e Zod.",
    technologies: ["next.js", "mongodb", "server actions"],
    likesCount: 0,
  },
  {
    id: "",
    title: "Portfolio 1.4.0",
    summary:
      "Portfolio criado para apresentar habilidades, projetos e formas de contato.",
    technologies: ["next.js", "tailwind.css"],
    likesCount: 0,
  },
  {
    id: "",
    title: "Kanban Board",
    summary:
      "Projeto de estudo sobre drag and drop, Tailwind CSS, Shadcn UI e animacoes.",
    technologies: ["next.js", "tailwind.css"],
    likesCount: 0,
  },
];

type PortfolioHomeProps = {
  portfolio: PublicPortfolioDto | null;
};

/**
 * Exportado para o Portfolio Builder reaproveitar as secoes reais no preview
 * (em vez de uma renderizacao simplificada propria) - ver Fase 8 em
 * docs/admin-redesign-tasks.md.
 */
export type PortfolioProject = Pick<ProjectDto, "title" | "summary" | "technologies"> &
  Partial<
    Pick<ProjectDto, "id" | "coverPath" | "demoUrl" | "likesCount" | "repoUrl">
  >;

export type PortfolioProfile = {
  name: string;
  headline: string;
  summary: string;
  about: string;
  github: string;
  linkedin: string;
  instagram: string;
  avatarUrl: string;
};

const sectionOrder = [
  "projects",
  "experiences",
  "skills",
  "about",
  "github",
  "custom-sections",
  "pages",
  "contact",
];

export function PortfolioHome({ portfolio }: PortfolioHomeProps) {
  const profile = portfolio?.profile;
  const hasPublishedVersion = Boolean(portfolio?.version);
  const skills = hasPublishedVersion
    ? (portfolio?.skills ?? [])
    : portfolio?.skills?.length
      ? portfolio.skills
      : fallbackSkills;
  const projects = hasPublishedVersion
    ? (portfolio?.projects ?? [])
    : portfolio?.projects?.length
      ? portfolio.projects
      : fallbackProjects;
  const portfolioProfile: PortfolioProfile = {
    name: profile?.name || fallbackProfile.name,
    headline: normalizeHeadline(profile?.headline || fallbackProfile.headline),
    summary: profile?.summary || fallbackProfile.summary,
    about: profile?.objective || profile?.summary || fallbackProfile.about,
    github: profile?.github || fallbackProfile.github,
    linkedin: profile?.linkedin || fallbackProfile.linkedin,
    instagram: fallbackProfile.instagram,
    avatarUrl: resolveFileUrl(profile?.avatarPath) || fallbackProfile.avatar,
  };
  const enabledSections = portfolio?.version?.sections?.length
    ? portfolio.version.sections
        .filter((section) => section.enabled)
        .map((section) => section.id)
    : [
        "hero",
        "about",
        "skills",
        "projects",
        "experiences",
        "custom-sections",
        "pages",
        "github",
        "contact",
      ];
  const sections = sectionOrder.filter((section) =>
    enabledSections.includes(section),
  );

  return (
    <PublicShell>
      <PortfolioBackground />
      <div className="z-10 relative gap-14 lg:gap-x-28 grid lg:grid-cols-[280px_minmax(0,1fr)] mx-auto px-6 py-10 sm:py-16 lg:py-24 w-full max-w-6xl">
        <PortfolioSidebar profile={portfolioProfile} sections={sections} />
        <main className="min-w-0">
          <MobileIntro profile={portfolioProfile} />
          {sections.map((sectionId) => {
            if (sectionId === "projects")
              return <ProjectsSection key={sectionId} projects={projects} />;
            if (sectionId === "experiences")
              return (
                <TimelineSection
                  key={sectionId}
                  experiences={portfolio?.experiences ?? []}
                />
              );
            if (sectionId === "skills")
              return <SkillsSection key={sectionId} skills={skills} />;
            if (sectionId === "about")
              return (
                <AboutSection key={sectionId} profile={portfolioProfile} />
              );
            if (sectionId === "github")
              return portfolio?.github ? (
                <GitHubSection key={sectionId} github={portfolio.github} />
              ) : null;
            if (sectionId === "custom-sections")
              return (
                <CustomSectionsSection
                  key={sectionId}
                  sections={portfolio?.customSections ?? []}
                />
              );
            if (sectionId === "pages")
              return (
                <PagesSection
                  key={sectionId}
                  pages={portfolio?.navigationPages ?? []}
                />
              );
            if (sectionId === "contact")
              return (
                <ContactSection key={sectionId} profile={portfolioProfile} />
              );
            return null;
          })}
        </main>
      </div>
      <PortfolioFloatingMenu
        items={[
          { href: "#projetos", label: "Projetos" },
          { href: "#timeline", label: "Trajetoria" },
          { href: portfolioProfile.github, label: "GitHub", external: true },
          {
            href: portfolioProfile.linkedin,
            label: "LinkedIn",
            external: true,
          },
          { href: "#contato", label: "Contato" },
        ]}
      />
    </PublicShell>
  );
}

export function PortfolioBackground({ variant = "fixed" }: { variant?: "fixed" | "absolute" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "z-0 inset-0 bg-background overflow-hidden pointer-events-none",
        variant === "fixed" ? "fixed" : "absolute",
      )}
    >
      <div className="top-0 absolute inset-x-0 h-[110px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="opacity-35 size-full [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(143,183,255,0.10),transparent_28%),linear-gradient(180deg,var(--background),var(--background-subtle)_46%,var(--background))]" />
      {/*
        Aurora desativada por direcao visual. Mantida comentada para referencia
        enquanto avaliamos a versao com light rays.
      <div className="portfolio-top-aurora">
        <span className="portfolio-top-aurora-layer portfolio-top-aurora-layer-primary" />
        <span className="portfolio-top-aurora-layer portfolio-top-aurora-layer-secondary" />
      </div>
      */}
      <div className="portfolio-light-rays">
        <span className="portfolio-light-ray portfolio-light-ray-primary" />
        <span className="portfolio-light-ray portfolio-light-ray-secondary" />
        <span className="portfolio-light-ray portfolio-light-ray-tertiary" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.34))]" />
    </div>
  );
}

function PortfolioSidebar({
  profile,
  sections,
}: {
  profile: PortfolioProfile;
  sections: string[];
}) {
  const navSections = sections.filter(
    (section) => section !== "custom-sections" && section !== "pages",
  );

  return (
    <aside className="hidden lg:block">
      <div className="top-24 sticky flex flex-col gap-10 min-h-[calc(100dvh-7rem)]">
        <MotionReveal
          className="flex flex-col gap-10 min-h-[calc(100dvh-7rem)]"
          variant="slide-right"
        >
          <section id="hero" className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Image
                alt={profile.name}
                className="bg-muted border border-border rounded-full ring-4 ring-muted/40 size-[76px] object-cover"
                height={76}
                src={profile.avatarUrl}
                unoptimized
                width={76}
              />
              <div className="pt-1 min-w-0">
                <p className="font-semibold text-lg tracking-[-0.03em]">
                  {profile.name}
                </p>
                <p className="mt-1 text-muted-foreground text-xs leading-5">
                  {profile.headline}
                </p>
              </div>
            </div>
            <p className="max-w-[270px] text-muted-foreground text-sm text-pretty leading-7">
              {profile.summary}
            </p>
          </section>

          <SocialDock profile={profile} />

          <nav
            aria-label="Navegacao principal"
            className="gap-1 grid text-muted-foreground"
          >
            {navSections.map((section) => (
              <SidebarNavLink
                href={`#${sectionToAnchor(section)}`}
                key={section}
              >
                {sectionToLabel(section)}
              </SidebarNavLink>
            ))}
          </nav>
        </MotionReveal>
      </div>
    </aside>
  );
}

function SocialDock({ profile }: { profile: PortfolioProfile }) {
  return (
    <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-2xl p-2 border border-border rounded-full w-fit">
      <DockLink href={profile.github} label="GitHub">
        <GitHubIcon />
      </DockLink>
      <DockLink href={profile.linkedin} label="LinkedIn">
        <LinkedInIcon />
      </DockLink>
      <DockLink href={profile.instagram} label="Instagram">
        <InstagramIcon />
      </DockLink>
      <DockLink href="/admin/resume-builder" internal label="Curriculo">
        <DocumentIcon />
      </DockLink>
      <ThemeToggle className="bg-background hover:bg-muted border border-border text-muted-foreground hover:text-foreground" />
    </div>
  );
}

function DockLink({
  children,
  href,
  internal,
  label,
}: {
  children: ReactNode;
  href: string;
  internal?: boolean;
  label: string;
}) {
  const className =
    "grid size-9 place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  if (internal) {
    return (
      <Link aria-label={label} className={className} href={href} title={label}>
        {children}
      </Link>
    );
  }

  return (
    <a
      aria-label={label}
      className={className}
      href={href}
      rel="noreferrer"
      target="_blank"
      title={label}
    >
      {children}
    </a>
  );
}

function MobileIntro({ profile }: { profile: PortfolioProfile }) {
  return (
    <section className="lg:hidden flex flex-col gap-6 mb-14">
      <div className="flex items-center gap-4">
        <Image
          alt={profile.name}
          className="bg-muted border border-border rounded-full ring-4 ring-muted/40 size-[76px] object-cover"
          height={76}
          src={profile.avatarUrl}
          unoptimized
          width={76}
        />
        <div>
          <h1 className="font-semibold text-xl tracking-[-0.03em]">
            Ola, sou {profile.name}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm leading-6">
            {profile.headline}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm text-pretty leading-7">
        {profile.summary}
      </p>
      <SocialDock profile={profile} />
    </section>
  );
}

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const visibleProjects = projects.slice(0, 4);
  const hiddenProjects = projects.slice(4);

  return (
    <section className="scroll-mt-16" id="projetos">
      <SectionIntro
        description="Uma selecao curta dos projetos que melhor mostram produto, interface e engenharia fullstack."
        title="Projetos selecionados"
      />
      <MotionStagger className="gap-4 grid md:grid-cols-2 mt-8">
        {visibleProjects.map((project, index) => (
          <MotionItem className="h-full" key={project.title}>
            <ProjectCard index={index} project={project} />
          </MotionItem>
        ))}
      </MotionStagger>
      {hiddenProjects.length ? (
        <AnimatedDisclosure
          className="bg-card/70 mt-4 border border-border rounded-2xl overflow-hidden"
          label="Ver mais projetos"
        >
          <div className="gap-px grid bg-border border-border border-t">
            {hiddenProjects.map((project, index) => (
              <ProjectRow
                index={visibleProjects.length + index}
                key={project.title}
                project={project}
              />
            ))}
          </div>
        </AnimatedDisclosure>
      ) : null}
    </section>
  );
}

function ProjectCard({
  index,
  project,
}: {
  index: number;
  project: PortfolioProject;
}) {
  return (
    <MotionHoverCard className="h-full">
      <article className="group before:absolute relative before:inset-0 bg-card/80 before:bg-[radial-gradient(circle_at_50%_0%,rgba(143,183,255,0.16),transparent_42%)] before:opacity-0 hover:before:opacity-100 border border-border hover:border-primary-accent/40 rounded-2xl before:rounded-2xl h-full overflow-hidden transition-colors before:transition-opacity before:pointer-events-none">
        <div className="relative">
          <ProjectVisual
            coverPath={project.coverPath}
            index={index}
            title={project.title}
          />
          <div className="top-3 right-3 absolute flex items-center gap-2">
            {project.demoUrl ? (
              <ProjectActionButton href={project.demoUrl} label="Abrir deploy">
                <ExternalIcon />
              </ProjectActionButton>
            ) : null}
            {project.repoUrl ? (
              <ProjectActionButton
                href={project.repoUrl}
                label="Abrir repositorio"
              >
                <CodeIcon />
              </ProjectActionButton>
            ) : null}
            {project.id ? (
              <ProjectLikeButton
                compact
                initialLikesCount={project.likesCount ?? 0}
                projectId={project.id}
              />
            ) : null}
          </div>
        </div>
        <ProjectDetailsDrawer
          index={index}
          project={project}
          triggerClassName="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/35"
        >
          <div className="flex flex-col gap-4 hover:bg-surface-raised/45 p-5 transition-colors">
            <div className="flex justify-between items-center gap-3">
              <TechPill>{project.technologies[0] || "projeto"}</TechPill>
              <span className="text-[11px] text-foreground-subtle">
                0{index + 1}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg truncate tracking-[-0.02em]">
                {project.title}
              </h3>
              <p className="mt-2 overflow-hidden text-muted-foreground text-sm text-pretty leading-6 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {project.summary}
              </p>
            </div>
          </div>
        </ProjectDetailsDrawer>
      </article>
    </MotionHoverCard>
  );
}

function ProjectActionButton({
  children,
  href,
  label,
}: {
  children: ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      aria-label={label}
      className="place-items-center grid bg-black/45 hover:bg-black/70 shadow-sm backdrop-blur-md border border-white/10 rounded-full size-9 text-white transition-colors"
      href={href}
      rel="noreferrer"
      target="_blank"
      title={label}
    >
      {children}
    </a>
  );
}

function ProjectRow({
  index,
  project,
}: {
  index: number;
  project: PortfolioProject;
}) {
  return (
    <ProjectDetailsDrawer
      index={index}
      project={project}
      triggerClassName="grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-card px-5 py-4 text-left transition-colors hover:bg-surface-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/35"
    >
      <span className="font-mono text-foreground-subtle text-xs">
        0{index + 1}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{project.title}</span>
          {project.technologies[0] ? (
            <TechPill>{project.technologies[0]}</TechPill>
          ) : null}
        </span>
        <span className="hidden sm:block mt-1 text-muted-foreground text-xs truncate">
          {project.summary}
        </span>
      </span>
      <span className="text-muted-foreground">-&gt;</span>
    </ProjectDetailsDrawer>
  );
}

export function TimelineSection({ experiences }: { experiences: ExperienceDto[] }) {
  if (!experiences.length) return null;

  const visible = experiences.slice(0, 5);
  const hidden = experiences.slice(5);

  return (
    <section className="py-16 scroll-mt-16" id="timeline">
      <SectionIntro
        description="Uma linha do tempo curta com experiencias, estudos e marcos que ajudam a explicar minha evolucao profissional."
        title="Trajetoria"
      />
      <div className="mt-8">
        <TimelineList experiences={visible} />
        {hidden.length ? (
          <details className="group mt-4">
            <summary className="font-medium text-muted-foreground hover:text-foreground text-sm transition-colors cursor-pointer list-none">
              Ver linha do tempo completa{" "}
              <span className="inline-block group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="mt-5">
              <TimelineList experiences={hidden} startIndex={visible.length} />
            </div>
          </details>
        ) : null}
      </div>
    </section>
  );
}

function TimelineList({
  experiences,
  startIndex = 0,
}: {
  experiences: ExperienceDto[];
  startIndex?: number;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="top-6 bottom-6 left-[18px] absolute bg-gradient-to-b from-transparent via-primary-accent/45 to-transparent w-px"
      />
      <MotionScrollStack
        className="gap-5 grid"
        itemClassName="relative pl-12"
        stagger={0.08}
        visibleWindow={0.36}
        y={34}
      >
        {experiences.map((experience, index) => (
          <article
            className="group before:absolute relative before:inset-0 bg-card/90 before:bg-[radial-gradient(circle_at_20%_0%,rgba(143,183,255,0.14),transparent_38%)] before:opacity-0 hover:before:opacity-100 p-5 border border-border hover:border-primary-accent/35 rounded-2xl before:rounded-2xl overflow-hidden transition-colors before:transition-opacity before:pointer-events-none"
            key={experience.id}
          >
            <span className="top-6 -left-[39px] absolute place-items-center grid bg-background shadow-[0_0_0_8px_var(--background)] border border-primary-accent/30 rounded-full size-9 font-semibold text-[10px] text-primary-accent">
              {startIndex + index + 1}
            </span>
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="bg-primary-accent/10 px-3 py-1 border border-primary-accent/20 rounded-full font-medium text-[11px] text-primary-accent uppercase tracking-[0.12em]">
                {formatExperienceType(experience.type)}
              </span>
              <time
                className="font-mono text-foreground-subtle text-xs"
                dateTime={experience.startDate || undefined}
              >
                {experience.startDate
                  ? formatDate(experience.startDate)
                  : "Marco"}
              </time>
            </div>
            <h3 className="mt-4 font-semibold text-lg tracking-[-0.02em]">
              {experience.title}
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">
              {experience.organization}
            </p>
            {experience.description ? (
              <HtmlContent
                className="mt-4 text-muted-foreground text-sm text-pretty leading-7"
                html={experience.description}
              />
            ) : null}
          </article>
        ))}
      </MotionScrollStack>
    </div>
  );
}

export function SkillsSection({
  skills,
}: {
  skills: Array<Pick<SkillDto, "title" | "startedAt" | "description">>;
}) {
  return (
    <PortfolioSection id="habilidades" title="Tecnologias">
      <MotionStagger className="flex flex-wrap gap-2.5 mt-6">
        {skills.slice(0, 18).map((skill) => (
          <MotionItem key={skill.title}>
            <SkillBadge skill={skill} />
          </MotionItem>
        ))}
      </MotionStagger>
    </PortfolioSection>
  );
}

function SkillBadge({
  skill,
}: {
  skill: Pick<SkillDto, "title" | "description">;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 bg-card/80 px-3 py-1.5 border border-border hover:border-primary-accent/50 rounded-full text-muted-foreground hover:text-foreground text-sm transition-colors"
      title={stripHtmlToText(skill.description)}
    >
      <BrandLogo name={skill.title} />
      {skill.title}
    </span>
  );
}

export function AboutSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <PortfolioSection id="sobre" title="Sobre">
      <p className="mt-5 max-w-2xl text-muted-foreground text-sm text-pretty leading-7">
        {profile.about}
      </p>
    </PortfolioSection>
  );
}

export function GitHubSection({
  github,
}: {
  github: NonNullable<PublicPortfolioDto["github"]>;
}) {
  return (
    <PortfolioSection id="github" title="GitHub">
      <div className="flex flex-wrap gap-5 mt-5 text-muted-foreground text-sm">
        <span>{github.publicRepositories} repositorios</span>
        <span>{github.followers} seguidores</span>
        <a
          className="text-foreground hover:text-primary-accent"
          href={github.profileUrl}
          rel="noreferrer"
          target="_blank"
        >
          @{github.username}
        </a>
      </div>
      <GitHubContributionGraph
        className="mt-6"
        contributions={github.contributions ?? []}
        total={github.contributionsTotal ?? 0}
        username={github.username}
      />
      <MotionScrollStack
        className="gap-3 grid md:grid-cols-2 mt-6"
        itemClassName="h-full"
        stagger={0.1}
        visibleWindow={0.3}
        y={36}
      >
        {github.repositories.slice(0, 4).map((repository) => (
          <a
            className="block before:absolute relative before:inset-0 bg-card/80 before:bg-[radial-gradient(circle_at_15%_0%,rgba(143,183,255,0.13),transparent_44%)] hover:bg-surface-raised/55 before:opacity-0 hover:before:opacity-100 p-4 border border-border hover:border-primary-accent/40 rounded-2xl before:rounded-2xl h-full overflow-hidden transition-colors before:transition-opacity before:pointer-events-none"
            href={repository.url}
            key={repository.id}
            rel="noreferrer"
            target="_blank"
          >
            <span className="flex justify-between items-start gap-3">
              <span className="font-medium text-sm">{repository.name}</span>
              <span className="text-primary-accent text-xs">-&gt;</span>
            </span>
            <p className="mt-2 max-h-12 overflow-hidden text-muted-foreground text-xs leading-6">
              {repository.description || "Repositorio publico no GitHub."}
            </p>
            <span className="flex flex-wrap gap-3 mt-4 text-[11px] text-foreground-subtle">
              {repository.language ? <span>{repository.language}</span> : null}
              <span>{repository.stars} estrelas</span>
              <span>{repository.forks} forks</span>
            </span>
          </a>
        ))}
      </MotionScrollStack>
      <GitHubActivityTimeline activity={github.activity} />
    </PortfolioSection>
  );
}

type GitHubActivityItem = NonNullable<
  PublicPortfolioDto["github"]
>["activity"][number];

function GitHubActivityTimeline({
  activity,
}: {
  activity: GitHubActivityItem[];
}) {
  const visibleActivity = activity.slice(0, 6);
  if (!visibleActivity.length) return null;

  const groups = visibleActivity.reduce<
    Array<{ label: string; items: GitHubActivityItem[] }>
  >((acc, item) => {
    const label = formatGitHubMonth(item.createdAt);
    const current = acc.find((group) => group.label === label);

    if (current) current.items.push(item);
    else acc.push({ label, items: [item] });

    return acc;
  }, []);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-semibold text-sm tracking-[-0.01em]">
          Atividade recente
        </h3>
        <span className="text-foreground-subtle text-xs">Eventos publicos</span>
      </div>
      <div className="space-y-8 mt-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="items-center gap-4 grid grid-cols-[auto_minmax(0,1fr)] mb-5">
              <p className="font-medium text-foreground-muted text-xs">
                {group.label}
              </p>
              <span className="bg-border h-px" />
            </div>
            <div className="relative pl-11">
              <span className="top-2 bottom-0 left-[15px] absolute bg-border w-px" />
              <div className="space-y-7">
                {group.items.map((item) => (
                  <GitHubActivityRow activity={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubActivityRow({ activity }: { activity: GitHubActivityItem }) {
  const summary = getActivitySummary(activity);
  const repoUrl =
    activity.url ||
    (activity.repository ? `https://github.com/${activity.repository}` : "");
  const count = Number(activity.count ?? 0);

  return (
    <div className="relative">
      <span className="top-0 -left-11 absolute flex justify-center items-center bg-surface-raised shadow-[0_0_0_6px_var(--background)] border border-border rounded-full size-8 text-foreground-muted">
        <ActivityIcon type={activity.type} />
      </span>
      <div className="sm:items-start gap-3 grid sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm leading-6">
            {summary}{" "}
            {activity.repository ? (
              <a
                className="hover:text-primary-accent decoration-border underline underline-offset-4 transition-colors"
                href={repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                {activity.repository}
              </a>
            ) : null}
          </p>
          {activity.title ? (
            <a
              className="block bg-card/75 hover:bg-surface-raised/60 mt-3 p-4 border border-border hover:border-primary-accent/40 rounded-xl transition-colors"
              href={repoUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex items-start gap-3">
                <span className="mt-0.5 text-primary-accent">
                  <ActivityIcon type={activity.type} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground text-sm leading-6">
                    {activity.title}
                  </span>
                  <span className="block mt-1 text-foreground-subtle text-xs leading-5">
                    {formatActivityType(activity.type)} publico no GitHub.
                  </span>
                </span>
              </span>
            </a>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-foreground-subtle text-xs">
          {activity.type === "PushEvent" && count > 0 ? (
            <span className="hidden sm:block bg-muted rounded-full w-24 h-2 overflow-hidden">
              <span
                className="block bg-success rounded-full h-full"
                style={{ width: `${Math.min(100, Math.max(18, count * 18))}%` }}
              />
            </span>
          ) : null}
          <span>{formatShortDate(activity.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function CustomSectionsSection({
  sections,
}: {
  sections: PublicPortfolioDto["customSections"];
}) {
  if (!sections.length) return null;

  return (
    <div id="conteudos">
      {sections.slice(0, 2).map((section) => (
        <PortfolioSection
          id={section.key}
          key={section.id}
          title={section.title}
        >
          <HtmlContent
            className="mt-5 max-w-2xl text-muted-foreground text-sm leading-7"
            html={section.content}
          />
        </PortfolioSection>
      ))}
    </div>
  );
}

export function PagesSection({
  pages,
}: {
  pages: NonNullable<PublicPortfolioDto["navigationPages"]>;
}) {
  if (!pages.length) return null;

  return (
    <PortfolioSection id="pages" title="Paginas">
      <div className="gap-3 grid sm:grid-cols-2 mt-5">
        {pages.slice(0, 4).map((page) => (
          <Link
            className="group bg-card/80 hover:bg-surface-raised/55 p-4 border border-border hover:border-primary-accent/40 rounded-2xl text-sm transition-colors"
            href={`/p/${page.slug}`}
            key={page.id}
          >
            <span className="flex justify-between items-center gap-3">
              <span>{page.title}</span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                -&gt;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </PortfolioSection>
  );
}

export function ContactSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <section className="py-16 scroll-mt-16" id="contato">
      <MotionReveal className="relative bg-card/85 p-7 border border-border rounded-2xl overflow-hidden">
        <div
          aria-hidden="true"
          className="top-0 absolute inset-x-0 bg-gradient-to-r from-transparent via-primary-accent/70 to-transparent h-px"
        />
        <div className="md:items-end gap-8 grid md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="text-primary-accent text-sm">
              Disponivel para projetos e oportunidades
            </p>
            <h2 className="mt-3 font-semibold text-3xl tracking-[-0.035em]">
              Vamos conversar
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground text-sm text-pretty leading-7">
              Se voce esta construindo um produto web, precisa evoluir uma
              interface ou quer conversar sobre uma vaga fullstack, meus canais
              principais estao aqui.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ContactButton href={profile.linkedin}>
              <LinkedInIcon /> LinkedIn
            </ContactButton>
            <ContactButton href={profile.github}>
              <GitHubIcon /> GitHub
            </ContactButton>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

function ContactButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      className="inline-flex items-center gap-2 bg-background px-4 border border-border hover:border-primary-accent/50 rounded-full min-h-11 font-medium hover:text-primary-accent text-sm transition-colors"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function PortfolioSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section className="py-12 scroll-mt-16" id={id}>
      <MotionScrollReveal>
        <h2 className="font-bold text-xl tracking-[-0.03em]">{title}</h2>
      </MotionScrollReveal>
      {children}
    </section>
  );
}

function SectionIntro({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <MotionScrollReveal className="flex flex-col gap-3" y={52}>
      <h2 className="font-bold text-xl tracking-[-0.03em]">{title}</h2>
      <p className="max-w-2xl text-muted-foreground text-sm text-pretty leading-7">
        {description}
      </p>
    </MotionScrollReveal>
  );
}

function ProjectVisual({
  coverPath,
  index,
  title,
}: {
  coverPath?: string;
  index: number;
  title: string;
}) {
  return <ProjectCover coverPath={coverPath} index={index} title={title} />;
}

function TechPill({ children }: { children: ReactNode }) {
  return (
    <span className="bg-primary-accent/10 px-2 py-0.5 border border-primary-accent/25 rounded-md font-mono text-[10px] text-primary-accent uppercase tracking-[0.1em]">
      {children}
    </span>
  );
}


function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1A9.5 9.5 0 0 1 12 6c.9 0 1.7.1 2.5.3 1.9-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M6.8 8.8H3.7V20h3.1V8.8ZM5.2 4C4.2 4 3.5 4.7 3.5 5.6s.7 1.6 1.7 1.6 1.7-.7 1.7-1.6S6.2 4 5.2 4Zm15.3 9.6c0-3.2-1.7-5.1-4.3-5.1-1.7 0-2.7.9-3.2 1.8V8.8H9.9V20H13v-6.1c0-1.6.9-2.6 2.2-2.6 1.2 0 2 .8 2 2.5V20h3.3v-6.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <rect
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
        width="15"
        x="4.5"
        y="4.5"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.6" cy="7.4" fill="currentColor" r="1" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 3h7l4 4v14H7V3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 3v5h4M9.5 12h5M9.5 15h5M9.5 18h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M8 16 16 8M10 8h6v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m8.5 9-3 3 3 3M15.5 9l3 3-3 3M13 7l-2 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ActivityIcon({ type }: { type: string }) {
  if (type === "PullRequestEvent") return <PullRequestIcon />;
  if (type === "CreateEvent" || type === "ReleaseEvent")
    return <RepositoryIcon />;
  if (type === "IssuesEvent" || type === "IssueCommentEvent")
    return <MessageIcon />;
  if (type === "WatchEvent") return <StarIcon />;

  return <CommitIcon />;
}

function CommitIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 12h10M7 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm16 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PullRequestIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5 8v8a2 2 0 1 0 2 2M17 6h2a2 2 0 0 1 2 2v4M17 6l3-3m-3 3 3 3M19 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function RepositoryIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Zm1 14h12M8 7h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 5h14v10H9l-4 4V5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function sectionToAnchor(section: string) {
  const anchors: Record<string, string> = {
    about: "sobre",
    skills: "habilidades",
    projects: "projetos",
    experiences: "timeline",
    github: "github",
    contact: "contato",
  };

  return anchors[section] ?? section;
}

function sectionToLabel(section: string) {
  const labels: Record<string, string> = {
    about: "Sobre",
    skills: "Tecnologias",
    projects: "Projetos",
    experiences: "Trajetoria",
    github: "GitHub",
    contact: "Contato",
  };

  return labels[section] ?? section;
}

function formatExperienceType(value: string) {
  const labels: Record<string, string> = {
    certification: "Certificacao",
    education: "Formacao",
    experience: "Experiencia",
    link: "Marco",
  };

  return labels[value.toLowerCase()] ?? value;
}

function formatActivityType(value: string) {
  const labels: Record<string, string> = {
    CreateEvent: "Criacao",
    DeleteEvent: "Remocao",
    ForkEvent: "Fork",
    IssueCommentEvent: "Comentario",
    IssuesEvent: "Issue",
    PullRequestEvent: "Pull request",
    PushEvent: "Commit",
    ReleaseEvent: "Release",
    WatchEvent: "Star",
  };

  return labels[value] ?? "Atividade";
}

function getActivitySummary(activity: GitHubActivityItem) {
  const action = activity.action ? activity.action.toLowerCase() : "";
  const count = Number(activity.count ?? 0);

  if (activity.type === "PushEvent") {
    const commits = count > 1 ? "commits" : "commit";
    return `Criou ${Math.max(count, 1)} ${commits} em`;
  }

  if (activity.type === "CreateEvent") return "Criou item publico em";
  if (activity.type === "ReleaseEvent") return "Publicou release em";
  if (activity.type === "WatchEvent") return "Marcou com estrela";
  if (activity.type === "IssueCommentEvent") return "Comentou uma issue em";

  if (activity.type === "PullRequestEvent") {
    if (action === "closed") return "Fechou pull request em";
    if (action === "reopened") return "Reabriu pull request em";
    return "Abriu pull request em";
  }

  if (activity.type === "IssuesEvent") {
    if (action === "closed") return "Fechou issue em";
    if (action === "reopened") return "Reabriu issue em";
    return "Atualizou issue em";
  }

  return `${formatActivityType(activity.type)} em`;
}

function formatGitHubMonth(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Atividades recentes";

  const label = date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
}

function stripHtmlToText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeHeadline(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "software developer") return "Desenvolvedor de software";
  if (
    normalized === "fullstack developer" ||
    normalized === "full stack developer"
  )
    return "Desenvolvedor fullstack";

  return value;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}
