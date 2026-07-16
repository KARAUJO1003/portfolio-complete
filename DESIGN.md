# Design System - Portfolio Platform

## Direcao Visual

O produto deve parecer minimalista, moderno e premium, mantendo a identidade dark/dev do portfolio atual, mas com mais maturidade visual.

Palavras-guia:

- minimalista;
- tecnico;
- premium;
- preciso;
- escuro;
- editorial no portfolio publico;
- produtivo e denso no admin.

## Superficies

### Portfolio Publico

Registro: brand surface.

Objetivo: causar boa primeira impressao para recrutadores, clientes e outros desenvolvedores. A landing pode ter mais respiro, composicao editorial, motion sutil e cards visuais.

### Admin

Registro: product surface.

Objetivo: permitir criar, revisar e publicar conteudo com clareza. Deve ser mais denso, previsivel e operacional que a landing publica.

O admin deve evoluir por padroes reutilizaveis antes de telas isoladas. Formularios, tabelas, builders, login, usuarios e permissoes devem seguir `docs/admin-ux-roadmap.md`, e toda nova decisao visual/componente deve aparecer em `/admin/design-system`.

## Consulta Obrigatoria De Referencias

Antes de criar ou refatorar qualquer componente de UI, consultar os particles do Coss UI.

1. Usar a skill local `coss-particles`, que indexa 484 particles em 52 tipos de componente.
2. Localizar o particle equivalente e ler o codigo em `https://coss.com/ui/r/<nome>.json`.
3. Extrair o padrao. Nao copiar o codigo.
4. Adaptar para o stack deste projeto.

Motivo da adaptacao: os particles usam primitivos coss sobre Base UI (`@base-ui/react`); este projeto usa shadcn sobre Radix. Instalar `@base-ui/react` criaria um segundo sistema de componentes em paralelo e exige decisao explicita do usuario.

Ordem de consulta: Coss Particles primeiro; depois Animate UI, Kibo UI, beUI e Impeccable.

Referencias ja adotadas:

- `p-table-8` (CardFrame + TanStack Table + ordenacao + paginacao) e o alvo do `DataTableFrame`. Ver `docs/admin-visual-references.md`.

## Identidade Visual Do Admin

As referencias visuais do admin e os principios derivados delas estao em `docs/admin-visual-references.md`. Ler antes de qualquer trabalho visual no admin.

Resumo: separacao por borda de 1px e nao por sombra; densidade alta; numero como protagonista; monocromia por padrao com cor apenas como sinal; mono para valor tecnico; botao primario solido e raro; empty state sempre com icone, titulo e uma linha.

## Tokens Base

### Background

- `--background`: fundo principal.
- `--background-subtle`: fundo com leve variacao para areas extensas.
- `--surface`: superficie de cards e paineis.
- `--surface-raised`: superficie elevada para headers, popovers e paineis destacados.
- `--surface-muted`: superficie secundaria.
- No modo claro, o fundo principal deve ser cinza frio sutil em vez de branco puro; cards e superficies tambem devem ficar em cinza claro frio, sem branco puro, para reduzir o contraste agressivo e preservar hierarquia com bordas mais definidas.

### Foreground

- `--foreground`: texto principal.
- `--foreground-muted`: texto secundario.
- `--foreground-subtle`: texto de baixa prioridade.

### Brand

- `--primary`: acao principal.
- `--primary-foreground`: texto sobre primary.
- `--primary-tint`: fundo suave da marca.
- `--primary-accent`: acento visual para detalhes e foco.
- `--secondary`: acao/estado secundario.
- `--secondary-foreground`: texto sobre secondary.

### Feedback

- `--danger`: erro/remocao.
- `--success`: confirmacao/publicado.
- `--warning`: atencao/rascunho.

## Motion

Usar Motion for React para microinteracoes, nao para distrair.

Padroes:

- entradas curtas entre 160ms e 260ms;
- escala pequena em toggles e botoes iconicos;
- `layout` para transicoes de contagem/estado;
- respeitar `prefers-reduced-motion` quando houver animacoes mais fortes;
- nada de animacao infinita decorativa sem funcao clara.

### Regras De Animacao

- Antes de criar ou alterar uma tela, verificar referencias de blocks/componentes: Coss Particles primeiro, depois Animate UI, Kibo UI, beUI e Impeccable. Ver `## Consulta Obrigatoria De Referencias`.
- Preferir criar componentes animados reutilizaveis em `components/ds` quando a animacao puder aparecer em mais de uma area.
- Variantes de animacao devem ser nomeadas e reaproveitaveis, por exemplo `fade-up`, `scale-in`, `blur-in`, `stagger`, `scroll-progress`.
- Portfolio publico pode combinar diferentes estilos de animacao: entrada por viewport, hover premium, scroll-linked animation, parallax sutil e futuramente GSAP ScrollTrigger.
- Animacoes de scroll no portfolio devem ser reversiveis quando possivel: ao descer, o bloco entra em foco; ao subir, o mesmo movimento deve desfazer naturalmente pelo progresso do scroll.
- Blur nunca deve deixar conteudo parado ilegivel durante o scroll. Use blur minimo apenas como suavizacao de entrada, priorizando opacity, translate e escala leve.
- Scroll motion deve ser perceptivel no portfolio publico: deslocamento, escala leve e stagger precisam ser visiveis, mas sem comprometer leitura ou performance.
- Para listas editoriais, cards de projeto, timeline e badges, usar stacks animados por progresso de scroll em vez de reveals isolados. Quando a lista tiver narrativa sequencial, usar sticky stack para que um item segure posicao ate o proximo chegar.
- Admin deve usar motion com mais contencao: feedback de estado, transicao de paineis, tabelas e drawers.
- Sempre avaliar `prefers-reduced-motion`.

