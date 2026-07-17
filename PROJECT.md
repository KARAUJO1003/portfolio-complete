# Portfolio/Admin Integrado

## Resumo

Este projeto sera um monorepo para um portfolio pessoal administravel, integrado a um builder de curriculo. O objetivo e permitir editar dados uma vez, escolher onde cada informacao aparece, publicar alteracoes imediatamente e gerar curriculos em PDF compativeis com ATS/leitura por IA.

O projeto deve ser construido por partes testaveis, mantendo este arquivo como fonte principal de retomada quando o contexto da conversa estourar.

## Referencia Do Portfolio Atual

Site atual: https://portfolio.kaesyo.com

Esta referencia deve orientar o primeiro design publico e a migracao inicial de conteudo. O site atual usa uma identidade dark/dev com:

- navegacao `Inicio`, `Sobre`, `Habilidades`, `Projetos`, `Contato`;
- hero com destaque `software developer`;
- copy principal `Welcome to the Dark Side of Coding! celebrating the elegance of dark mode.`;
- CTA para curriculo;
- links sociais para Instagram, GitHub e LinkedIn;
- secao "Sobre" com resumo pessoal;
- secao "Habilidades" com cards contendo nome, data e descricao;
- secao "Projetos" com cards visuais, tags de tecnologias e CTA `ver projeto`;
- secao "Contato" com chamada para WhatsApp/redes sociais.

O novo projeto pode evoluir o design, mas deve preservar esse conteudo como base inicial e manter o modo dark como padrao.

## Escopo Geral Do Produto

Status: `pending`, `in-progress`, `done`.

