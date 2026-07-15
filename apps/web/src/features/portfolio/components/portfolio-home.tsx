import {
  MotionHoverCard,
  MotionItem,
  MotionReveal,
  MotionStagger,
  ScrollParallax,
} from "@/components/ds/motion";
import { RichText } from "@/components/ds/rich-text";
import { ThemeToggle } from "@/components/ds/theme-toggle";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { resolveFileUrl } from "@/core/files/file-url";
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

export function PortfolioHome({ portfolio }: PortfolioHomeProps) {
  const profile = portfolio?.profile;
  const hasPublishedVersion = Boolean(portfolio?.version);
  const skills = hasPublishedVersion ? portfolio?.skills ?? [] : portfolio?.skills?.length ? portfolio.skills : fallbackSkills;
  const projects = hasPublishedVersion ? portfolio?.projects ?? [] : portfolio?.projects?.length ? portfolio.projects : fallbackProjects;
  const avatarUrl = resolveFileUrl(profile?.avatarPath) || fallbackProfile.avatar;
  const githubUrl = profile?.github || fallbackProfile.github;
  const linkedinUrl = profile?.linkedin || fallbackProfile.linkedin;
  const sections = portfolio?.version?.sections?.length
    ? portfolio.version.sections.filter((section) => section.enabled).sort((a, b) => a.order - b.order).map((section) => section.id)
    : ["hero", "about", "skills", "projects", "experiences", "custom-sections", "pages", "github", "contact"];

  return (
    <PublicShell>
      <PortfolioNav pages={portfolio?.navigationPages ?? []} sections={sections} />
      {sections.map((sectionId) => {
        if (sectionId === "hero") return <HeroSection key={sectionId} headline={profile?.headline || fallbackProfile.headline} summary={profile?.summary || fallbackProfile.summary} />;
        if (sectionId === "about") return <AboutSection key={sectionId} avatarUrl={avatarUrl} githubUrl={githubUrl} linkedinUrl={linkedinUrl} summary={profile?.summary || fallbackProfile.about} />;
        if (sectionId === "skills") return <SkillsSection key={sectionId} skills={skills} />;
        if (sectionId === "projects") return <ProjectsSection key={sectionId} projects={projects} />;
        if (sectionId === "experiences") return <ExperiencesSection key={sectionId} experiences={portfolio?.experiences ?? []} />;
        if (sectionId === "custom-sections") return <CustomSectionsSection key={sectionId} sections={portfolio?.customSections ?? []} />;
        if (sectionId === "github") return portfolio?.github ? <GitHubSection key={sectionId} github={portfolio.github} /> : null;
        if (sectionId === "contact") return <ContactSection key={sectionId} githubUrl={githubUrl} linkedinUrl={linkedinUrl} />;
        return null;
      })}
    </PublicShell>
  );
}

