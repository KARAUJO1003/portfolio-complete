# Geradores

## Objetivo

Criar features e modulos completos por comando, mantendo padrao consistente para humanos e IA.

## Front

Comando alvo:

```bash
pnpm web generate:feature
```

Perguntas:

- Nome da feature.
- Rota admin.
- Rota publica, se houver.
- Endpoint base.
- Entidade principal.
- Campos principais.
- Tem CRUD?
- Tem tabela?
- Tem formulario?
- Permissoes.
- Feature flags.

Arquivos gerados:

```txt
apps/web/src/features/<feature>/
├─ README.md
├─ api/
├─ components/
├─ forms/
├─ tables/
├─ hooks/
├─ schemas/
├─ types/
├─ permissions.ts
├─ feature-flags.ts
├─ constants.ts
└─ feature.tsx
```

O gerador tambem deve criar rota em `app/admin/...` quando solicitado.

Implementado em `apps/web/scripts/generate-feature.mjs`, com templates em `apps/web/scripts/templates/feature`.

## Backend

Comando alvo:

```bash
pnpm api generate:module
```

Implementado em `apps/api/scripts/generate-module.mjs`, com templates em `apps/api/scripts/templates/module`.

Para validar sem registrar arquivos no projeto, defina `GENERATOR_OUTPUT_ROOT` apontando para uma pasta temporaria.

Perguntas:

- Nome do modulo.
- Collection.
- Campos.
- Rotas CRUD.
- Permissoes.
- Feature flags.
- Usa upload?
- E publico ou privado?

Arquivos gerados:

```txt
apps/api/src/modules/<module>/
├─ README.md
├─ <module>.routes.ts
├─ <module>.controller.ts
├─ <module>.service.ts
├─ <module>.repository.ts
├─ <module>.model.ts
├─ <module>.schemas.ts
├─ <module>.permissions.ts
├─ <module>.feature-flags.ts
└─ index.ts
```

## Regras

- Geradores devem ser interativos e aceitar input por pipe.
- Geradores devem usar templates separados.
- Geradores devem atualizar registries pequenos e previsiveis.
- Evitar regex fragil em arquivos grandes.
- Cada feature/modulo gerado deve nascer com README.
