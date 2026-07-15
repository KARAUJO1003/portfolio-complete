---
name: feature-module-architecture
description: Use para criar, mover, dividir, apagar ou reorganizar estruturas em apps/web/src/features/* ou apps/api/src/modules/*.
---

# Feature Module Architecture

## Frontend

- Use `apps/web/src/features/<feature>`.
- Mantenha rotas em `app/` finas, importando `feature.tsx`.
- Coloque UI especifica em `components/`, `forms/` e `tables/`.
- Coloque data fetching em `api/` ou `hooks/`.
- Coloque schemas Zod em `schemas/`.
- Coloque tipos locais em `types/`.
- Coloque permissoes em `permissions.ts`.
- Coloque flags em `feature-flags.ts`.
- Crie `README.md` por feature.

## Backend

- Use `apps/api/src/modules/<module>`.
- Rotas chamam controllers.
- Controllers chamam services.
- Services chamam repositories.
- Repositories isolam Mongo/Mongoose.
- Coloque schemas de validacao em `<module>.schemas.ts`.
- Coloque permissoes em `<module>.permissions.ts`.
- Coloque flags em `<module>.feature-flags.ts`.
- Crie `README.md` por modulo.

## Naming

- Pastas e arquivos em `kebab-case`.
- Componentes React em `PascalCase`.
- Hooks e helpers em `camelCase`.
- Evite barrel exports genericos por padrao.