## Componentes

Manter:

- `components/ui`: base atualizavel, sem regra visual de produto.
- `components/ds`: wrappers e componentes de produto.
- `features/*/components`: composicoes especificas de feature.

Admin:

- `/admin/design-system` deve funcionar como vitrine viva de tokens, tipografia, grids, formularios, tabelas, estados, motion, drawers/dialogs, uploads, builders, permissoes e exemplos de composicao.
- a navegacao principal do admin deve permanecer superior, agrupada por Base, Conteudo, Publicacao e Sistema, com estados ativos claros e sem sidebar fixa por enquanto.
- login deve parecer parte do produto, com superficie premium, copy clara e sem depender da landing publica.
- `PageFrame`, `ActionBar`, `Toolbar`, `EmptyState`, `LoadingState` e `ErrorState` sao a base para telas operacionais.
- formularios complexos devem ter secoes, etapas, contexto, preview quando aplicavel, erro por campo e resumo de erro.
- formularios complexos usam `DsForm`, `FormSection`, `FormStep`, `FormActions`, `FormAside` e `FormPreviewFrame`; campos padronizados seguem `FormFields`.
- tabelas devem ser envolvidas em frame padrao com filtros, busca, ordenacao, empty/loading/error states e acoes consistentes.
- tabelas usam `DataTableFrame` envolvendo TanStack Table; a primeira tela piloto e Projetos.
- builders de portfolio/curriculo devem ter preview real, drag and drop, controle de versao e barra de publicacao clara.
- paginas e secoes customizadas devem evoluir para editor rico/markdown/blocos com variaveis `{...}` e preview.
- rich text deve persistir HTML string em `content` por padrao; Markdown e importacao entram como camada de entrada/conversao.

## Portfolio Publico - Layout Premium 2026

A landing publica passou a seguir uma composicao brand com sidebar fixa no desktop e coluna principal rolavel. A sidebar concentra identidade, resumo curto, CTAs, navegacao e links sociais; a coluna principal prioriza projetos selecionados antes de stack/about para reduzir friccao de avaliacao.

Padroes adicionados:

- desktop com sidebar `sticky` e conteudo principal em scroll;
- no desktop, sidebar deve conter apenas identidade, resumo curto, contatos e navegacao; textos completos como "Sobre" ficam no conteudo principal para evitar redundancia;
- mobile com intro compacta e menu flutuante expansivel;
- projetos como primeira area de impacto, com primeiro card destacado;
- titulos de secoes da landing devem manter escala consistente; apenas hero/intro principal pode usar escala maior;
- experiencias em timeline editorial;
- skills compactas em badges para nao competir com projetos;
- background em camadas com glows sutis e vinheta, sem grid decorativo dominante;
- topo/esquerda da landing pode usar light rays animados e discretos, posicionados sobre a area de identidade/sidebar, para dar profundidade sem disputar com os cards; efeitos antigos como aurora devem ficar desativados quando competirem com a leitura;
- hover de cards e badges com acento visual controlado;
- scroll-trigger reversivel com `MotionScrollReveal` e `MotionScrollStack` para dar mais profundidade aos projetos, skills e conteudos secundarios;
- cards de projeto compactos, com acoes sobre o preview visual em vez de footer pesado;
- cards de projeto devem mostrar resumo truncado e abrir um drawer bottom de detalhes ao clicar, mantendo o grid limpo e deixando o conteudo completo, tecnologias e links no painel;
- imagens de projeto devem sempre tratar loading, erro e ausencia de imagem com uma composicao reutilizavel, usando fallback visual consistente em cards e drawer;
- timeline com trilho vertical, marcadores e cards editoriais;
- tecnologias com badges visuais e logos de marca em componente local inspirado no padrao Elements;
- logos de tecnologias com marca escura/clara devem ser adaptativos para manter contraste nos temas dark e light;
- GitHub com contribution graph, cards enriquecidos e atividade recente no formato timeline inspirado no "Contribution activity" do GitHub, sem expor dados privados;
- blocos de "ver mais" devem expandir/recolher com motion de altura, opacidade e rotacao do controle, respeitando `prefers-reduced-motion`;
- carregamentos publicos devem usar uma experiencia visual propria, nao spinner generico: blueprint de interface, linhas SVG desenhando wireframes, passos curtos e motion leve que remeta a front-end/design em construcao; no portfolio publico, manter um tempo minimo curto de exibicao para que a animacao seja percebida antes da tela final;
- cards principais com glow hover inspirado em Aceternity UI, sem copiar codigo externo;
- fechamento de contato com CTA mais forte e visual menos generico.
