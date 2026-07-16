import { FramedCard } from "@/components/ds/framed-card";
import { Ledger, LedgerRow } from "@/components/ds/ledger";
import {
  MotionHoverCard,
  MotionItem,
  MotionReveal,
  MotionStagger,
  ScrollParallax,
} from "@/components/ds/motion";
import { RichText } from "@/components/ds/rich-text";
import { Stat, StatGrid } from "@/components/ds/stat-grid";
import { ThemeToggle } from "@/components/ds/theme-toggle";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/core/files/file-url";
import { PortfolioFloatingMenu } from "@/features/portfolio/components/portfolio-floating-menu";
import { ProjectLikeButton } from "@/features/portfolio/components/project-like-button";
import type { ExperienceDto, ProjectDto, PublicPortfolioDto, SkillDto } from "@portfolio/contracts";
import Link from "next/link";

const fallbackProfile = {
  name: "Kaesyo Felix",
  headline: "software developer",
  summary:
    "Welcome to the Dark Side of Coding! celebrating the elegance of dark mode.",
  about:
    "Ola, sou Kaesyo, estudante de Engenharia de Software. Tenho interesse em interfaces modernas, desenvolvimento web, APIs e produtos fullstack com experiencias bem cuidadas.",
  github: "https://github.com/KARAUJO1003",
  linkedin: "https://www.linkedin.com/in/ka%C3%A9syo-f%C3%A9lix-837345271/",
  instagram: "https://www.instagram.com/kaesyo_/",
  avatar: "https://github.com/KARAUJO1003.png",
};

const fallbackSkills = [
  {
    title: "Next.js",
    startedAt: "03/2023",
    description: "Desenvolvimento web moderno com foco em interfaces dinamicas e performaticas.",
  },
  {
    title: "TypeScript",
    startedAt: "05/2023",
    description: "Tipagem para criar contratos mais claros entre telas, API e regras de negocio.",
  },
  {
    title: "Tailwind CSS",
    startedAt: "06/2023",
    description: "Estilizacao rapida e consistente para construir interfaces responsivas.",
  },
  {
    title: "Shadcn UI / GSAP",
    startedAt: "07/2023",
    description: "Componentes e animacoes para elevar a experiencia visual dos projetos.",
  },
  {
    title: "React Hook Form & Zod",
    startedAt: "01/2024",
    description: "Formularios robustos com validacao declarativa e boa experiencia de uso.",
  },
  {
    title: "Node JS & Express",
    startedAt: "01/2024",
    description: "Criacao de APIs REST, autenticacao, uploads e integracoes backend.",
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
    summary: "Versao atual do portfolio criada para apresentar habilidades, projetos e contato.",
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
  {
    id: "",
    title: "Buzzy Demarcacoes",
    summary:
      "Sistema de agendamento e visualizacao de demarcacoes para otimizar processos internos.",
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

const orderedMainSections = ["projects", "experiences", "skills", "about", "custom-sections", "pages", "github", "contact"];

export function PortfolioHome({ portfolio }: PortfolioHomeProps) {
  const profile = portfolio?.profile;
  const hasPublishedVersion = Boolean(portfolio?.version);
  const skills = hasPublishedVersion ? portfolio?.skills ?? [] : portfolio?.skills?.length ? portfolio.skills : fallbackSkills;
  const projects = hasPublishedVersion ? portfolio?.projects ?? [] : portfolio?.projects?.length ? portfolio.projects : fallbackProjects;
  const githubUrl = profile?.github || fallbackProfile.github;
  const linkedinUrl = profile?.linkedin || fallbackProfile.linkedin;
  const instagramUrl = fallbackProfile.instagram;
  const portfolioProfile: PortfolioProfile = {
    name: profile?.name || fallbackProfile.name,
    headline: profile?.headline || fallbackProfile.headline,
    summary: profile?.summary || fallbackProfile.summary,
    about: profile?.objective || profile?.summary || fallbackProfile.about,
    github: githubUrl,
    linkedin: linkedinUrl,
    instagram: instagramUrl,
    avatarUrl: resolveFileUrl(profile?.avatarPath) || fallbackProfile.avatar,
  };
  const enabledSections = portfolio?.version?.sections?.length
    ? portfolio.version.sections.filter((section) => section.enabled).map((section) => section.id)
    : ["hero", "about", "skills", "projects", "experiences", "custom-sections", "pages", "github", "contact"];
  const sections = orderedMainSections.filter((section) => enabledSections.includes(section));

  return (
    <PublicShell>
      <PortfolioBackground />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-0 xl:grid-cols-[380px_minmax(0,1fr)]">
        <PortfolioSidebar profile={portfolioProfile} sections={sections} />
        <main className="min-w-0 pb-20 lg:py-10">
          <MobileIntro profile={portfolioProfile} />
          {sections.map((sectionId) => {
            if (sectionId === "projects") return <ProjectsSection key={sectionId} projects={projects} />;
            if (sectionId === "experiences") return <ExperiencesSection key={sectionId} experiences={portfolio?.experiences ?? []} />;
            if (sectionId === "skills") return <SkillsSection key={sectionId} skills={skills} />;
            if (sectionId === "about") return <AboutSection key={sectionId} profile={portfolioProfile} />;
            if (sectionId === "custom-sections") return <CustomSectionsSection key={sectionId} sections={portfolio?.customSections ?? []} />;
            if (sectionId === "pages") return <PagesSection key={sectionId} pages={portfolio?.navigationPages ?? []} />;
            if (sectionId === "github") return portfolio?.github ? <GitHubSection key={sectionId} github={portfolio.github} /> : null;
            if (sectionId === "contact") return <ContactSection key={sectionId} profile={portfolioProfile} />;
            return null;
          })}
        </main>
      </div>
      <PortfolioFloatingMenu
        items={[
          { href: "#projetos", label: "Projetos" },
          { href: "/admin/resume-builder", label: "Curriculo" },
          { href: portfolioProfile.github, label: "GitHub", external: true },
          { href: portfolioProfile.linkedin, label: "LinkedIn", external: true },
          { href: portfolioProfile.instagram, label: "Instagram", external: true },
          { href: "#contato", label: "Contato" },
        ]}
      />
    </PublicShell>
  );
}

function PortfolioBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(217,70,239,0.16),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(167,139,250,0.12),transparent_30%),linear-gradient(180deg,var(--background),var(--background-subtle)_42%,var(--background))]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-accent/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.42))]" />
    </div>
  );
}

