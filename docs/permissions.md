# Permissoes

## Modelo

O projeto usa um modelo proprio baseado em `can()`, `AuthGuard` e `Can`.

Front controla experiencia de usuario. Backend controla seguranca real.

## Permissao

Formato recomendado:

```txt
subject:action
```

Exemplos:

```txt
projects:view
projects:create
projects:update
projects:delete
resume:publish
portfolio:publish
admin:access
```

## Frontend

Pagina ou bloco grande:

```tsx
<AuthGuard groupSlug="projects" can={["view"]}>
  <ProjectsFeature />
</AuthGuard>
```

Acao granular:

```tsx
<Can can={["create"]}>
  <CreateProjectButton />
</Can>
```

Regra:

- `AuthGuard` carrega usuario/permissoes e cria contexto.
- `Can` usa o contexto quando estiver dentro do `AuthGuard`.
- `Can` tambem pode funcionar standalone quando receber abilities.

## Backend

Rotas privadas devem usar middleware:

```ts
requirePermission("projects:update")
```

O backend nao deve confiar no front. Mesmo que um botao esteja oculto, a rota precisa validar permissao.

## Multiusuario

MVP com admin inicial, mas modelo preparado para:

- `owner`;
- `editor`;
- `viewer`.

Campos recomendados em entidades importantes:

```txt
createdBy
updatedBy
ownerId
```

