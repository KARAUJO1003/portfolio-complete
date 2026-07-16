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

## Tokens Base

### Background

- `--background`: fundo principal.
- `--background-subtle`: fundo com leve variacao para areas extensas.
- `--surface`: superficie de cards e paineis.
- `--surface-raised`: superficie elevada para headers, popovers e paineis destacados.
- `--surface-muted`: superficie secundaria.
- No modo claro, o fundo principal deve ser cinza frio sutil em vez de branco puro; cards e superficies podem permanecer mais claros para preservar hierarquia.

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

- Antes de criar ou alterar uma tela, verificar referencias de blocks/componentes quando fizer sentido: Coss Particles, Animate UI, Kibo UI, beUI e Impeccable.
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

Futuro:

- criar `/admin/design-system` com tokens, tipografia, grids, cards, formularios, tabelas, estados, motion e exemplos de composicao.

## Portfolio Publico - Layout Premium 2026

A landing publica passou a seguir uma composicao brand com sidebar fixa no desktop e coluna principal rolavel. A sidebar concentra identidade, resumo curto, CTAs, navegacao e links sociais; a coluna principal prioriza projetos selecionados antes de stack/about para reduzir friccao de avaliacao.

Padroes adicionados:

- desktop com sidebar `sticky` e conteudo principal em scroll;
- mobile com intro compacta e menu flutuante expansivel;
- projetos como primeira area de impacto, com primeiro card destacado;
- experiencias em timeline editorial;
- skills compactas em badges para nao competir com projetos;
- background em camadas com glows sutis e vinheta, sem grid decorativo dominante;
- hover de cards e badges com acento visual controlado;
- scroll-trigger reversivel com `MotionScrollReveal` e `MotionScrollStack` para dar mais profundidade aos projetos, skills e conteudos secundarios;
- cards de projeto compactos, com acoes sobre o preview visual em vez de footer pesado;
- timeline com trilho vertical, marcadores e cards editoriais;
- tecnologias com badges visuais e logos de marca em componente local inspirado no padrao Elements;
- logos de tecnologias com marca escura/clara devem ser adaptativos para manter contraste nos temas dark e light;
- GitHub com contribution graph, cards enriquecidos e atividade recente no formato timeline inspirado no "Contribution activity" do GitHub, sem expor dados privados;
- blocos de "ver mais" devem expandir/recolher com motion de altura, opacidade e rotacao do controle, respeitando `prefers-reduced-motion`;
- cards principais com glow hover inspirado em Aceternity UI, sem copiar codigo externo;
- fechamento de contato com CTA mais forte e visual menos generico.