function PortfolioSidebar({ profile, sections }: { profile: PortfolioProfile; sections: string[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-0 flex h-dvh flex-col justify-between py-10">
        <MotionReveal className="flex flex-col gap-8" variant="slide-right">
          <Link className="flex items-center gap-3" href="/" aria-label="Ir para o inicio">
            <LogoMark />
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-foreground-muted">portfolio</span>
          </Link>

          <div>
            <p className="mb-4 inline-flex rounded-full border border-primary-accent/30 bg-primary-accent/10 px-3 py-1 text-xs text-primary-accent">
              Disponivel para projetos
            </p>
            <h1 className="max-w-xs text-balance text-5xl font-semibold leading-none tracking-[-0.035em]">
              {profile.name}
            </h1>
            <p className="mt-4 text-lg text-foreground-muted">{profile.headline}</p>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-7 text-muted-foreground">
              {profile.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="#projetos">Ver projetos</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin/resume-builder">Curriculo</Link>
            </Button>
          </div>

          <nav className="grid gap-3 text-sm text-muted-foreground" aria-label="Navegacao principal">
            {sections.map((section) => (
              <Link className="group flex items-center gap-3 transition-colors hover:text-foreground" href={`#${sectionToAnchor(section)}`} key={section}>
                <span className="h-px w-8 bg-border transition-all group-hover:w-12 group-hover:bg-primary-accent" />
                {sectionToLabel(section)}
              </Link>
            ))}
          </nav>
        </MotionReveal>

        <MotionReveal className="flex items-center justify-between gap-4" delay={0.1} variant="fade-in">
          <div className="flex gap-2">
            <SocialLink href={profile.github}>GH</SocialLink>
            <SocialLink href={profile.linkedin}>IN</SocialLink>
            <SocialLink href={profile.instagram}>IG</SocialLink>
          </div>
          <ThemeToggle />
        </MotionReveal>
      </div>
    </aside>
  );
}

function MobileIntro({ profile }: { profile: PortfolioProfile }) {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-surface/70 p-5 shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <LogoMark />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-foreground-muted">Kaesyo</span>
        </Link>
        <span className="rounded-full border border-primary-accent/30 px-3 py-1 text-[11px] text-primary-accent">online</span>
      </div>
      <MotionReveal className="mt-10" variant="scale-in">
        <h1 className="text-balance text-4xl font-semibold leading-none tracking-[-0.035em]">{profile.name}</h1>
        <p className="mt-3 text-base text-foreground-muted">{profile.headline}</p>
        <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground">{profile.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="#projetos">Ver projetos</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/resume-builder">Curriculo</Link>
          </Button>
        </div>
      </MotionReveal>
    </section>
  );
}

function ExperiencesSection({ experiences }: { experiences: ExperienceDto[] }) {
  if (!experiences.length) return null;

  return (
    <PortfolioSection eyebrow="Trajetoria" id="experiencias" title="Experiencias, estudos e marcos.">
      <div className="mt-8 grid gap-5">
        {experiences.map((experience) => (
          <MotionReveal className="relative border-l border-border/80 pl-6" key={experience.id}>
            <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary-accent shadow-[0_0_18px_rgba(217,70,239,0.7)]" />
            <article className="rounded-2xl border border-border/70 bg-surface/70 p-5 backdrop-blur transition-colors hover:border-primary-accent/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-accent">{experience.type}</p>
                {experience.startDate && <time className="text-xs text-foreground-subtle">{formatDate(experience.startDate)}</time>}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{experience.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{experience.organization}</p>
              {experience.description && <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground">{experience.description}</p>}
            </article>
          </MotionReveal>
        ))}
      </div>
    </PortfolioSection>
  );
}

function GitHubSection({ github }: { github: NonNullable<PublicPortfolioDto["github"]> }) {
  return (
    <PortfolioSection eyebrow="Open source" id="github" title="Codigo publico e atividade recente.">
      <MotionReveal className="mt-8">
        <StatGrid>
          <Stat label="Repositorios" value={github.publicRepositories.toString()} />
          <Stat label="Seguidores" value={github.followers.toString()} />
          <Stat href={github.profileUrl} label="Perfil" value={`@${github.username}`} />
        </StatGrid>
      </MotionReveal>
      <MotionStagger className="mt-6 grid gap-3 md:grid-cols-2">
        {github.repositories.map((repository) => (
          <MotionItem key={repository.id}>
            <MotionHoverCard className="h-full rounded-2xl border border-border/70 bg-surface/70 p-5 backdrop-blur transition-colors hover:border-primary-accent/40">
              <a className="font-medium hover:text-primary-accent" href={repository.url} rel="noreferrer" target="_blank">{repository.name}</a>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{repository.description || "Repositorio publico no GitHub."}</p>
              <p className="mt-4 text-xs text-foreground-subtle">{[repository.language, `${repository.stars} stars`, `${repository.forks} forks`].filter(Boolean).join(" · ")}</p>
            </MotionHoverCard>
          </MotionItem>
        ))}
      </MotionStagger>
      {github.activity.length > 0 && (
        <div className="mt-8 border-t border-border/80 pt-6">
          <h3 className="text-sm font-medium">Atividade recente</h3>
          <div className="mt-4 grid gap-2">
            {github.activity.slice(0, 5).map((activity) => (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground" key={activity.id}>
                <span>{activity.type.replace("Event", "")} em {activity.repository}</span>
                <time dateTime={activity.createdAt}>{new Date(activity.createdAt).toLocaleDateString("pt-BR")}</time>
              </div>
            ))}
          </div>
        </div>
      )}
    </PortfolioSection>
  );
}

function CustomSectionsSection({ sections }: { sections: PublicPortfolioDto["customSections"] }) {
  if (!sections.length) return null;

  return (
    <div id="conteudos">
      {sections.map((section) => (
        <PortfolioSection eyebrow="Conteudo" id={section.key} key={section.id} title={section.title}>
          <RichText className="block mt-6 max-w-3xl text-muted-foreground text-sm leading-7" value={section.content} />
        </PortfolioSection>
      ))}
    </div>
  );
}

function PagesSection({ pages }: { pages: NonNullable<PublicPortfolioDto["navigationPages"]> }) {
  if (!pages.length) return null;

  return (
    <PortfolioSection eyebrow="Paginas" id="pages" title="Conteudos complementares.">
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <Link className="rounded-2xl border border-border/70 bg-surface/70 p-5 transition-colors hover:border-primary-accent/40 hover:text-primary-accent" href={`/p/${page.slug}`} key={page.id}>
            {page.title}
          </Link>
        ))}
      </div>
    </PortfolioSection>
  );
}

function AboutSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <PortfolioSection eyebrow="Sobre" id="sobre" title="Um pouco mais sobre minha forma de construir.">
      <div className="mt-8 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <MotionReveal className="overflow-hidden rounded-2xl border border-border/80 bg-card aspect-[4/5]" variant="slide-right">
          <img alt="Foto do desenvolvedor" className="size-full object-cover" src={profile.avatarUrl} />
        </MotionReveal>
        <MotionReveal className="rounded-2xl border border-border/70 bg-surface/70 p-6 backdrop-blur" delay={0.06} variant="slide-left">
          <p className="text-pretty text-sm leading-7 text-muted-foreground">{profile.about}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <SocialLink href={profile.github}>GitHub</SocialLink>
            <SocialLink href={profile.linkedin}>LinkedIn</SocialLink>
            <SocialLink href={profile.instagram}>Instagram</SocialLink>
          </div>
        </MotionReveal>
      </div>
    </PortfolioSection>
  );
}

function SkillsSection({ skills }: { skills: Array<Pick<SkillDto, "title" | "startedAt" | "description">> }) {
  return (
    <PortfolioSection eyebrow="Stack" id="habilidades" title="Ferramentas que sustentam os projetos.">
      <MotionStagger className="mt-8 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <MotionItem key={skill.title}>
            <span className="group inline-flex rounded-full border border-border/80 bg-surface/70 px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary-accent/50 hover:text-foreground" title={skill.description}>
              {skill.title}
              <span className="ml-2 text-xs text-foreground-subtle">{skill.startedAt || "evolucao"}</span>
            </span>
          </MotionItem>
        ))}
      </MotionStagger>
    </PortfolioSection>
  );
}