| Funcionalidade | Status | Observacoes |
| --- | --- | --- |
| Documentacao base do projeto | done | `PROJECT.md`, `AGENTS.md`, `docs/*` e skills locais |
| Scaffold inicial do monorepo | done | Estrutura de `apps/`, `packages/`, `docs/`, `.agents/`, `storage/` |
| Portfolio publico dinamico | done | Renderiza a versao publicada, ordem, secoes, itens, GitHub e conteudo customizado |
| Admin com login por credenciais | done | Login, cookie, me, logout, redirect e guards validados; bypass permanece disponivel por env |
| Perfil editavel | done | CRUD com dados pessoais, contatos, objetivo, Markdown simples e upload de avatar |
| Projetos editaveis | done | CRUD, capa por upload, visibilidade, status, tags e curtidas |
| Skills editaveis | done | CRUD com categoria, data, ordem e visibilidade |
| Experiencias, formacao, certificacoes e links | done | CRUD unificado consumido por portfolio e curriculo |
| Paginas publicas customizadas | done | CRUD, navegacao e rota publica por slug |
| Seed inicial com dados do portfolio atual | done | `pnpm api seed:initial` popula perfil, skills, projetos, experiencias e pagina publica |
| Secoes customizadas | done | CRUD livre com Markdown simples e destino portfolio/curriculo |
| Multiplas versoes de portfolio | done | Rascunho, publicada, arquivada e troca da versao ativa |
| Multiplas versoes de curriculo | done | Versoes independentes com template e selecao de conteudo |
| Controle de exibicao por item/secao | done | Ordem, secao ativa, todos os itens ou selecao explicita por versao |
| Builder de curriculo | done | Salva/publica versoes, preview, selecao granular e download |
| Builder de portfolio | done | Salva/publica versoes e reflete imediatamente na landing |
| PDF de curriculo no backend | done | PDF usa a versao escolhida e preserva texto selecionavel |
| Templates PDF ATS-friendly | done | `classic-ats` e `compact-ats` funcionais |
| Upload local com Multer/fs | done | Integrado ao avatar e capa, banco/front usam path relativo |
| Curtidas anonimas em projetos | done | Toggle curtir/descurtir com hash, contador e estado otimista |
| Toggle de curtida estilo Instagram | done | Curtir/descurtir com mesmo botao, contador sincronizado e microinteracao com Motion |
| Integracao GitHub inicial | done | Perfil, repositorios, estatisticas e atividade com cache e token opcional |
| Estrutura preparada para i18n futuro | done | Locale e mensagens centralizados em `core/i18n`; MVP permanece pt-BR |
| Dark mode padrao, light mode possivel | done | ThemeProvider e toggle no admin e portfolio |
| Design system flexivel | in-progress | `components/ui` base, `components/ds` extensoes; portfolio publico agora usa composicao premium sem mexer em `components/ui` |
| Design system premium documentado | in-progress | `DESIGN.md`, `docs/design-system.md`, tokens premium e MCPs/skills de design adicionados |
| Motion for React | done | Dependencia `motion` instalada no front e usada no toggle de curtida |
| Sistema de animacoes premium | in-progress | `components/ds/motion`, scroll progress, reveal/stagger/hover variants, scroll-trigger reversivel, stacks animados, sticky stack, menu flutuante mobile e docs |
| MCPs/skills de design | done | Coss, Coss Particles e Impeccable instalados; configs locais MCP criadas; ReUI adicionado em `.mcp.json`/`.cursor`/`.vscode` como referencia visual do admin, pendente de autenticacao do usuario |
| Vitrine do design system | in-progress | `/admin/design-system` cobre tokens, componentes base, Admin UX, tabelas, metricas, estados e dialogs; faltam tipografia, layout, upload, builders, permissoes e feature flags |
| Roadmap admin UX/forms/tables/builders | done | Plano em `docs/admin-ux-roadmap.md` e skill local `admin-ux-system` |
| Primitivos de UI (Base UI) | in-progress | Base UI escolhido como primitivo padrao (nao Radix); decisao e regras em `docs/ui-primitives.md`. Radix remanescente so via `vaul` (drawer do portfolio publico) |
| Redesign do admin e login | in-progress | AdminShell com navegacao superior agrupada, login redesenhado e `ConfirmDialog` criado; agora tambem usado de verdade antes de excluir em todas as tabelas (ver hardening). Ainda falta aplicar refinamento fino em todas as telas |
| Sistema avancado de formularios admin | in-progress | `projects` continua sendo o piloto completo (steps, preview, aside); `skills`, `experiences`, `pages`, `profile` e `custom-sections` migrados para `DsForm`/`FormSection`/`FormFields` no padrao basico, sem preview/steps. `custom-sections` ganhou form dedicado com React Hook Form (antes era `useState` puro). Tiptap/autocomplete ficam para fase seguinte |
| Tabelas admin padronizadas | in-progress | `DataTableFrame` criado e piloto em projetos com busca, filtro e ordenacao; falta replicar nos demais CRUDs. Hardening (2026-07-17): `ConfirmDialog` antes de excluir e `ErrorState` em erro de listagem em todas as tabelas; skeleton real de loading (`DataTable` ganhou prop `isLoading`); corrigido `overflow-hidden` que cortava a coluna Acoes no mobile (agora `overflow-x-auto`); foco visivel padronizado em Input/Textarea/selects nativos |
| Builders com preview real e drag and drop | in-progress | Preview real ja existia; reorder de secoes usa `@dnd-kit` via `BuilderSortableList`. Reorder de itens dentro de uma secao adicionado via `BuilderSectionItemsPicker`; corrigido bug onde a ordem de `itemIds` era salva mas ignorada na renderizacao publica (`public-portfolio.service.ts` agora ordena por `itemIds`). Comparacao de versoes continua fora de escopo (decisao original do roadmap) |
| Usuarios, profile e recuperacao de senha | in-progress | CRUD de usuarios (`/admin/users`) com papeis owner/admin/editor/viewer e presets de permissao; recuperacao de senha via Resend (`/forgot-password`, `/reset-password`); troca de senha em `/admin/account`. Falta convite por email e permissoes granulares por campo |
| Auditoria funcional | done | `docs/functional-audit.md`; CRUDs, rotas, likes e upload testados manualmente |
| Gerador de feature front | done | Interativo/pipe, templates separados, CRUD Query/Table/Form e rota admin |
| Gerador de modulo back | done | Interativo/pipe, templates separados, CRUD modular e registro de rota |
| Build de producao do monorepo | done | Packages compartilhados, API e 15 rotas Next compilados sem erros de TypeScript |
| Preparacao Git inicial | done | `.gitignore` na raiz, web e API protege dependencias, builds, secrets, logs e uploads temporarios |
| Deploy gratuito inicial | done | Blueprint Render e guia Vercel/Atlas em `docs/deployment.md`; upload persistente permanece pendente |
| Conteudo rico em paginas/secoes | in-progress | Editor Tiptap real criado e usado em `PageForm`/`CustomSectionForm`. Adicionado: sistema de variaveis (`{profile.name}`, `{year}` etc. via `packages/contracts/src/content-variables.ts` + `apps/api/src/shared/content/render-template.ts`, testado ponta a ponta), bloco Callout (Tiptap custom node) e import de Markdown (`marked`). Perfil/projeto continuam na convencao antiga `**bold**` (alimentam o PDF). Faltam blocos de galeria/cards/stack (precisam upload), preview lado a lado e validacao formal antes de publicar |

