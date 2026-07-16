import {
  MotionHoverCard,
  MotionReveal,
  MotionScrollReveal,
  MotionScrollStack,
  MotionStickyStack,
} from "@/components/ds/motion";
import { RichText } from "@/components/ds/rich-text";
import { PublicShell } from "@/components/layout/public-shell";
import { resolveFileUrl } from "@/core/files/file-url";
import { PortfolioFloatingMenu } from "@/features/portfolio/components/portfolio-floating-menu";
import { ProjectLikeButton } from "@/features/portfolio/components/project-like-button";
import type { ExperienceDto, ProjectDto, PublicPortfolioDto, SkillDto } from "@portfolio/contracts";
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
  { title: "Next.js", startedAt: "03/2023", description: "Interfaces web modernas." },
  { title: "TypeScript", startedAt: "05/2023", description: "Contratos claros entre front, API e regras." },
  { title: "Tailwind CSS", startedAt: "06/2023", description: "Design responsivo e consistente." },
  { title: "React Hook Form & Zod", startedAt: "01/2024", description: "Formularios robustos." },
  { title: "Node JS & Express", startedAt: "01/2024", description: "APIs REST, auth, uploads e integracoes." },
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
    summary: "Portfolio criado para apresentar habilidades, projetos e formas de contato.",
    technologies: ["next.js", "tailwind.css"],
    likesCount: 0,
  },
  {
    id: "",
    title: "Kanban Board",
    summary: "Projeto de estudo sobre drag and drop, Tailwind CSS, Shadcn UI e animacoes.",
    technologies: ["next.js", "tailwind.css"],
    likesCount: 0,
  },
];

type PortfolioHomeProps = {
  portfolio: PublicPortfolioDto | null;
};

type PortfolioProject = Pick<ProjectDto, "title" | "summary" | "technologies"> &
  Partial<Pick<ProjectDto, "id" | "coverPath" | "demoUrl" | "likesCount">>;

type PortfolioProfile = {
  name: string;
  headline: string;
  summary: string;
  about: string;
  github: string;
  linkedin: string;
  instagram: string;
  avatarUrl: string;
};

const sectionOrder = ["projects", "experiences", "skills", "about", "github", "custom-sections", "pages", "contact"];

export function PortfolioHome({ portfolio }: PortfolioHomeProps) {
  const profile = portfolio?.profile;
  const hasPublishedVersion = Boolean(portfolio?.version);
  const skills = hasPublishedVersion ? portfolio?.skills ?? [] : portfolio?.skills?.length ? portfolio.skills : fallbackSkills;
  const projects = hasPublishedVersion ? portfolio?.projects ?? [] : portfolio?.projects?.length ? portfolio.projects : fallbackProjects;
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
    ? portfolio.version.sections.filter((section) => section.enabled).map((section) => section.id)
    : ["hero", "about", "skills", "projects", "experiences", "custom-sections", "pages", "github", "contact"];
  const sections = sectionOrder.filter((section) => enabledSections.includes(section));

  return (
    <PublicShell>
      <PortfolioBackground />
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-10 sm:py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-x-28 lg:py-24">
        <PortfolioSidebar profile={portfolioProfile} sections={sections} />
        <main className="min-w-0">
          <MobileIntro profile={portfolioProfile} />
          {sections.map((sectionId) => {
            if (sectionId === "projects") return <ProjectsSection key={sectionId} projects={projects} />;
            if (sectionId === "experiences") return <TimelineSection key={sectionId} experiences={portfolio?.experiences ?? []} />;
            if (sectionId === "skills") return <SkillsSection key={sectionId} skills={skills} />;
            if (sectionId === "about") return <AboutSection key={sectionId} profile={portfolioProfile} />;
            if (sectionId === "github") return portfolio?.github ? <GitHubSection key={sectionId} github={portfolio.github} /> : null;
            if (sectionId === "custom-sections") return <CustomSectionsSection key={sectionId} sections={portfolio?.customSections ?? []} />;
            if (sectionId === "pages") return <PagesSection key={sectionId} pages={portfolio?.navigationPages ?? []} />;
            if (sectionId === "contact") return <ContactSection key={sectionId} profile={portfolioProfile} />;
            return null;
          })}
        </main>
      </div>
      <PortfolioFloatingMenu
        items={[
          { href: "#projetos", label: "Projetos" },
          { href: "#timeline", label: "Trajetoria" },
          { href: portfolioProfile.github, label: "GitHub", external: true },
          { href: portfolioProfile.linkedin, label: "LinkedIn", external: true },
          { href: "#contato", label: "Contato" },
        ]}
      />
    </PublicShell>
  );
}

function PortfolioBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-[110px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="size-full opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(143,183,255,0.10),transparent_28%),linear-gradient(180deg,var(--background),var(--background-subtle)_46%,var(--background))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.34))]" />
    </div>
  );
}

function PortfolioSidebar({ profile, sections }: { profile: PortfolioProfile; sections: string[] }) {
  const navSections = sections.filter((section) => section !== "custom-sections" && section !== "pages");

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 flex flex-col gap-10">
        <MotionReveal className="flex flex-col gap-10" variant="slide-right">
          <section id="hero" className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <img alt={profile.name} className="size-[76px] rounded-full border border-border bg-muted object-cover ring-4 ring-muted/40" src={profile.avatarUrl} />
              <div className="min-w-0 pt-1">
                <p className="text-lg font-semibold tracking-[-0.03em]">{profile.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{profile.headline}</p>
              </div>
            </div>
            <p className="max-w-[270px] text-pretty text-sm leading-7 text-muted-foreground">{profile.summary}</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold tracking-[-0.02em]">Sobre</h2>
            <p className="max-w-[270px] text-pretty text-sm leading-7 text-muted-foreground">{profile.about}</p>
          </section>

          <SocialDock profile={profile} />

          <nav aria-label="Navegacao principal" className="grid gap-3 text-muted-foreground">
            {navSections.map((section) => (
              <SidebarNavLink href={`#${sectionToAnchor(section)}`} key={section}>
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
    <div className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/90 p-2 backdrop-blur-2xl">
      <DockLink href={profile.github}>GH</DockLink>
      <DockLink href={profile.linkedin}>IN</DockLink>
      <DockLink href={profile.instagram}>IG</DockLink>
      <DockLink href="/admin/resume-builder" internal>CV</DockLink>
    </div>
  );
}

function DockLink({ children, href, internal }: { children: ReactNode; href: string; internal?: boolean }) {
  const className = "grid size-9 place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  if (internal) {
    return <Link className={className} href={href}>{children}</Link>;
  }

  return <a className={className} href={href} rel="noreferrer" target="_blank">{children}</a>;
}

function MobileIntro({ profile }: { profile: PortfolioProfile }) {
  return (
    <section className="mb-14 flex flex-col gap-6 lg:hidden">
      <div className="flex items-center gap-4">
        <img alt={profile.name} className="size-[76px] rounded-full border border-border bg-muted object-cover ring-4 ring-muted/40" src={profile.avatarUrl} />
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.03em]">Ola, sou {profile.name}</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{profile.headline}</p>
        </div>
      </div>
      <p className="text-pretty text-sm leading-7 text-muted-foreground">{profile.summary}</p>
      <SocialDock profile={profile} />
    </section>
  );
}

function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const visibleProjects = projects.slice(0, 4);
  const hiddenProjects = projects.slice(4);

  return (
    <section className="scroll-mt-16" id="projetos">
      <SectionIntro
        description="Uma selecao curta dos projetos que melhor mostram produto, interface e engenharia fullstack."
        title="Projetos selecionados"
      />
      <MotionScrollStack className="mt-8 grid gap-4 md:grid-cols-2" itemClassName="h-full" stagger={0.12} visibleWindow={0.34} y={46}>
        {visibleProjects.map((project, index) => (
          <ProjectCard index={index} key={project.title} project={project} />
        ))}
      </MotionScrollStack>
      {hiddenProjects.length ? (
        <details className="group mt-4 overflow-hidden rounded-2xl border border-border bg-card/70">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Ver mais projetos
            <span className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-px border-t border-border bg-border">
            {hiddenProjects.map((project, index) => (
              <ProjectRow index={visibleProjects.length + index} key={project.title} project={project} />
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function ProjectCard({ index, project }: { index: number; project: PortfolioProject }) {
  const isExternal = Boolean(project.demoUrl);

  return (
    <MotionHoverCard className="h-full">
      <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card/80 transition-colors hover:border-primary-accent/40">
        <Link
          className="block"
          href={project.demoUrl || "#contato"}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          <ProjectVisual coverPath={project.coverPath} index={index} title={project.title} />
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <TechPill>{project.technologies[0] || "projeto"}</TechPill>
              <span className="text-[11px] text-foreground-subtle">0{index + 1}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{project.title}</h3>
              <p className="mt-2 max-h-20 overflow-hidden text-pretty text-sm leading-6 text-muted-foreground">{project.summary}</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <ProjectLink project={project} />
          {project.id ? <ProjectLikeButton initialLikesCount={project.likesCount ?? 0} projectId={project.id} /> : null}
        </div>
      </article>
    </MotionHoverCard>
  );
}

function ProjectRow({ index, project }: { index: number; project: PortfolioProject }) {
  const isExternal = Boolean(project.demoUrl);

  return (
    <Link
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-card px-5 py-4 transition-colors hover:bg-surface-raised"
      href={project.demoUrl || "#contato"}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <span className="font-mono text-xs text-foreground-subtle">0{index + 1}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{project.title}</span>
          {project.technologies[0] ? <TechPill>{project.technologies[0]}</TechPill> : null}
        </span>
        <span className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">{project.summary}</span>
      </span>
      <span className="text-muted-foreground">-&gt;</span>
    </Link>
  );
}

function TimelineSection({ experiences }: { experiences: ExperienceDto[] }) {
  if (!experiences.length) return null;

  const visible = experiences.slice(0, 5);
  const hidden = experiences.slice(5);

  return (
    <section className="scroll-mt-16 py-16" id="timeline">
      <SectionIntro
        description="Uma linha do tempo curta com experiencias, estudos e marcos que ajudam a explicar minha evolucao profissional."
        title="Trajetoria"
      />
      <div className="mt-8">
        <TimelineList experiences={visible} />
        {hidden.length ? (
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Ver linha do tempo completa <span className="inline-block transition-transform group-open:rotate-45">+</span>
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

function TimelineList({ experiences, startIndex = 0 }: { experiences: ExperienceDto[]; startIndex?: number }) {
  return (
    <MotionStickyStack className="grid gap-5" itemClassName="rounded-2xl border border-border bg-card/95 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm" topOffset="104px">
      {experiences.map((experience, index) => (
        <article className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]" key={experience.id}>
          <div className="flex items-start justify-between gap-3 md:block">
            <span className="font-mono text-xs text-foreground-subtle">0{startIndex + index + 1}</span>
            <time className="text-xs text-foreground-subtle" dateTime={experience.startDate || undefined}>
              {experience.startDate ? formatDate(experience.startDate) : "Marco"}
            </time>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-accent">{experience.type}</p>
            <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">{experience.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{experience.organization}</p>
            {experience.description ? <p className="mt-3 text-pretty text-sm leading-7 text-muted-foreground">{experience.description}</p> : null}
          </div>
        </article>
      ))}
    </MotionStickyStack>
  );
}

function SkillsSection({ skills }: { skills: Array<Pick<SkillDto, "title" | "startedAt" | "description">> }) {
  return (
    <PortfolioSection id="habilidades" title="Tecnologias">
      <MotionScrollStack className="mt-6 flex flex-wrap gap-2" stagger={0.045} visibleWindow={0.24} y={22}>
        {skills.slice(0, 18).map((skill) => (
          <span className="inline-flex rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary-accent/50 hover:text-foreground" key={skill.title} title={skill.description}>
            {skill.title}
          </span>
        ))}
      </MotionScrollStack>
    </PortfolioSection>
  );
}

function AboutSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <PortfolioSection id="sobre" title="Sobre">
      <p className="mt-5 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground">{profile.about}</p>
    </PortfolioSection>
  );
}

function GitHubSection({ github }: { github: NonNullable<PublicPortfolioDto["github"]> }) {
  return (
    <PortfolioSection id="github" title="GitHub">
      <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
        <span>{github.publicRepositories} repositorios</span>
        <span>{github.followers} seguidores</span>
        <a className="text-foreground hover:text-primary-accent" href={github.profileUrl} rel="noreferrer" target="_blank">@{github.username}</a>
      </div>
      <MotionScrollStack className="mt-6 grid gap-3 md:grid-cols-2" itemClassName="h-full" stagger={0.1} visibleWindow={0.3} y={36}>
        {github.repositories.slice(0, 4).map((repository) => (
          <a className="block h-full rounded-2xl border border-border bg-card/80 p-4 transition-colors hover:border-primary-accent/40" href={repository.url} key={repository.id} rel="noreferrer" target="_blank">
            <span className="text-sm font-medium">{repository.name}</span>
            <p className="mt-2 max-h-12 overflow-hidden text-xs leading-6 text-muted-foreground">{repository.description || "Repositorio publico no GitHub."}</p>
          </a>
        ))}
      </MotionScrollStack>
    </PortfolioSection>
  );
}

function CustomSectionsSection({ sections }: { sections: PublicPortfolioDto["customSections"] }) {
  if (!sections.length) return null;

  return (
    <div id="conteudos">
      {sections.slice(0, 2).map((section) => (
        <PortfolioSection id={section.key} key={section.id} title={section.title}>
          <RichText className="mt-5 block max-w-2xl text-sm leading-7 text-muted-foreground" value={section.content} />
        </PortfolioSection>
      ))}
    </div>
  );
}

function PagesSection({ pages }: { pages: NonNullable<PublicPortfolioDto["navigationPages"]> }) {
  if (!pages.length) return null;

  return (
    <PortfolioSection id="pages" title="Paginas">
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {pages.slice(0, 4).map((page) => (
          <Link className="rounded-2xl border border-border bg-card/80 p-4 text-sm transition-colors hover:border-primary-accent/40" href={`/p/${page.slug}`} key={page.id}>
            {page.title}
          </Link>
        ))}
      </div>
    </PortfolioSection>
  );
}

function ContactSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <section className="scroll-mt-16 py-16" id="contato">
      <MotionReveal className="rounded-2xl border border-border bg-card/80 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Vamos conversar</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
          Estou aberto a conversar sobre projetos, oportunidades e produtos web que precisem de uma boa experiencia.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="text-sm font-medium hover:text-primary-accent" href={profile.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
          <a className="text-sm font-medium hover:text-primary-accent" href={profile.github} rel="noreferrer" target="_blank">GitHub</a>
        </div>
      </MotionReveal>
    </section>
  );
}

function PortfolioSection({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section className="scroll-mt-16 py-12" id={id}>
      <MotionScrollReveal>
        <h2 className="text-xl font-bold tracking-[-0.03em]">{title}</h2>
      </MotionScrollReveal>
      {children}
    </section>
  );
}

function SectionIntro({ description, title }: { description: string; title: string }) {
  return (
    <MotionScrollReveal className="flex flex-col gap-3" y={52}>
      <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{title}</h2>
      <p className="max-w-2xl text-pretty text-sm leading-7 text-muted-foreground">{description}</p>
    </MotionScrollReveal>
  );
}

function ProjectVisual({ coverPath, index, title }: { coverPath?: string; index: number; title: string }) {
  const coverUrl = resolveFileUrl(coverPath);

  if (coverUrl) {
    return <img alt={`Preview do projeto ${title}`} className="aspect-[1.45] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" src={coverUrl} />;
  }

  return (
    <div className="flex aspect-[1.45] items-center justify-center bg-[linear-gradient(135deg,#0b0f17,#111827_52%,#151923)] p-6">
      <div className="flex aspect-video w-full max-w-xs flex-col justify-between rounded-xl border border-white/10 bg-black/30 p-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">case 0{index + 1}</span>
        <span className="text-lg font-semibold tracking-[-0.03em] text-white">{title}</span>
      </div>
    </div>
  );
}

function ProjectLink({ project }: { project: PortfolioProject }) {
  const isExternal = Boolean(project.demoUrl);

  return (
    <Link
      className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-accent"
      href={project.demoUrl || "#contato"}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      Ver projeto <span aria-hidden="true">-&gt;</span>
    </Link>
  );
}

function TechPill({ children }: { children: ReactNode }) {
  return <span className="rounded-md border border-primary-accent/25 bg-primary-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-primary-accent">{children}</span>;
}

function SidebarNavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link className="group flex items-center gap-3 text-xs font-medium transition-colors hover:text-foreground" href={href}>
      <span className="h-px w-8 bg-border transition-all duration-200 group-hover:w-12 group-hover:bg-foreground" />
      <span>{children}</span>
    </Link>
  );
}

function LogoMark() {
  return (
    <svg aria-hidden="true" className="size-6 text-foreground" fill="none" viewBox="0 0 37 32">
      <path
        className="fill-current"
        d="M14.7266 0.590907L6.28906 31.9375H0.306108L8.74361 0.590907H14.7266ZM17.9034 20.4318V14.2955L36.9261 6.67614V13.1193L24.8068 17.3125L25.0114 17.0057V17.7216L24.8068 17.4148L36.9261 21.608V28.0511L17.9034 20.4318Z"
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

function normalizeHeadline(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "software developer") return "Desenvolvedor de software";
  if (normalized === "fullstack developer" || normalized === "full stack developer") return "Desenvolvedor fullstack";

  return value;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}
