import mongoose from "mongoose";
import { connectMongo } from "../src/infra/database/mongo.connection";
import { ensureAdminUser } from "../src/modules/auth/auth.service";
import { ExperienceModel } from "../src/modules/experiences/experiences.model";
import { CustomPageModel } from "../src/modules/pages/pages.model";
import { ProfileModel } from "../src/modules/profile/profile.model";
import { ProjectModel } from "../src/modules/projects/projects.model";
import { SkillModel } from "../src/modules/skills/skills.model";
import { ContentVersionModel } from "../src/modules/content-versions/content-versions.model";

const visibilityBoth = { portfolio: true, resume: true };
const visibilityPortfolio = { portfolio: true, resume: false };

const projectImagesBaseUrl =
  "https://raw.githubusercontent.com/KARAUJO1003/portifolio.web.1.4.0/03789996fcb7a97e52324d1747d8398f772056b7/portifolio/public";

const projectImages = {
  financeFire: `${projectImagesBaseUrl}/finance-bg.png`,
  portfolio: `${projectImagesBaseUrl}/portifolio-image01.png`,
  kanban: `${projectImagesBaseUrl}/kanban/ligth.png`,
  orgChart: `${projectImagesBaseUrl}/organograma/org-light.jpeg`,
  buzzy: `${projectImagesBaseUrl}/buzzy/banner-buzzy.jpg`,
  conversor: `${projectImagesBaseUrl}/conversor-app02.png`,
  renomeador: `${projectImagesBaseUrl}/rename-files/bannerLight2.jpeg.png`,
  tasks: `${projectImagesBaseUrl}/orion-tasks01.png`,
};

