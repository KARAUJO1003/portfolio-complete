# Feature Flags

## Objetivo

Permitir ativar/desativar recursos no front e no backend de forma centralizada.

## Uso No Front

Componente:

```tsx
<Feature flag="github.stats.enabled">
  <GithubStatsPanel />
</Feature>
```

Funcao:

```ts
if (isFeatureEnabled("resume.pdf.enabled")) {
  // ...
}
```

## Uso No Backend

Middleware:

```ts
requireFeature("github.integration.enabled")
```

Funcao:

```ts
if (isFeatureEnabled("anonymousLikes.enabled")) {
  // ...
}
```

## Fonte Das Flags

Ordem recomendada para o MVP:

1. defaults no codigo;
2. env;
3. banco de dados em fase futura;
4. override por usuario/role em fase futura.

## Flags Iniciais

```txt
portfolio.versions.enabled
resume.versions.enabled
resume.pdf.enabled
resume.pdfTemplates.enabled
uploads.local.enabled
anonymousLikes.enabled
github.integration.enabled
github.stats.enabled
i18n.ready
```