function PortfolioNav({ pages, sections }: { pages: NonNullable<PublicPortfolioDto["navigationPages"]>; sections: string[] }) {
  const visible = new Set(sections);
  return (
    <header className="top-0 z-40 sticky bg-background/80 backdrop-blur-md -mx-4 px-4 border-border border-b">
      <div className="flex justify-between items-center gap-6 mx-auto max-w-5xl min-h-16">
        <Link className="flex items-center gap-3" href="/">
          <LogoMark />
          <span className="hidden sm:inline font-medium text-foreground text-sm uppercase">kaesyo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-muted-foreground text-xs uppercase">
          {visible.has("hero") && <Link className="hover:text-foreground" href="#home">
            Inicio
          </Link>}
          {visible.has("about") && <Link className="hover:text-foreground" href="#sobre">
            Sobre
          </Link>}
          {visible.has("skills") && <Link className="hover:text-foreground" href="#habilidades">
            Habilidades
          </Link>}
          {visible.has("projects") && <Link className="hover:text-foreground" href="#projetos">
            Projetos
          </Link>}
          {visible.has("github") && <Link className="hover:text-foreground" href="#github">GitHub</Link>}
          {visible.has("contact") && <Link className="hover:text-foreground" href="#contato">
            Contato
          </Link>}
          {visible.has("pages") && pages.map((page) => (
            <Link key={page.id} className="hover:text-foreground" href={`/p/${page.slug}`}>
              {page.title}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <Button asChild>
          <Link href="#projetos">Projetos</Link>
        </Button>
      </div>
    </header>
  );
}

function ExperiencesSection({ experiences }: { experiences: ExperienceDto[] }) {
  if (!experiences.length) return null;

  return (
    <MotionReveal className="mx-auto py-20 w-full max-w-5xl" id="experiencias">
      <SectionHeading eyebrow="Trajetoria" title="Experiencias" />
      <MotionStagger className="gap-px grid md:grid-cols-2 mt-10 bg-border border border-border rounded-md overflow-hidden">
        {experiences.map((experience) => (
          <MotionItem key={experience.id}>
            <article className="bg-background p-6 h-full">
              <p className="text-primary-accent text-xs uppercase">{experience.type}</p>
              <h3 className="mt-3 font-medium text-lg">{experience.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{experience.organization}</p>
              {experience.description && <p className="mt-4 text-muted-foreground text-sm leading-6">{experience.description}</p>}
            </article>
          </MotionItem>
        ))}
      </MotionStagger>
    </MotionReveal>
  );
}

function GitHubSection({ github }: { github: NonNullable<PublicPortfolioDto["github"]> }) {
  return (
    <MotionReveal className="mx-auto py-20 w-full max-w-5xl" id="github">
      <SectionHeading eyebrow="Open source" title="GitHub" />
      <div className="flex flex-wrap gap-5 mt-6 text-muted-foreground text-sm">
        <span>{github.publicRepositories} repositorios</span>
        <span>{github.followers} seguidores</span>
        <a className="text-primary-accent hover:text-foreground" href={github.profileUrl} rel="noreferrer" target="_blank">@{github.username}</a>
      </div>
      <MotionStagger className="gap-3 grid md:grid-cols-2 mt-10">
        {github.repositories.map((repository) => (
          <MotionItem key={repository.id}>
            <MotionHoverCard className="bg-surface p-5 border border-border rounded-md h-full">
              <a className="font-medium hover:text-primary-accent" href={repository.url} rel="noreferrer" target="_blank">{repository.name}</a>
              <p className="mt-3 text-muted-foreground text-sm leading-6">{repository.description || "Repositorio publico no GitHub."}</p>
              <p className="mt-4 text-foreground-subtle text-xs">{[repository.language, `${repository.stars} stars`, `${repository.forks} forks`].filter(Boolean).join(" · ")}</p>
            </MotionHoverCard>
          </MotionItem>
        ))}
      </MotionStagger>
      {github.activity.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
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
    </MotionReveal>
  );
}

function CustomSectionsSection({ sections }: { sections: PublicPortfolioDto["customSections"] }) {
  if (!sections.length) return null;
  return <>{sections.map((section) => <MotionReveal className="mx-auto py-16 w-full max-w-5xl" id={section.key} key={section.id}><SectionHeading eyebrow="Conteudo" title={section.title} /><RichText className="block mt-6 max-w-3xl text-muted-foreground text-sm leading-7" value={section.content} /></MotionReveal>)}</>;
}

function HeroSection({ headline, summary }: { headline: string; summary: string }) {
  const [firstLine, secondLine] = splitHeadline(headline);

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center items-center py-24 min-h-[620px] overflow-hidden text-center"
    >
      <ScrollParallax
        aria-hidden="true"
        className="-z-10 absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(420px_circle_at_center,black,transparent)]"
        offset={72}
      />

      <MotionReveal className="flex flex-col items-center" variant="scale-in">
        <p className="mb-5 font-medium text-muted-foreground text-xs uppercase">software</p>
        <h1 className="bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-500 max-w-3xl font-black text-transparent text-6xl md:text-8xl">
          {firstLine}
          <br />
          {secondLine}
        </h1>
        <p className="mt-6 max-w-sm text-muted-foreground text-sm leading-6">
          {summary}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button asChild>
            <Link href="/admin/resume-builder">Meu Curriculo</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#projetos">Ver projetos</Link>
          </Button>
        </div>
      </MotionReveal>
    </section>
  );
}

function AboutSection({
  avatarUrl,
  githubUrl,
  linkedinUrl,
  summary,
}: {
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  summary: string;
}) {
  return (
    <section id="sobre" className="items-center gap-10 grid md:grid-cols-[360px_1fr] py-20 min-h-[720px]">
      <MotionReveal className="flex flex-col gap-4" variant="slide-right">
        <div className="relative bg-card border border-border rounded-2xl aspect-[4/5] overflow-hidden">
          <img alt="Foto do desenvolvedor" className="size-full object-cover" src={avatarUrl} />
        </div>
        <div className="gap-2 grid grid-cols-3 bg-card p-1 border border-border rounded-2xl">
          <SocialLink href={fallbackProfile.instagram}>Instagram</SocialLink>
          <SocialLink href={githubUrl}>Github</SocialLink>
          <SocialLink href={linkedinUrl}>Linkedin</SocialLink>
        </div>
      </MotionReveal>

      <MotionReveal className="flex flex-col gap-6" delay={0.08} variant="slide-left">
        <SectionEyebrow>Sobre</SectionEyebrow>
        <h2 className="bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-500 max-w-xl font-bold text-transparent text-4xl">
          Conheca um pouco mais sobre mim.
        </h2>
        <p className="max-w-xl text-muted-foreground text-sm leading-7">{summary}</p>
      </MotionReveal>
    </section>
  );
}

function SkillsSection({ skills }: { skills: Array<Pick<SkillDto, "title" | "startedAt" | "description">> }) {
  return (
    <section id="habilidades" className="py-20">
      <MotionReveal>
        <SectionHeading eyebrow="Stack" title="Habilidades" />
      </MotionReveal>
      <MotionStagger className="gap-4 grid sm:grid-cols-2 mt-10">
        {skills.map((skill) => (
          <MotionItem key={skill.title}>
            <MotionHoverCard>
              <article className="group bg-card p-5 border border-border hover:border-zinc-500 rounded-2xl min-h-48 transition-colors">
                <p className="text-muted-foreground text-xs">{skill.startedAt || "em evolucao"}</p>
                <h3 className="mt-4 font-semibold text-xl">{skill.title}</h3>
                <p className="mt-4 text-muted-foreground text-sm leading-6">{skill.description}</p>
              </article>
            </MotionHoverCard>
          </MotionItem>
        ))}
      </MotionStagger>
    </section>
  );
}

function ProjectsSection({
  projects,
}: {
  projects: Array<
    Pick<ProjectDto, "title" | "summary" | "technologies"> &
    Partial<Pick<ProjectDto, "id" | "coverPath" | "demoUrl" | "likesCount">>
  >;
}) {
  return (
    <section id="projetos" className="py-20">
      <MotionReveal>
        <SectionHeading eyebrow="Portfolio" title="Projetos" />
      </MotionReveal>
      <MotionStagger className="gap-6 grid mt-10">
        {projects.map((project, index) => (
          <MotionItem key={project.title}>
            <MotionHoverCard>
              <article className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] bg-card border border-border rounded-2xl overflow-hidden">
                <ProjectVisual coverPath={project.coverPath} index={index} title={project.title} />
                <div className="flex flex-col justify-between gap-8 p-6">
                  <div>
                    <h3 className="font-semibold text-2xl">{project.title}</h3>
                    <p className="mt-4 text-muted-foreground text-sm leading-7">{project.summary}</p>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="bg-background px-2 py-1 border border-border rounded-md text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <Link
                        className="font-medium text-sm underline underline-offset-4"
                        href={project.demoUrl || "#contato"}
                        rel={project.demoUrl ? "noreferrer" : undefined}
                        target={project.demoUrl ? "_blank" : undefined}
                      >
                        ver projeto
                      </Link>
                      {project.id ? (
                        <ProjectLikeButton
                          initialLikesCount={project.likesCount ?? 0}
                          projectId={project.id}
                        />
                      ) : (
                        <span className="bg-background px-3 py-2 border border-border rounded-md text-muted-foreground text-xs">
                          0 curtidas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </MotionHoverCard>
          </MotionItem>
        ))}
      </MotionStagger>
    </section>
  );
}

function ContactSection({ githubUrl, linkedinUrl }: { githubUrl: string; linkedinUrl: string }) {
  return (
    <MotionReveal
      id="contato"
      className="flex flex-col justify-center items-center bg-card my-20 p-8 border border-border rounded-2xl min-h-80 text-center"
      variant="scale-in"
    >
      <SectionEyebrow>Contato</SectionEyebrow>
      <h2 className="mt-4 max-w-2xl font-bold text-4xl">Vamos construir algo bem feito.</h2>
      <p className="mt-5 max-w-xl text-muted-foreground text-sm leading-7">
        Pronto para desbloquear o potencial do seu proximo projeto? Vamos nos conectar.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Button asChild>
          <a href={githubUrl} target="_blank">
            Github
          </a>
        </Button>
        <Button asChild variant="ghost">
          <a href={linkedinUrl} target="_blank">
            Linkedin
          </a>
        </Button>
      </div>
    </MotionReveal>
  );
}

function ProjectVisual({ coverPath, index, title }: { coverPath?: string; index: number; title: string }) {
  const coverUrl = resolveFileUrl(coverPath);

  if (coverUrl) {
    return <img alt={`Imagem de projeto ${title}`} className="min-h-72 size-full object-cover" src={coverUrl} />;
  }

  return (
    <div className="flex justify-center items-center bg-[linear-gradient(135deg,#111827,#18181b_45%,#3f1d2f)] p-8 min-h-72">
      <div className="flex flex-col justify-between bg-black/30 shadow-2xl p-5 border border-white/10 rounded-xl w-full max-w-md aspect-video">
        <div className="flex gap-2">
          <span className="bg-zinc-500 rounded-full size-2" />
          <span className="bg-zinc-600 rounded-full size-2" />
          <span className="bg-zinc-700 rounded-full size-2" />
        </div>
        <div>
          <p className="text-zinc-400 text-xs uppercase">project 0{index + 1}</p>
          <p className="mt-2 font-semibold text-2xl">{title}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2 className="font-bold text-4xl">{title}</h2>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-medium text-muted-foreground text-xs uppercase">{children}</p>;
}

function SocialLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      className="flex justify-center items-center hover:bg-muted px-2 rounded-xl min-h-10 text-muted-foreground hover:text-foreground text-xs uppercase"
      href={href}
      target="_blank"
    >
      {children}
    </a>
  );
}

function LogoMark() {
  return (
    <svg aria-hidden="true" className="size-5 text-foreground" fill="none" viewBox="0 0 37 32">
      <path
        className="fill-current"
        d="M14.7266 0.590907L6.28906 31.9375H0.306108L8.74361 0.590907H14.7266ZM17.9034 20.4318V14.2955L36.9261 6.67614V13.1193L24.8068 17.3125L25.0114 17.0057V17.7216L24.8068 17.4148L36.9261 21.608V28.0511L17.9034 20.4318Z"
      />
    </svg>
  );
}

function splitHeadline(headline: string) {
  const normalized = headline.trim();
  const parts = normalized.split(" ");

  if (parts.length <= 1) {
    return ["software", normalized || "developer"];
  }

  return [parts.slice(0, -1).join(" "), parts.at(-1) ?? "developer"];
}
