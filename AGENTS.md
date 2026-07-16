# Project Agent Rules

## Fonte Principal

- Leia `PROJECT.md` antes de qualquer execucao.
- Leia `DESIGN.md` antes de mudancas visuais.
- Use `PROJECT.md` para saber escopo, status, proximas fases e decisoes.
- Atualize `PROJECT.md` ao concluir uma fase ou mudar status de funcionalidade.

## Economia De Contexto

- Verifique apenas arquivos necessarios.
- Use `rg` e `rg --files` antes de leituras amplas.
- Nao carregue docs grandes se a tarefa for pequena.
- Prefira mudancas pequenas, testaveis e documentadas.

## Comandos Proibidos Sem Pedido

- Nao rode build.
- Nao rode typecheck.
- Nao rode Biome.
- Nao rode lint.
- Nao rode suites globais de teste.
- Nao instale dependencias sem confirmacao.

## UI

- Antes de criar ou refatorar qualquer componente de UI, consultar os particles do Coss via skill `coss-particles`.
- Extrair o padrao do particle e adaptar ao stack shadcn/Radix. Nao copiar o codigo nem instalar `@base-ui/react`.
- Ler `docs/admin-visual-references.md` antes de trabalho visual no admin.

## Estrutura

- Front usa `features/`.
- Back usa `modules/`.
- `components/ui` e a camada base shadcn e deve ser tratada como atualizavel.
- Nao coloque customizacao de produto em `components/ui`.
- Use `components/ds` para wrappers e componentes reutilizaveis do projeto.
- Use tokens definidos em `themes/globals.css` e documentados em `DESIGN.md`.
- Use Motion for React para microinteracoes quando isso melhorar feedback de estado.
- Evite tags HTML repetidas diretamente nos modulos.
- Crie componentes compostos para paginas, secoes, cards, builders, toolbars e layouts repetidos.

## Frontend

- Use `core/api` para Axios Instance.
- Use TanStack Query para server state.
- Use TanStack Table para tabelas.
- Use Nuqs para estado de URL.
- Use React Hook Form + Zod para formularios.
- Use `AuthGuard` para proteger paginas ou blocos grandes.
- Use `Can` para acoes granulares.
- Use `Feature` ou `isFeatureEnabled` para feature flags.

## Backend

- Controllers devem ser finos.
- Services contem regra de aplicacao.
- Repositories isolam Mongo/Mongoose.
- Backend valida permissoes de verdade.
- Upload deve normalizar path e salvar no banco apenas path relativo.

## Documentacao

- Toda feature/modulo gerado deve ter README curto.
- Ao finalizar uma fase, atualize `PROJECT.md`.
- Se uma decisao nova for tomada, registre em `docs/architecture.md` ou no doc especifico.
