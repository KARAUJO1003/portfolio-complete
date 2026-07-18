# Primitivos De UI

## Decisao

Base UI (`@base-ui/react`) e o primitivo padrao deste projeto, nao Radix. Motivo: e a base real dos particles do Coss UI (ver `docs/design-mcp-and-skills.md` e skill `coss-particles`), que e a fonte de referencia obrigatoria para qualquer componente novo (`DESIGN.md`, secao "Consulta Obrigatoria De Referencias"). Ter Radix e Base UI como primitivos concorrentes no mesmo projeto foi rejeitado explicitamente pelo usuario em 2026-07-16.

Radix so entra quando nao ha equivalente Base UI/coss viavel. Caso conhecido: `vaul` (usado em `components/ui/drawer.tsx`, feature de portfolio publico ja `done`) depende de `@radix-ui/react-dialog` internamente. Migrar o drawer nao e prioridade agora; e o unico ponto de Radix remanescente no projeto.

## Regra Pratica

1. Antes de criar um componente em `components/ui`, procurar o particle equivalente no Coss (skill `coss-particles`).
2. Instalar via `npx shadcn@latest add @coss/<nome>` quando possivel. O registry `@coss` esta configurado em `apps/web/components.json` e na raiz.
3. Verificar `registryDependencies` do componente antes de instalar: se ele depende de `@coss/button` ou outro componente ja customizado neste projeto, o CLI vai sobrescrever o arquivo local. Nesse caso, escrever o componente na mao usando `@base-ui/react/<parte>` direto, adaptando ao estilo do projeto, em vez de rodar o CLI.
4. O CLI do shadcn tambem tenta buscar a paleta de cores (`ui.shadcn.com/r/colors/neutral.json`) e pode sobrescrever tokens de `globals.css`; conferir o diff antes de aceitar.

## Componentes Ja Migrados

- `alert-dialog` (`components/ui/alert-dialog.tsx`): escrito a mao sobre `@base-ui/react/alert-dialog`, usado pelo `ConfirmDialog` em `components/ds/confirm-dialog.tsx`. Testado no navegador: abre, foco preso, Cancelar fecha, zero erro de console.
- `table` (`components/ui/table.tsx`): adaptado do particle `p-table-8`. Sem `useRender`/`mergeProps` (nao usados em nenhum outro lugar do projeto); variante `card` via atributo `data-variant` e seletores `in-data-[variant=card]`. Hover/selected usam tokens do projeto (`bg-surface-raised`, `bg-primary-tint`) em vez de `color-mix` com tokens Tailwind default.
- `checkbox` (`components/ui/checkbox.tsx`): sobre `@base-ui/react/checkbox`. Sem inset-shadow decorativo do particle original (ver `docs/admin-visual-references.md`, principio 1). Testado: `data-checked`/`aria-checked` alternam corretamente ao clicar.
- `select`: ainda nao escrito. Proximo passo esta em `docs/admin-ux-roadmap.md` P2 (paginacao do `DataTableFrame` no padrao `p-table-8`).
- `sheet` (`components/ui/sheet.tsx`): adaptado do particle `@coss/sheet` sobre `@base-ui/react/dialog`. Sem `useRender`/`mergeProps` (mesmo criterio do `table.tsx`) e sem `ScrollArea` dedicado (`SheetPanel` usa `overflow-y-auto` simples). Reservado para formularios de coluna unica sem aside/preview; `ProjectForm` (com aside) usa `Drawer` bottom em vez de Sheet, ver `docs/admin-visual-references.md`.