## MVP Por Fases

### Prioridade Atual - Fechar Funcional Antes Do Polimento Visual

Status: `done` para o escopo funcional do MVP. O proximo ciclo e polimento visual e expansao do design system.

Auditoria funcional registrada em `docs/functional-audit.md`.

Ordem definida:

1. Base de versoes: `portfolioVersions` e `resumeVersions`.
2. Publicacao real do portfolio usando versao publicada.
3. Curriculo real usando `visibility.resume` e versoes salvas.
4. PDF ATS `classic-ats` no backend.
5. Upload integrado em formularios.
6. Auth real com `AUTH_ENABLED=true`.
7. GitHub API/cache.
8. Hardening de erros, loading, empty states e validacoes.

### Fase 1 - Documentacao Base

Status: `done`.

- Criar este arquivo principal.
- Criar regras em `AGENTS.md`.
- Criar docs de arquitetura, roadmap, permissoes, feature flags, geradores e referencias.
- Criar skills locais para features, design system e padroes de referencia.

Checkpoint: outro agente consegue retomar lendo `PROJECT.md`.

### Fase 2 - Scaffold Do Monorepo

Status: `done`.

- Criar `apps/web`, `apps/api` e `packages/*`.
- Criar `pnpm-workspace.yaml`.
- Criar `.env.example` para web e api.
- Criar placeholders de estrutura.

Checkpoint: estrutura existe e segue o desenho definido.

### Fase 3 - API Base

Status: `done`.

- Express, env, CORS, error handler e healthcheck.
- Conexao MongoDB/Mongoose.
- Modulos base: `auth`, `users`, `uploads`.
- `requirePermission` e `requireFeature`.
- Auth por credenciais iniciado com admin via env.
- Upload local iniciado com Multer/fs e path relativo.

Checkpoint: API responde `/health`, conecta no Mongo e protege rotas.

### Fase 4 - Web Base

Status: `done`.

- Next app.
- Providers: theme, TanStack Query, Nuqs, auth e modal.
- Axios instance.
- `AuthGuard`, `Can`, `Feature` e `isFeatureEnabled`.
- Layout admin e publico minimos.
- Login form inicial com React Hook Form + Zod.
- Dashboard admin inicial autenticado.

Checkpoint: login/admin protegido e pagina publica acessivel.

### Fase 5 - CRUDs Principais

Status: `done`.

- Features: `profile`, `projects`, `skills`, `experiences`, `pages`.
- Cada feature deve ter schema, form, table, queries, mutations, permissions e flags.
- `profile` iniciado como fatia vertical base.
- `projects` iniciado com CRUD, visibilidade e tabela TanStack simples.
- `skills` iniciado com CRUD, categoria, data de inicio e visibilidade.
- `experiences` iniciado como CRUD unificado para experiencia, formacao, certificacao e links.
- `pages` iniciado com CRUD e rota publica por slug.
- Seed inicial criado em `apps/api/scripts/seed-initial-portfolio.ts` replicando dados base do portfolio atual.

Checkpoint: admin edita o conteudo principal.

### Fase 6 - Versoes E Publicacao

Status: `done`.

- `portfolioVersions`.
- `resumeVersions`.
- Selecionar e ordenar secoes.
- Status: `draft`, `published`, `archived`.
- MVP visual iniciado com `/admin/portfolio-builder`.
- MVP visual iniciado com `/admin/resume-builder`.

Checkpoint: publicar no admin reflete imediatamente no portfolio publico.

### Fase 6.1 - Portfolio Publico Inicial

Status: `done` funcional; identidade visual final permanece em evolucao.

- API publica `/public/portfolio`.
- Home publica renderiza profile, skills, projects, experiences e pages publicadas.
- Enquanto nao houver dados cadastrados, usa fallback inspirado em `portfolio.kaesyo.com`.
- Primeira passada visual aplicada para aproximar hero, sobre, skills, projetos e contato do portfolio atual.

### Fase 7 - Curriculo E PDF

Status: `done` funcional.