async function seed() {
  await connectMongo();
  const owner = await ensureAdminUser();

  if (!owner) {
    throw new Error("Admin user was not created.");
  }

  const ownerId = String(owner._id);

  await ProfileModel.findOneAndUpdate(
    { ownerId },
    {
      $set: {
        ownerId,
        name: "Kaesyo Felix da Silva Araujo",
        headline: "software developer",
        summary:
          "Profissional com boa comunicacao e bons conhecimentos em Next.js, React, TypeScript, Node.js, Tailwind, MongoDB, PostgreSQL e Prisma. Pretendo continuar me aprofundando nas principais tecnologias do desenvolvimento web, a fim de proporcionar uma experiencia para o usuario cada vez melhor, independentemente de ser no aspecto visual ou de usabilidade.",
        objective:
          "Busco uma oportunidade para aplicar minhas habilidades em desenvolvimento Full Stack em um ambiente desafiador, contribuindo para a criacao de solucoes web inovadoras e de alta qualidade.",
        location: "Acailandia, MA",
        address: "Rua 16; Q22; L49; Valle do Acai. Acailandia, MA. 65930-000",
        birthDate: "19/01/2003",
        driverLicense: "CNH Categoria A, B",
        email: "kaesyoa11@gmail.com",
        phone: "(94) 99125-7923",
        website: "https://portfolio.kaesyo.com",
        github: "https://github.com/KARAUJO1003",
        linkedin: "https://www.linkedin.com/in/ka%C3%A9syo-f%C3%A9lix-837345271/",
        avatarPath: "https://github.com/KARAUJO1003.png",
      },
    },
    { new: true, upsert: true },
  );

  const skills = [
    {
      title: "Next.js",
      category: "Frontend",
      startedAt: "03/2023",
      description:
        "Desenvolvimento web avancado com aplicacoes modernas, dinamicas e com boa experiencia de usuario.",
      icon: "nextjs",
      order: 1,
    },
    {
      title: "TypeScript",
      category: "Linguagem",
      startedAt: "05/2023",
      description:
        "Tipagem para criar interfaces, contratos e APIs mais consistentes durante a evolucao dos projetos.",
      icon: "typescript",
      order: 2,
    },
    {
      title: "Tailwind CSS",
      category: "UI",
      startedAt: "06/2023",
      description:
        "Estilizacao rapida, eficiente e responsiva para garantir aparencia consistente em diferentes telas.",
      icon: "tailwind",
      order: 3,
    },
    {
      title: "Shadcn UI / GSAP",
      category: "UI",
      startedAt: "07/2023",
      description:
        "Componentes e animacoes para adicionar detalhes que elevam a experiencia visual dos projetos.",
      icon: "ui",
      order: 4,
    },
    {
      title: "Motion React",
      category: "UI",
      startedAt: "07/2023",
      description:
        "Animacoes fluidas e interativas para tornar interfaces mais dinamicas e envolventes.",
      icon: "motion",
      order: 5,
    },
    {
      title: "React JS",
      category: "Frontend",
      startedAt: "02/2023",
      description:
        "Componentes reutilizaveis e composicao de interfaces para construir telas com mais produtividade.",
      icon: "react",
      order: 6,
    },
    {
      title: "MongoDB",
      category: "Banco de dados",
      startedAt: "02/2024",
      description:
        "Banco de dados usado em projetos fullstack, incluindo modelagem de dados para aplicacoes web.",
      icon: "mongodb",
      order: 7,
    },
    {
      title: "PostgreSQL",
      category: "Banco de dados",
      startedAt: "01/2024",
      description:
        "Banco relacional aplicado em projetos fullstack com regras e persistencia estruturada.",
      icon: "postgresql",
      order: 8,
    },
    {
      title: "React Hook Form & Zod",
      category: "Forms",
      startedAt: "01/2024",
      description:
        "Validacao de dados e formularios avancados com boa ergonomia para usuario e desenvolvedor.",
      icon: "forms",
      order: 9,
    },
    {
      title: "Node JS & Express",
      category: "Backend",
      startedAt: "01/2024",
      description:
        "Criacao de APIs REST, autenticacao, integracoes, uploads e regras de backend.",
      icon: "node",
      order: 10,
    },
    {
      title: "Figma",
      category: "Ferramentas",
      startedAt: "",
      description: "Prototipacao e apoio visual para interfaces e fluxos.",
      icon: "figma",
      order: 11,
    },
    {
      title: "Prisma",
      category: "Backend",
      startedAt: "",
      description: "ORM para modelagem de dados e integracao com bancos relacionais.",
      icon: "prisma",
      order: 12,
    },
    {
      title: "Insomnia / Postman",
      category: "Ferramentas",
      startedAt: "",
      description: "Teste e documentacao manual de APIs REST.",
      icon: "api",
      order: 13,
    },
    {
      title: "Git / GitHub",
      category: "Ferramentas",
      startedAt: "",
      description: "Versionamento de codigo e colaboracao em projetos.",
      icon: "git",
      order: 14,
    },
    {
      title: "NextAuth",
      category: "Backend",
      startedAt: "",
      description: "Autenticacao em aplicacoes Next.js.",
      icon: "auth",
      order: 15,
    },
    {
      title: "Proatividade",
      category: "Pessoal",
      startedAt: "",
      description: "Proatividade e iniciativa para resolucao de problemas.",
      icon: "soft-skill",
      order: 31,
    },
    {
      title: "Criatividade",
      category: "Pessoal",
      startedAt: "",
      description: "Criatividade para propor novas ideias.",
      icon: "soft-skill",
      order: 32,
    },
    {
      title: "Aprendizado continuo",
      category: "Pessoal",
      startedAt: "",
      description: "Disposicao para aprendizado e aprimoramento continuo.",
      icon: "soft-skill",
      order: 33,
    },
  ];

  for (const skill of skills) {
    await SkillModel.findOneAndUpdate(
      { ownerId, title: skill.title },
      { $set: { ...skill, ownerId, visibility: visibilityBoth } },
      { new: true, upsert: true },
    );
  }

  const projects = [
    {
      title: "Finance Fire",
      slug: "finance-fire",
      summary:
        "Aplicativo fullstack de gestao financeira com Next.js, MongoDB, TailwindCSS, Shadcn UI, Recharts, TypeScript, Zod e React Hook Form.",
      description:
        "Projeto pessoal fullstack pensado para ser uma experiencia de gestao financeira intuitiva, visual e completa.",
      coverPath: projectImages.financeFire,
      demoUrl: "https://finance-fire.vercel.app",
      repoUrl: "",
      technologies: ["next.js", "mongodb", "server actions", "tailwindcss"],
      featured: true,
      order: 1,
    },
    {
      title: "Portfolio 1.4.0",
      slug: "portfolio-1-4-0",
      summary:
        "Versao atual do portfolio criada para apresentar habilidades, projetos e formas de contato.",
      description:
        "Site desenvolvido para mostrar trajetoria, habilidades e projetos em uma experiencia dark/dev.",
      coverPath: projectImages.portfolio,
      demoUrl: "https://portfolio.kaesyo.com",
      repoUrl: "",
      technologies: ["next.js", "tailwind.css"],
      featured: true,
      order: 2,
    },
    {
      title: "Kanban Board",
      slug: "kanban-board",
      summary:
        "Projeto de estudo sobre drag and drop, Tailwind CSS, Shadcn UI e animacoes.",
      description:
        "Board responsivo para estudo de interacoes, organizacao de tarefas e componentes reutilizaveis.",
      coverPath: projectImages.kanban,
      demoUrl: "",
      repoUrl: "",
      technologies: ["next.js", "tailwind.css", "shadcn-ui"],
      featured: false,
      order: 3,
    },
    {
      title: "Componente Organograma",
      slug: "componente-organograma",
      summary:
        "Componente para visualizar organogramas, cargos e funcionarios com interface simples e intuitiva.",
      description:
        "Projeto com Next.js, TailwindCSS, TypeScript e React DnD para reordenacao por arrastar e soltar.",
      coverPath: projectImages.orgChart,
      demoUrl: "",
      repoUrl: "",
      technologies: ["next.js", "tailwind.css", "react-dnd"],
      featured: false,
      order: 4,
    },
    {
      title: "Buzzy Demarcacoes",
      slug: "buzzy-demarcacoes",
      summary:
        "Sistema de agendamento de demarcacoes para otimizar a visualizacao de dados internos.",
      description:
        "Sistema criado para substituir fluxos manuais de planilhas por uma interface de consulta e acompanhamento.",
      coverPath: projectImages.buzzy,
      demoUrl: "",
      repoUrl: "",
      technologies: ["next.js", "tailwind.css"],
      featured: false,
      order: 5,
    },
    {
      title: "Conversor para extenso",
      slug: "conversor-para-extenso",
      summary:
        "Conversor de numeros por extenso com mascaras de input e formatos de resultado.",
      description:
        "Aplicacao React com foco em uma tela simples, direta e eficiente para conversao de valores.",
      coverPath: projectImages.conversor,
      demoUrl: "",
      repoUrl: "",
      technologies: ["react.js", "mascaras de input"],
      featured: false,
      order: 6,
    },
    {
      title: "Formatar nome de arquivos",
      slug: "formatar-nome-de-arquivos",
      summary:
        "Ferramenta para padronizar nomenclatura de arquivos com validacoes e dicas de uso.",
      description:
        "Projeto criado para resolver um problema operacional e manter padroes de nomes de arquivos.",
      coverPath: projectImages.renomeador,
      demoUrl: "",
      repoUrl: "",
      technologies: ["tailwind-css", "shadcn-ui"],
      featured: false,
      order: 7,
    },
    {
      title: "Lista de tarefas",
      slug: "lista-de-tarefas",
      summary: "Todo list responsivo com modos dark e light.",
      description:
        "Aplicacao simples criada com HTML, CSS e JavaScript para estudo de interacoes basicas.",
      coverPath: projectImages.tasks,
      demoUrl: "",
      repoUrl: "",
      technologies: ["html", "css", "javascript"],
      featured: false,
      order: 8,
    },
  ];

  for (const project of projects) {
    await ProjectModel.findOneAndUpdate(
      { ownerId, slug: project.slug },
      {
        $set: {
          ...project,
          ownerId,
          status: "published",
          visibility: project.featured ? visibilityBoth : visibilityPortfolio,
        },
        $setOnInsert: { likesCount: 0 },
      },
      { new: true, upsert: true },
    );
  }

  const certifications = [
    "HTML e CSS avancado",
    "Next JS do zero ao avancado (Matheus Fraga)",
    "Next.js e React (Leonardo Moura, Cod3r Cursos)",
    "Node JS do zero a maestria (Matheus Battisti)",
    "Node.js (Rocketseat)",
    "React Js (Rocketseat)",
    "React Native (Rocketseat)",
    "React Native criando aplicativos do zero ao avancado (Matheus Fraga)",
    "Projeto completo com Node, Next, React, React Native (Matheus Fraga)",
    "Fundamentos a Logica da Programacao",
    "Operador de Caixa",
    "RH e Secretariado",
    "Auxiliar Administrativo",
    "AutoCad 2D",
    "Gestao da Producao",
  ];

  const experiences = [
    {
      type: "work",
      title: "Auxiliar de Producao",
      organization: "L Rocha Macedo",
      location: "Presencial",
      startDate: "10/2021",
      endDate: "12/2022",
      current: false,
      description: "",
      url: "",
      order: 1,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "work",
      title: "Auxiliar Administrativo",
      organization: "Valle do Acai Empreendimentos Imobiliarios",
      location: "Presencial",
      startDate: "01/2023",
      endDate: "",
      current: true,
      description: "",
      url: "",
      order: 2,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "education",
      title: "Ensino Medio Completo",
      organization: "Joviana Silva Farias",
      location: "Acailandia, MA",
      startDate: "",
      endDate: "12/2021",
      current: false,
      description: "",
      url: "",
      order: 11,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "education",
      title: "Engenharia de Software",
      organization: "Estacio",
      location: "Acailandia, MA",
      startDate: "02/2023",
      endDate: "",
      current: true,
      description:
        "Formacao voltada para fundamentos de engenharia, arquitetura, desenvolvimento web e construcao de produtos digitais.",
      url: "",
      order: 12,
      visibility: visibilityBoth,
    },
    {
      type: "link",
      title: "Aprimoramento de ferramentas de trabalho",
      organization: "Conquista",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "Sempre buscando conhecer melhor as ferramentas disponibilizadas para tirar o melhor proveito delas diante das circunstancias atribuidas.",
      url: "",
      order: 21,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "link",
      title: "Projetos com Next.js",
      organization: "Conquista",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "Desenvolvi projetos principais com Next.js com intuito de aprendizado e refatoracao conforme aumento meu nivel de conhecimento, incluindo solucao para agendamento de demarcacoes.",
      url: "",
      order: 22,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "link",
      title: "Estudos em APIs REST e arquitetura",
      organization: "Conquista",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "Tenho buscado aprendizado na criacao de APIs REST com Node.js e TypeScript, versionamento com Git/GitHub, principios de arquitetura limpa, codigo limpo e SOLID.",
      url: "",
      order: 23,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "link",
      title: "Interesse em backend tipado",
      organization: "Conquista",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "Tenho interesse em aprender tecnologias fortemente tipadas como Python, Java, C#, .NET e aprofundar conhecimentos de backend.",
      url: "",
      order: 24,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "link",
      title: "Foco em Front-End responsivo",
      organization: "Conquista",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "No Front-End busco criar aplicacoes responsivas, com Tailwind CSS, bibliotecas de UI como Shadcn UI, Material UI e Radix, e interfaces acessiveis e agradaveis.",
      url: "",
      order: 25,
      visibility: { portfolio: false, resume: true },
    },
    {
      type: "link",
      title: "Portfolio atual",
      organization: "Kaesyo Felix",
      location: "",
      startDate: "2024",
      endDate: "",
      current: true,
      description:
        "Referencia visual inicial usada para migrar conteudo e evoluir a nova plataforma de portfolio/admin.",
      url: "https://portfolio.kaesyo.com",
      order: 30,
      visibility: visibilityPortfolio,
    },
    ...certifications.map((title, index) => ({
      type: "certification",
      title,
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      url: "",
      order: 40 + index,
      visibility: { portfolio: false, resume: true },
    })),
  ];

  for (const experience of experiences) {
    await ExperienceModel.findOneAndUpdate(
      { ownerId, title: experience.title, type: experience.type },
      { $set: { ...experience, ownerId } },
      { new: true, upsert: true },
    );
  }

  await CustomPageModel.findOneAndUpdate(
    { ownerId, slug: "sobre-este-portfolio" },
    {
      $set: {
        ownerId,
        title: "Sobre este portfolio",
        slug: "sobre-este-portfolio",
        excerpt: "Contexto da nova plataforma integrada de portfolio e curriculo.",
        content:
          "Este portfolio esta sendo reconstruido como uma plataforma administravel, integrada a um builder de curriculo, controle de publicacao, uploads, curtidas anonimas e futura integracao com GitHub.",
        status: "published",
        order: 1,
        showInNavigation: true,
      },
    },
    { new: true, upsert: true },
  );

  const portfolioSections = [
    versionSection("hero", "Hero", 0),
    versionSection("about", "Sobre", 1),
    versionSection("skills", "Habilidades", 2),
    versionSection("projects", "Projetos", 3),
    versionSection("experiences", "Experiencias", 4),
    versionSection("custom-sections", "Secoes customizadas", 5),
    versionSection("pages", "Paginas", 6),
    versionSection("github", "GitHub", 7),
    versionSection("contact", "Contato", 8),
  ];
  const resumeSections = [
    versionSection("profile", "Dados pessoais", 0),
    versionSection("summary", "Resumo profissional", 1),
    versionSection("work", "Historico profissional", 2),
    versionSection("skills", "Competencias", 3),
    versionSection("achievements", "Conquistas e distincoes", 4),
    versionSection("certifications", "Certificacoes", 5),
    versionSection("education", "Formacao academica", 6),
    versionSection("projects", "Projetos", 7, false),
    versionSection("custom-sections", "Secoes customizadas", 8, false),
    versionSection("objective", "Objetivo", 9),
  ];

  await ContentVersionModel.updateMany({ ownerId, kind: "portfolio", status: "published" }, { $set: { status: "archived" } });
  await ContentVersionModel.findOneAndUpdate(
    { ownerId, kind: "portfolio", slug: "principal" },
    { $set: { ownerId, kind: "portfolio", name: "Portfolio principal", template: "default", status: "published", sections: portfolioSections, publishedAt: new Date() } },
    { new: true, upsert: true },
  );
  await ContentVersionModel.updateMany({ ownerId, kind: "resume", status: "published" }, { $set: { status: "archived" } });
  await ContentVersionModel.findOneAndUpdate(
    { ownerId, kind: "resume", slug: "principal" },
    { $set: { ownerId, kind: "resume", name: "Curriculo principal", template: "classic-ats", status: "published", sections: resumeSections, publishedAt: new Date() } },
    { new: true, upsert: true },
  );

  console.log("[seed] initial portfolio data created/updated");
  console.log(`[seed] ownerId=${ownerId}`);
}

function versionSection(id: string, label: string, order: number, enabled = true) {
  return { id, label, order, enabled, selectionMode: "all", itemIds: [] };
}

seed()
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
