---
name: project-reference-patterns
description: Use para manter este projeto alinhado aos padroes aproveitados de corpus-front e fbi_front.
---

# Project Reference Patterns

## Referencias

Este projeto se inspira em:

- `C:\PROJETOS\www\a&a\corpus\corpus-front`
- `C:\PROJETOS\www\ferroeste\fbi_front`

## Padroes A Manter

- `features/` no front.
- `core/api` para Axios Instance.
- Providers raiz para QueryClient, Nuqs, theme, auth e modal.
- `AuthGuard` envolvendo paginas.
- `Can` para acoes internas reutilizando contexto.
- Feature flags tipadas e centralizadas.
- TanStack Query para server state.
- TanStack Table para tabelas.
- Geradores interativos com templates.
- Skills locais para padroes estruturais.

## Diferencas Deste Projeto

- Backend separado em Express desde o inicio.
- Contratos compartilhados em `packages/contracts`.
- Permissoes compartilhadas em `packages/permissions`.
- Feature flags compartilhadas em `packages/feature-flags`.
- Design system proprio em `components/ds`.
- `PROJECT.md` e a fonte principal de status e retomada.

