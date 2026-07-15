# Arquitetura

## Visao Geral

O projeto nasce como monorepo, mas com frontend e backend separados por desenho. Isso permite desenvolver rapido no mesmo repositorio e separar os apps no futuro sem reescrever regras de negocio.

```txt
portfolio-platform/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ contracts/
│  ├─ permissions/
│  ├─ feature-flags/
│  ├─ config/
│  └─ http-client/
├─ docs/
├─ .agents/
└─ storage/
```

## Frontend

```txt
apps/web/src/
├─ app/
├─ core/
│  ├─ api/
│  ├─ auth/
│  ├─ cache/
│  ├─ config/
│  ├─ feature-flags/
│  └─ permissions/
├─ features/
├─ components/
│  ├─ ui/
│  ├─ ds/
│  ├─ datatable/
│  ├─ layout/
│  └─ shared/
├─ providers/
├─ hooks/
└─ themes/
```

Principios:

- `app/` orquestra rotas.
- `features/` contem comportamento de produto.
- `core/` contem infraestrutura do app.
- `components/ui` fica como shadcn/base.
- `components/ds` contem wrappers e componentes do design system do projeto.
- `components/datatable`, `layout` e `shared` guardam componentes reutilizaveis.

## Backend

```txt
apps/api/src/
├─ modules/
├─ shared/
├─ infra/
├─ config/
└─ main.ts
```

Principios:

- `modules/` agrupa dominios: `projects`, `resume`, `portfolio`, `uploads`, `auth`.
- `shared/` contem middlewares, erros, guards e utilitarios.
- `infra/` contem Mongo, storage, GitHub e PDF.
- Controllers nao devem conter regra de negocio.
- Services nao devem depender de Express.
- Repositories isolam Mongoose.

## Packages

- `contracts`: schemas Zod, DTOs e tipos compartilhados.
- `permissions`: `can()`, roles, actions, subjects e helpers.
- `feature-flags`: flags e helpers compartilhados.
- `config`: constantes e leitura padronizada de env.
- `http-client`: camada compartilhavel para clientes HTTP, se necessario.

## Separacao Futura

Para separar frontend e backend em repos diferentes:

- manter contratos em pacote compartilhado ou publicar pacote privado;
- manter regras de permissao independentes de framework;
- manter API documentada e versionada;
- nao importar codigo de `apps/web` dentro de `apps/api`, nem o inverso.