- Builder de curriculo.
- Template inicial `classic-ats`.
- PDF textual e selecionavel gerado pelo backend.
- Analise do PDF antigo registrada em `docs/resume-source-analysis.md`.
- Perfil ampliado com objetivo, endereco, nascimento e CNH.
- Seed atualizado com historico profissional, competencias pessoais, conquistas, certificacoes e formacao academica.
- Rota `POST /resume-pdf/classic-ats` criada.
- Botao `Baixar PDF` habilitado em `/admin/resume-builder`.

Checkpoint: gerar PDF da versao escolhida.

### Fase 8 - Uploads, Likes E GitHub

Status: `done`.

- Upload local com path normalizado.
- Likes anonimos com hash iniciados em `/public/projects/:projectId/like`.
- Curtida publica agora funciona como toggle: curtir/descurtir no mesmo botao.
- GitHub inicial por API publica e cache.

Checkpoint: projeto publico exibe imagem, likes e dados basicos de repo.

### Fase 9 - Geradores

Status: `done`.

- `pnpm web generate:feature`.
- `pnpm api generate:module`.
- Cada gerador pergunta dados essenciais e cria CRUD no padrao.

Checkpoint: novo modulo nasce funcional e documentado.

### Fase 10 - Design System Base

Status: `in-progress`.

Atualizacao: portfolio publico recebeu layout premium com sidebar fixa no desktop, intro compacta no mobile, projetos priorizados, timeline editorial, stack compacta e menu flutuante responsivo.

- Criar componentes `Page*`, `Section*`, `Ds*`.
- Manter visual simples no MVP.
- Evitar investimento alto na aparencia agora.
- Admin shell e dashboard receberam uma primeira camada visual para melhorar acompanhamento do MVP.
- `DESIGN.md` criado como fonte de direcao visual.
- `docs/design-system.md` criado para tokens, componentes, motion e futura tela `/admin/design-system`.
- `docs/design-mcp-and-skills.md` criado para MCPs, registries e skills.
- `docs/animation-system.md` criado para padronizar motion, variants e scroll animations.
- Tokens premium iniciais adicionados em `apps/web/src/themes/globals.css`.
- Skill Coss e Coss Particles instaladas em `.agents/skills`.
- Impeccable instalado em `.agents`.
- Configs MCP locais criadas em `.mcp.json`, `.cursor/mcp.json` e `.vscode/mcp.json`.
- Componentes de motion criados em `apps/web/src/components/ds/motion.tsx`.
- Landing publica recebeu scroll progress, reveal por viewport, stagger e hover lift.
- Landing publica recebeu scroll-trigger reversivel por progresso real do scroll em projetos, skills, GitHub e headings.
- Background publico recebeu light rays animados na area superior/esquerda da identidade; a aurora anterior ficou comentada/desativada por direcao visual.
- Timeline recebeu trilho visual, marcadores e cards editoriais.
- Cards de projeto ficaram mais compactos, com acoes sobre o preview e sem footer pesado.
- Tecnologias receberam badges com logos adaptativos por tema; GitHub recebeu contribution graph, cards enriquecidos e atividade recente; contato recebeu CTA final mais forte.
- Atividade recente do GitHub recebeu visual inspirado no "Contribution activity": agrupamento por mes, trilho vertical, icones por evento, barras de commits e cards internos para PRs/issues, usando somente dados publicos.
- "Ver mais projetos" recebeu disclosure animado para expandir/recolher a lista com altura, opacidade e controle rotacionando.
- Loading publico recebeu experiencia "Interface Blueprint": linhas SVG desenhando wireframes, passos animados e cards de interface para evitar tela parcial/estranha durante reload e fetch dinamico.
- Portfolio publico recebeu overlay de entrada com tempo minimo de 1,8s para que o loading seja perceptivel mesmo quando a API responde rapido.
- Reveals/scroll stacks foram suavizados para reduzir blur e manter conteudo legivel em reload direto por ancora.
- Cards principais receberam glow hover inspirado em componentes premium/animados da Aceternity UI.
- Tela inicial `/admin/design-system` criada para documentar tokens, componentes e motion patterns.

Checkpoint: base pronta para redesign sem refatoracao pesada.

## Decisoes Tecnicas

