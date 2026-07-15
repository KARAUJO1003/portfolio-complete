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

## Politica De Uso

- MCP/skills servem como referencia e acelerador, nao como substituto do design system local.
- Antes de importar bloco externo, verificar dependencias, acessibilidade, responsividade e tokens.
- Componentes externos devem entrar como `components/ds` ou `features/*/components`, nunca alterando `components/ui` diretamente.
- Visual final deve continuar minimalista, premium e coerente com `DESIGN.md`.