function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const [featured, ...rest] = projects;

  return (
    <section id="projetos" className="scroll-mt-8 pt-6 lg:min-h-dvh lg:pt-0">
      <MotionReveal className="flex flex-col gap-3">
        <SectionEyebrow>Projetos selecionados</SectionEyebrow>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            Interfaces, sistemas e experimentos fullstack.
          </h2>
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            Uma selecao de trabalhos com foco em produto, UI e engenharia de software.
          </p>
        </div>
      </MotionReveal>

      {featured ? (
        <MotionReveal className="mt-10">
          <FeaturedProject index={0} project={featured} />
        </MotionReveal>
      ) : null}

      {rest.length ? (
        <MotionStagger className="mt-5">
          <Ledger>
            {rest.map((project, index) => (
              <MotionItem key={project.title}>
                <ProjectLedgerRow index={index + 1} project={project} />
              </MotionItem>
            ))}
          </Ledger>
        </MotionStagger>
      ) : null}
    </section>
  );
}

function FeaturedProject({ index, project }: { index: number; project: PortfolioProject }) {
  return (
    <MotionHoverCard>
      <FramedCard className="p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)] md:gap-5">
          <div className="min-h-56 overflow-hidden rounded-xl border border-foreground/10">
            <ProjectVisual coverPath={project.coverPath} featured index={index} title={project.title} />
          </div>
          <div className="flex flex-col justify-between gap-6 p-1 md:p-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-accent">
                Projeto 0{index + 1}
                {project.technologies[0] ? ` · ${project.technologies[0]}` : ""}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{project.title}</h3>
              <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground">{project.summary}</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                <ProjectLink project={project} />
                {project.id ? (
                  <ProjectLikeButton initialLikesCount={project.likesCount ?? 0} projectId={project.id} />
                ) : (
                  <span className="rounded-full border border-border/80 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                    0 curtidas
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </FramedCard>
    </MotionHoverCard>
  );
}

function ProjectLedgerRow({ index, project }: { index: number; project: PortfolioProject }) {
  const isExternal = Boolean(project.demoUrl);

  return (
    <LedgerRow>
      <Link
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:gap-6 md:px-6 md:py-5"
        href={project.demoUrl || "#contato"}
        rel={isExternal ? "noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        <span className="font-mono text-xs tabular-nums text-foreground-subtle transition-colors group-hover:text-primary-accent">
          0{index + 1}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2.5">
            <span className="min-w-0 truncate font-medium tracking-[-0.01em]">{project.title}</span>
            {project.technologies[0] ? (
              <span className="hidden shrink-0 rounded border border-primary-accent/25 bg-primary-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-primary-accent sm:inline-block">
                {project.technologies[0]}
              </span>
            ) : null}
          </span>
          {project.summary ? (
            <span className="mt-0.5 hidden truncate text-sm text-muted-foreground md:block">{project.summary}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-foreground-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-accent"
        >
          →
        </span>
      </Link>
    </LedgerRow>
  );
}

function ProjectLink({ project }: { project: PortfolioProject }) {
  const isExternal = Boolean(project.demoUrl);

  return (
    <Link
      className="group/link inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary-accent"
      href={project.demoUrl || "#contato"}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      Ver projeto{" "}
      <span aria-hidden="true" className="text-primary-accent transition-transform group-hover/link:translate-x-1">
        →
      </span>
    </Link>
  );
}

function ContactSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <MotionReveal
      id="contato"
      className="my-10 flex min-h-80 flex-col justify-center overflow-hidden rounded-[1.5rem] border border-primary-accent/30 bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,0.18),transparent_35%),var(--surface)] p-8 text-center backdrop-blur md:p-10"
      variant="scale-in"
    >
      <SectionEyebrow>Contato</SectionEyebrow>
      <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Vamos construir algo bem feito.</h2>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
        Se voce precisa de uma interface, sistema fullstack ou portfolio com experiencia cuidadosa, vamos conversar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <a href={profile.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
        </Button>
        <Button asChild variant="ghost">
          <a href={profile.github} rel="noreferrer" target="_blank">GitHub</a>
        </Button>
      </div>
    </MotionReveal>
  );
}

function PortfolioSection({ children, eyebrow, id, title }: { children: React.ReactNode; eyebrow: string; id: string; title: string }) {
  return (
    <section className="scroll-mt-8 py-12 md:py-16" id={id}>
      <MotionReveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
      </MotionReveal>
      {children}
    </section>
  );
}

function ProjectVisual({ coverPath, featured, index, title }: { coverPath?: string; featured: boolean; index: number; title: string }) {
  const coverUrl = resolveFileUrl(coverPath);

  if (coverUrl) {
    return <img alt={`Imagem de projeto ${title}`} className="min-h-72 size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" src={coverUrl} />;
  }

  return (
    <div className={featured ? "relative flex min-h-80 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(217,70,239,0.32),transparent_30%),linear-gradient(135deg,#0f1020,#17111f_48%,#2d1838)] p-8" : "relative flex min-h-64 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#101018,#17111f_52%,#24162d)] p-6"}>
      <ScrollParallax aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]" offset={featured ? 36 : 20} />
      <div className="relative flex aspect-video w-full max-w-md flex-col justify-between rounded-2xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur transition-transform duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="size-2 rounded-full bg-primary-accent" />
            <span className="size-2 rounded-full bg-zinc-500" />
            <span className="size-2 rounded-full bg-zinc-700" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">case 0{index + 1}</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">preview</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{title}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
      </div>
      <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{title}</h2>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-primary-accent">{children}</p>;
}

function SocialLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      className="inline-flex min-h-9 items-center justify-center rounded-full border border-border/80 bg-surface/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary-accent/60 hover:text-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-border/80 bg-background/60 px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-foreground-muted">{children}</span>;
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
    experiences: "experiencias",
    "custom-sections": "conteudos",
    pages: "pages",
    github: "github",
    contact: "contato",
  };

  return anchors[section] ?? section;
}

function sectionToLabel(section: string) {
  const labels: Record<string, string> = {
    about: "Sobre",
    skills: "Stack",
    projects: "Projetos",
    experiences: "Trajetoria",
    "custom-sections": "Conteudos",
    pages: "Paginas",
    github: "GitHub",
    contact: "Contato",
  };

  return labels[section] ?? section;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}
