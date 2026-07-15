# Design System

## Objetivo

Construir um design system proprio para o portfolio/admin, com visual minimalista, moderno e premium.

O sistema deve permitir:

- redesign incremental do portfolio publico;
- admin mais agradavel sem perder densidade operacional;
- documentacao visual futura em `/admin/design-system`;
- troca de bibliotecas sem refatoracao ampla;
- uso seletivo de componentes/blocks externos via MCP/registries.

## Estrutura

```txt
apps/web/src/
├─ components/
│  ├─ ui/        # base atualizavel, estilo shadcn-like
│  ├─ ds/        # design system do produto
│  ├─ layout/
│  └─ shared/
├─ features/
└─ themes/
```

## Regras

- Nao customizar `components/ui` para estetica de produto.
- Criar tokens em `themes/globals.css`.
- Criar wrappers e composicoes em `components/ds`.
- Usar Motion for React para microinteracoes.
- Usar Coss/Kibo/Animate UI como referencia ou fonte de blocos, mas adaptar para os tokens locais.
- Evitar copiar blocos grandes sem revisar acessibilidade, dependencias e compatibilidade.

## Tokens Planejados

- Background: `background`, `background-subtle`, `surface`, `surface-raised`, `surface-muted`.
- Textos: `foreground`, `foreground-muted`, `foreground-subtle`.
- Marca: `primary`, `primary-foreground`, `primary-tint`, `primary-accent`, `secondary`.
- Estados: `success`, `warning`, `danger`.

## Roadmap Visual

1. Tokens premium iniciais.
2. Motion e microinteracoes nos controles principais.
3. Botao de like estilo Instagram.
4. `DsButton`, `DsCard`, `DsStat`, `DsToolbar`, `DsEmptyState`.
5. Tela `/admin/design-system`.
6. Galeria de blocos: hero, project card, skill card, form frame, table frame, builder panel.
7. Auditoria visual com Impeccable.