- Monorepo com `apps/web` e `apps/api` separados desde o inicio.
- Frontend em Next.js.
- Dev web padronizado em `http://localhost:3004` para nao disputar a porta 3000 quando ela ja estiver ocupada.
- Backend em Express/Node.
- Banco inicial: MongoDB/Mongoose, inspecionavel via Mongo Compass.
- Upload local no MVP com Multer/fs.
- Banco salva path relativo de arquivos.
- Front concatena `NEXT_PUBLIC_BASE_URL_FILES` com o path salvo.
- Front usa `features/`, nunca `modules/`.
- Back usa `modules/`.
- `components/ui` e camada base shadcn, nao deve receber customizacao de produto.
- Customizacoes de produto ficam em `components/ds`.
- Usar composition pattern para pages, sections, cards, builders e layouts.
- Usar Axios Instance.
- Usar TanStack Query para server state.
- Usar TanStack Table para tabelas.
- Usar Nuqs para estado de URL.
- Usar React Hook Form + Zod em formularios.
- Front controla UX de permissao; backend valida seguranca real.
- Feature flags devem existir como componente, funcao JS/TS e middleware backend.
- Auth fica desligada no dev por `AUTH_ENABLED=false` e `NEXT_PUBLIC_AUTH_ENABLED=false` para facilitar testes visuais. Reativar antes de validar seguranca.
- Mudancas visuais devem seguir `DESIGN.md`.
- Motion deve ser usado para microinteracoes objetivas, especialmente feedback de estado, entrada/saida curta e transicoes de layout.
- Portfolio publico e brand surface; admin e product surface.
- Ao criar ou modificar telas no front, verificar referencias de blocks/componentes em Coss, Animate UI, Kibo UI, beUI, ReUI e Impeccable quando aplicavel.
- Animacoes repetiveis devem virar componentes/variants em `components/ds`, evitando configs duplicadas nas features.
- Portfolio publico pode misturar reveal, hover premium, scroll-linked animation, parallax sutil e futuramente GSAP ScrollTrigger.

## Prioridade Atual Do Admin UX (2026-07-17, reordenado)

Decisao revertida em 2026-07-17: o usuario decidiu priorizar o redesign visual agora, pausando o avanco de P3/P4/P5/P6 ate o redesign avancar. Ver `docs/admin-ux-roadmap.md` para o plano de etapas do redesign.

1. **P0 + P1 (redesign)** - Pesquisa de referencias (Coss Particles, ReUI, Kibo UI, beUI, bklit/evilcharts), estilos de componente, layout base (nav superior sem sidebar/sem scroll, estilo Vercel/Supabase - aguardando imagem de referencia do usuario), padroes de pagina/secao/listagem, estrategia de formularios (inline vs Dialog vs Drawer vs Sheet), dashboard com bklit, rollout tela a tela.

**Checkpoint de retomada (2026-07-17):** direcao visual aprovada pelo usuario, ainda em fase de mockup HTML (nao ha codigo React novo ainda). Ver `docs/design-references/admin-redesign-direction.html` (nav/dashboard/tabela/formulario) e `docs/design-references/admin-redesign-pages.html` (Projetos/Skills/Portfolio Builder/Curriculo Builder) - abrir direto no navegador. Decisoes e perguntas em aberto documentadas em `docs/admin-visual-references.md`, secao "Direcao Confirmada Para O Redesign (2026-07-17)". Proximo passo ao retomar: responder as perguntas em aberto (visao unica ou toggle grade/tabela em Projetos e Skills; preview em janela/papel ok?) antes de comecar a escrever componentes React de verdade. Navegacao top nav segue bloqueada ate o usuario enviar a imagem de referencia do Vercel/Supabase.
2. P3 - Builders (comparacao de versoes) - pausado.
3. P4 - Editor de conteudo (blocos de galeria/cards/stack, preview lado a lado) - pausado.
4. P6 - Hardening (contraste WCAG numerico) - pausado.
5. P5 - Usuarios/auth (convite por email, auditoria, permissoes granulares) - pausado.

## Regras De Retomada

Quando continuar este projeto:

1. Leia este `PROJECT.md`.
2. Leia `AGENTS.md`.
3. Veja a proxima fase `pending`.
4. Leia o doc especifico em `docs/`.
5. Execute somente a proxima parte testavel.
6. Ao finalizar uma parte, atualize o status neste arquivo.

## Nao Fazer Sem Pedido Explicito

- Nao rodar build.
- Nao rodar typecheck.
- Nao rodar Biome.
- Nao rodar lint.
- Nao instalar dependencias sem confirmar.
- Nao modificar `components/ui` para customizacoes do app.
- Nao alterar visual final profundamente nesta etapa inicial.
