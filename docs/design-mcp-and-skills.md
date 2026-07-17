# Design MCPs E Skills

## Instalado No Projeto

- `motion`: biblioteca de animacao React instalada em `apps/web`.
- `coss`: skill instalada em `.agents/skills/coss`.
- `coss-particles`: skill instalada em `.agents/skills/coss-particles`.
- `impeccable`: skill instalada em `.agents` via `npx impeccable install`.

## MCPs/Registries Planejados

### Shadcn MCP

Fonte: https://ui.shadcn.com/docs/mcp

Uso: servidor MCP para navegar, buscar e instalar itens de registries shadcn-compatible.

### Animate UI

Fonte: https://animate-ui.com/docs/mcp

Uso: componentes animados baseados em Tailwind CSS e Motion.

Registry planejado:

```json
"@animate-ui": "https://animate-ui.com/r/{name}.json"
```

### Kibo UI

Fonte: https://www.kibo-ui.com/docs/mcp

Uso: componentes, blocks e patterns composable/acessiveis para shadcn/ui.

MCP remoto oficial:

```txt
https://www.kibo-ui.com/api/mcp/mcp
```

### BeUI

Fonte informada:

```txt
https://mcp.beui.dev/mcp
```

Uso: referencia para componentes/blocks animados via MCP remoto.

### Coss UI

Fonte: https://coss.com/ui/docs/skills

Uso: skill local e particulas para componentes mais agradaveis, especialmente buttons, cards, tables, forms e particles.

### ReUI

Fonte: https://reui.io/docs (docs), https://reui.io/blocks (blocks), https://reui.io/docs/claude (setup Claude Code).

Uso: registry construido sobre shadcn/ui e Tailwind, compativel com Base UI e Radix. Referencia visual explicita do usuario (2026-07-17) para o admin: dense, limpo, premium. Free: 17 primitivos (data-grid, kanban, filters, date-selector, stepper, tree), 1000+ exemplos, 562 icones. Premium: 485+ blocks (Application, Data Grid, Solutions, eCommerce, Marketing) e templates, exigem `REUI_LICENSE_KEY` proprio do usuario.

Config em `.mcp.json`/`.cursor/mcp.json`/`.vscode/mcp.json`:

```json
"reui": { "type": "http", "url": "https://mcp.reui.io" }
```

Pendente de acao do usuario (nao pode ser feito pelo assistente):

- Autenticar via `/mcp` no Claude Code (fluxo OAuth interativo) ou `claude mcp add --transport http reui https://mcp.reui.io --header "Authorization: Bearer <token>"` para uso headless.
- Instalar a skill oficial rodando `curl -fsSL https://mcp.reui.io/install | node -` na raiz do projeto (script remoto; o assistente nao executa `curl | node` por politica de seguranca).
- Se for usar blocks premium, adicionar `REUI_LICENSE_KEY` em `.env.local` e o registry `@reui` em `components.json` (ver docs oficiais).

## Politica De Uso

- MCP/skills servem como referencia e acelerador, nao como substituto do design system local.
- Antes de importar bloco externo, verificar dependencias, acessibilidade, responsividade e tokens.
- Componentes externos devem entrar como `components/ds` ou `features/*/components`, nunca alterando `components/ui` diretamente.
- Visual final deve continuar minimalista, premium e coerente com `DESIGN.md`.
