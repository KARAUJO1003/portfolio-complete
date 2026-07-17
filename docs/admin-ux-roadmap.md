# Admin UX Roadmap

## Objetivo

Evoluir o admin de CRUD simples para uma plataforma de edicao premium, consistente e produtiva, mantendo o portfolio publico e o curriculo como validadores reais de cada mudanca.

Este documento deve ser lido antes de qualquer grande alteracao no admin, formularios, tabelas, builders, autenticacao, permissoes ou design system.

## Principios

- Primeiro criar base visual e UX reutilizavel; depois aplicar tela por tela.
- Nao redesenhar cada CRUD de forma isolada.
- Todo padrao novo precisa aparecer em `/admin/design-system`.
- Toda alteracao em conteudo publicado deve ser testada no portfolio publico e no curriculo/PDF quando afetar dados compartilhados.
- `components/ui` continua sendo base shadcn atualizavel.
- Produto visual e comportamento ficam em `components/ds` e composicoes de `features/*`.
- Formularios devem explicar contexto, progresso e consequencia da alteracao.
- Tabelas devem ter frame padrao, filtros, busca, ordenacao, estados vazios e loading.
- Builders devem priorizar preview real, drag and drop, publicacao controlada e historico de versoes.

## Referencias Locais

### Corpus Front - Form Fields

Arquivo de referencia:

`C:\PROJETOS\www\a&a\corpus\corpus-front\src\components\shared\form-fields.tsx`

Usar como referencia para criar o sistema de formularios deste projeto, sem copiar automaticamente dependencias ou componentes que nao existem aqui.

Padroes uteis identificados:

- API agregadora `FormFields.*` para campos integrados com React Hook Form.
- Todos os campos usam `Controller` e `useFormContext`.
- Suporte a `fieldClassName`, `showError`, `label`, `description` e erro por campo.
- `Input` com mask, currency, prefix, retorno numerico e controle de valor mascarado.
- `Select`, `NativeSelect`, `MultiSelect`, `ComboboxSelect`, `AsyncCombobox` e `Autocomplete`.
- `Number` com botoes de incremento/decremento laterais.
- `ImageUpload` integrado ao formulario.
- `Slider`, `OTP`, `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`.
- Helpers para normalizar option, label/value e referencias selecionadas.

Como adaptar:

- Criar equivalente em `apps/web/src/components/ds/form-fields.tsx`.
- Usar componentes `components/ui` do projeto ou adicionar via shadcn quando necessario.
- Preservar a ideia de API consistente, mas adaptar visual e UX ao `DESIGN.md`.
- Evitar acoplar a `reui`/componentes externos sem decisao explicita.
- Cada campo novo precisa aparecer em `/admin/design-system`.

## Prioridades

### P0 - Base De Identidade E Sistema Admin

Status: `in-progress`.

Objetivo: definir a linguagem visual e interacional do admin antes de mexer em muitas telas.

Entregas:

- Redesenhar `AdminShell` com navegacao mais clara, hierarquia melhor, estados ativos e area de usuario.
- Redesenhar tela de login para combinar com a identidade do produto.
- Criar padrao de `PageFrame`, `ActionBar`, `Toolbar`, `EmptyState`, `LoadingState`, `ErrorState` e `ConfirmDialog`.
- Expandir `/admin/design-system` com:
  - tokens;
  - tipografia;
  - layout admin;
  - formularios;
  - tabelas;
  - estados;
  - drawers/dialogs;
  - upload/image states;
  - builders;
  - permissoes;
  - feature flags.
- Documentar exemplos e anotacoes para IA e usuarios.

Checkpoint testavel:

- `/admin`, `/login` e `/admin/design-system` mostram a nova base sem alterar regras de negocio.

Progresso:

- `AdminShell` mantem navegacao superior e agora agrupa Base, Conteudo, Publicacao e Sistema.
- Login recebeu composicao propria e superficie mais premium.
- Criados `PageFrame`, `ActionBar`, `Toolbar`, `EmptyState`, `LoadingState`, `ErrorState` e `ConfirmDialog`.
- `ConfirmDialog` usa Base UI `AlertDialog` (nao Radix): foco preso, ESC bloqueado, aria corretos. Ver `docs/ui-primitives.md`.
- `EmptyState`/`ErrorState` ganharam icone real (lucide-react); `StatGrid`/`Stat` (antes codigo morto) viraram o padrao "numero protagonista".
- `Badge` ganhou tons `danger`/`warning` e variante `dot`, alinhado ao particle `p-table-8` do Coss.
- Corrigidos dois bugs de token pre-existentes: `--input`/`--ring` nao existiam (bordas caiam em `currentColor`) e a variante `destructive` do botao apontava para `--destructive`, que nunca existiu.
- `/admin/design-system` agora demonstra tokens, componentes base, Admin UX, tabelas, metricas, estados, dialogs e motion patterns.
- Faltam ainda no design-system: tipografia, layout admin, upload/image states, builders, permissoes e feature flags.
- Referencias visuais do usuario (2026-07-16) registradas em `docs/admin-visual-references.md`.
- `Table` e `Checkbox` (Base UI) escritos a mao a partir do particle `p-table-8`; showcase estatico em `/admin/design-system`, secao Tabelas. `Select` ainda falta.

### P1 - Sistema De Formularios

Status: `in-progress`.

Objetivo: criar um padrao consistente para formularios complexos e reutilizar em profile, projetos, skills, experiencias, paginas, secoes e builders.

Entregas:

- Criar `DsForm`, `FormSection`, `FormStep`, `FormActions`, `FormAside`, `FormPreviewFrame`.
- Criar inputs padronizados:
  - `TextInput`;
  - `Textarea`;
  - `NumberInput` com botoes laterais/stepper;
  - `Switch/Checkbox`;
  - `Select/Combobox`;
  - `AsyncAutocomplete`;
  - `TagInput`;
  - `UploadField`;
  - `RichTextField`.
- Padrao de validacao visual:
  - erro por campo;
  - resumo de erro no topo;
  - dirty state;
  - autosave futuro quando fizer sentido;
  - confirmacao ao sair com alteracoes pendentes.
- Integrar `Tiptap` para textos formataveis onde fizer sentido.
- Manter Markdown/MDX como opcao estrutural quando o conteudo for pagina/secao.

Checkpoint testavel:

- Refatorar primeiro `ProjectForm` como piloto completo.
- Alterar projeto, publicar portfolio e validar no portfolio publico, drawer de projeto e curriculo quando aplicavel.

Progresso:

- Criados `DsForm`, `FormSection`, `FormStep`, `FormActions`, `FormAside` e `FormPreviewFrame`.
- Criado `FormFields` inicial com `Text`, `Textarea`, `NumberStepper`, `Select`, `Switch`, `TagInput` e `RichTextField` placeholder.
- `ProjectForm` virou piloto com secoes, preview lateral e controle de dirty state.
- `SkillForm`, `ExperienceForm`, `PageForm` e `ProfileForm` migrados de inputs crus (`components/ui` direto) para `DsForm`/`FormSection`/`FormFields`, no padrao basico (sem steps/preview/aside) para deixar pronto para refinamento visual futuro.
- `CustomSectionsFeature` (antes CRUD inline com `useState`, sem React Hook Form) ganhou form dedicado `custom-section-form.tsx` com `useForm`/Zod/`FormFields`, seguindo o mesmo padrao basico.
- 2026-07-17: migracao verificada sem erros de console em `/admin/skills`, `/admin/experiences`, `/admin/pages`, `/admin/profile` e `/admin/custom-sections`; ciclo criar/editar/excluir testado manualmente em `custom-sections`.

### P2 - Tabelas E Listagens

Status: `in-progress`.

Objetivo: padronizar todas as listagens em uma experiencia de gestao consistente.

Entregas:

- Criar `DataTableFrame` envolvendo TanStack Table.
- Filtros por coluna, busca global, ordenacao, visibilidade de colunas e paginacao.
- Estados:
  - carregando;
  - vazio;
  - erro;
  - sem resultado apos filtro;
  - bulk actions futuro.
- Persistir estado via Nuqs quando fizer sentido.
- Aplicar em:
  - projetos;
  - skills;
  - experiencias;
  - paginas;
  - secoes;
  - usuarios.

Checkpoint testavel:

- Refatorar tabela de projetos primeiro e validar filtros, busca, ordenacao e acoes.

Progresso:

- `DataTable` recebeu estado de ordenacao do TanStack Table.
- `DataTableFrame` criado para busca, filtros, estados e acoes.
- `ProjectsTable` usa busca global local, filtro por status e empty/error states padronizados.
- `Table`/`Checkbox` (Base UI, `components/ui`) escritos a partir do particle `p-table-8`; ainda nao integrados ao `ProjectsTable` nem ao `DataTableFrame` real.
- Proximo passo: escrever `select` (Base UI) e migrar `ProjectsTable` para `Table`/`Checkbox`/`Select` reais no padrao `p-table-8` (checkbox de selecao, paginacao, ordenacao no header).

### P3 - Builders Com Preview Real

Status: `in-progress`.

Objetivo: transformar portfolio builder e resume builder em ferramentas visuais de composicao, nao apenas formularios.

Entregas:

- Preview real do portfolio antes de salvar/publicar.
- Preview real do curriculo antes de salvar/publicar/gerar PDF.
- Drag and drop com `dnd-kit` para:
  - reordenar secoes do portfolio;
  - reordenar secoes do curriculo;
  - reordenar itens dentro de secoes quando aplicavel.
- Estados de versao:
  - draft;
  - published;
  - archived;
  - current public;
  - current resume default.
- Comparacao de versoes em etapa futura.
- Barra de publicacao com impacto claro: "alteracoes que vao para o site", "alteracoes apenas no rascunho".

Checkpoint testavel:

- Reordenar secoes do portfolio, ver preview, salvar, publicar e conferir landing publica.
- Reordenar curriculo, ver preview, gerar PDF e conferir leitura/selecionabilidade.

Progresso:

- Preview real ja existia nos dois builders (`PortfolioPreviewSection`/`ResumePreview`); convertido de cadeia `if/else` para registry declarativo (`Record<string, ...>`) em ambos, reduzindo duplicacao.
- `@dnd-kit/core`, `@dnd-kit/sortable` e `@dnd-kit/utilities` instalados (confirmado com o usuario). Criado `BuilderSortableList` em `components/ds/builder.tsx` com `PointerSensor` + `KeyboardSensor` (acessivel via teclado), substituindo os botoes `up/down` nos dois builders.
- Corrigido mismatch de hidratacao SSR do dnd-kit (`DndDescribedBy`) passando `id` estavel via `useId()` do React ao `DndContext`.
- Queries dos builders centralizadas: trocadas chaves ad-hoc (`["projects", "builder"]` etc., que nao eram invalidadas pelas mutations dos CRUDs) pelas `*ListQueryOptions()` canonicas de cada feature. Criado `custom-sections-queries.ts`, que nao existia.
- Verificado via automacao de navegador: drag real com mouse nao foi possivel simular fielmente (pointer capture nativo do dnd-kit), mas o pickup via pointer event sintetico disparou o anuncio de acessibilidade corretamente ("Picked up draggable item..."), confirmando o mecanismo. Recomenda-se validacao manual com mouse.

Progresso (2026-07-17, continuacao): drag and drop de itens dentro de uma secao.

- Achado antes de implementar: a ordem de `itemIds` (quando `selectionMode: "selected"`) era salva mas **ignorada** na renderizacao publica — `public-portfolio.service.ts` so filtrava os itens selecionados, preservando a ordem da propria colecao (`order`/`createdAt`). Corrigido: `filterItems` agora ordena os itens filtrados pela posicao deles em `section.itemIds`.
- Criado `BuilderSectionItemsPicker` em `components/ds/builder.tsx`: reutiliza `BuilderSortableList` para mostrar so os itens ja selecionados numa lista arrastavel ("Ordem de exibicao"), abaixo do checklist normal de selecao. So aparece quando ha 2+ itens selecionados.
- Trocado o bloco de checkboxes duplicado em `portfolio-builder-feature.tsx` e `resume-builder-feature.tsx` por esse componente unico.
- Testado via API direta (mais confiavel que simular drag): selecionei 3 projetos pela UI, salvei a versao, depois via `PUT /content-versions/:id` reordenei `itemIds` manualmente e confirmei via `GET /public/portfolio` que a ordem dos projetos no retorno publico mudou exatamente para a nova ordem. Sem erros de console durante o teste.
- "Comparacao de versoes" continua fora de escopo — ja estava marcada como etapa futura na decisao original do roadmap (resposta 13 das Perguntas Abertas: "sem diff visual" no versionamento inicial), nao e uma nova postergacao.
- Falta: estados de versao mais ricos (current public/current resume default).

### P4 - Editor De Conteudo Para Paginas, Secoes E Curriculo

Status: `in-progress`.

Objetivo: permitir criar paginas/secoes realmente trabalhadas, sem depender de campos simples.

Entregas:

- Editor Tiptap para rich text simples.
- Editor Markdown/MDX ou markdown estruturado para conteudos mais tecnicos.
- Sistema de variaveis com `{profile.name}`, `{project.title}`, `{skill.list}` ou similar.
- Insercao assistida de variaveis disponiveis via menu/autocomplete.
- Preview lado a lado.
- Blocos padronizados para pagina/secao:
  - texto;
  - callout;
  - lista;
  - galeria/imagem;
  - cards;
  - links;
  - stack/tecnologias.
- Validacao de conteudo publico antes de publicar.

Checkpoint testavel:

- Criar uma pagina customizada trabalhada, publicar e abrir rota publica.
- Criar uma secao customizada, exibir no portfolio e opcionalmente no curriculo.

Progresso (2026-07-17):

- Achado importante antes de implementar: apesar de `contentFormat` ja ter a opcao `"html"`, nada renderizava HTML de fato — `/p/[slug]` mostrava texto cru e o gerador de PDF (`resume-pdf.generator.ts`) so entende a convencao `**negrito**` em texto puro.
- Instalado Tiptap (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`), confirmado com o usuario.
- Criado `components/ds/rich-text-editor.tsx`: editor controlado com toolbar (negrito, italico, H2/H3, listas, citacao, link, desfazer/refazer), adaptando o padrao de agrupamento/separadores do particle Coss `p-toolbar-1` para os primitivos locais (`Button` ghost), sem instalar `@base-ui/react`.
- Criado `components/ds/html-content.tsx`: renderer publico com sanitizacao basica (remove `script/style/iframe/object/embed`, atributos `on*` e URIs `javascript:`/`data:`/`vbscript:`) antes do `dangerouslySetInnerHTML`.
- Adicionado `FormFields.HtmlEditor` (via `Controller`, HTML persistido) SEM alterar `FormFields.RichTextField` (Textarea + convencao `**bold**`), para nao quebrar os consumidores que ainda esperam texto puro.
- Escopo desta rodada, deliberadamente limitado: `PageForm` e `CustomSectionForm` usam o novo `HtmlEditor`; `/p/[slug]` e `CustomSectionsSection` (portfolio publico) renderizam via `HtmlContent`. `ProfileForm` (resumo/objetivo) e `ProjectForm` (descricao) continuam em `RichTextField` (`**bold**`) porque alimentam o gerador de PDF do curriculo, que ainda nao entende HTML.
- Falta: sistema de variaveis (`{profile.name}` etc.), blocos padronizados, importacao de Markdown, e — se quisermos HTML tambem em perfil/projeto — atualizar `resume-pdf.generator.ts` para converter HTML em spans de PDF.

Progresso (2026-07-17, continuacao): sistema de variaveis, bloco Callout e import Markdown.

- Criado `packages/contracts/src/content-variables.ts`: registry compartilhado `CONTENT_VARIABLES` (`profile.name`, `profile.headline`, `profile.email`, `profile.phone`, `profile.website`, `profile.github`, `profile.linkedin`, `year`), usado tanto no menu do editor quanto (implicitamente, pelas mesmas chaves) na resolucao no backend.
- Criado `apps/api/src/shared/content/render-template.ts`: `renderTemplateVariables(html, { profile })` substitui `{chave}` por valor real; chave desconhecida fica intacta (nao quebra o texto). Aplicado em `pages.service.ts` (`findPublished`, usado por `/p/[slug]`) e `public-portfolio.service.ts` (conteudo das secoes customizadas).
- Adicionado `<select>` na toolbar do `RichTextEditor` para inserir variavel no cursor (`editor.chain().focus().insertContent(...)`).
- Instalado `marked` (confirmado com o usuario) para o botao "Importar Markdown": abre um textarea inline na propria toolbar, converte com `marked.parse()` e substitui o conteudo do editor. Limitacao conhecida: titulos H1 do markdown viram paragrafo simples, porque o StarterKit esta configurado só com niveis H2/H3 (nao ha bug, e a configuracao de heading do editor).
- Criado bloco padronizado **Callout**: `components/ds/rich-text-callout-extension.tsx`, um Node customizado do Tiptap (`content: "block+"`, `toggleWrap`) com botao proprio na toolbar. Estilizado tanto no editor (`rich-text-editor.tsx`) quanto na renderizacao publica (`html-content.tsx`) via seletor `[data-callout]`.
- Testado via automacao: insercao de variavel, toggle de Callout e import Markdown confirmados manipulando o DOM/editor diretamente (clique via coordenada de tela local se mostrou nao confiavel de novo, mesma limitacao ja registrada no P3). Substituicao de variavel testada de ponta a ponta via API: `{profile.name}` -> "Kaesyo Felix", `{year}` -> "2026", `{profile.notreal}` (desconhecida) manteve-se intacta.
- Achado incidental (fora de escopo, sinalizado como task separada): `updateCustomSectionRequestSchema` usa `.partial()` sobre um schema com `.default()` em `status` — um PUT que omite `status` reseta a secao para `draft` mesmo se estava `published`. Nao afeta o formulario real (sempre envia o objeto completo), mas e uma armadilha para chamadas parciais futuras.
- Ainda faltam (fora de escopo desta rodada, tamanho grande o suficiente pra ser rodada propria): blocos de galeria/imagem, cards e stack/tecnologias (precisam integrar upload); preview lado a lado do editor; validacao formal de conteudo publico antes de publicar; MDX estruturado.

### P5 - Usuarios, Auth E Permissoes

Status: `in-progress`.

Objetivo: evoluir de admin unico para multiusuario controlado.

Entregas:

- Tela de usuarios.
- Cadastro/convite de usuario.
- Tela de profile do usuario logado.
- Esqueci senha/recuperacao.
- Roles e permissoes visuais integradas ao `can()`.
- `AuthGuard` e `Can` documentados no design system.
- Guards backend revisados para todos os modulos.
- Auditoria simples de acoes administrativas em etapa futura.

Checkpoint testavel:

- Criar usuario editor, limitar permissoes e validar no front e backend.

Progresso (2026-07-17):

- Contracts: `packages/contracts/src/user.ts` com `UserDto`, `USER_ROLES` (owner/admin/editor/viewer) e `ROLE_PERMISSION_PRESETS` (cada papel mapeia para um conjunto fixo de permissoes `modulo:acao`). `ensureAdminUser` (backend) passou a usar `ROLE_PERMISSION_PRESETS.owner` em vez de lista hardcoded, corrigindo uma lacuna: o owner nao tinha `users:*` antes desta mudanca.
- Backend: modulo `users` completo (`GET/POST/PUT/DELETE /users`), guardado por `requirePermission`. Regras de seguranca: usuario nao pode excluir a propria conta nem o unico `owner`.
- Backend: recuperacao de senha com Resend (`POST /auth/forgot-password`, `POST /auth/reset-password`) e troca de senha autenticada (`POST /auth/change-password`). Token de reset e hash SHA-256 com expiracao de 1h; resposta de forgot-password e sempre 204 (evita enumeracao de email). `shared/email/resend-client.ts` faz no-op com `console.warn` quando `RESEND_API_KEY` nao esta configurado, para nao quebrar o fluxo em dev.
- Frontend: `/admin/users` (CRUD com papel via `Select`, sem editar email depois de criado), `/admin/account` (dados da conta + trocar senha, distinto do `/admin/profile` que e conteudo do portfolio), `/forgot-password` e `/reset-password` (com estado de link invalido quando falta o token).
- Testado manualmente: criar usuario editor, excluir usuario, fluxo forgot-password (mensagem generica sempre exibida), reset-password sem token (mostra aviso), change-password na conta do dev-admin. Sem erros de console em nenhuma tela.
- Pendente do usuario: criar conta em resend.com e definir `RESEND_API_KEY`/`RESEND_FROM_EMAIL` em `.env` para o email realmente ser entregue (ver `.env.example` e `render.yaml`).
- Fora do escopo desta rodada (fica para depois): tela de convite por email (hoje o owner/admin cria o usuario direto com senha inicial, sem fluxo de convite), auditoria de acoes administrativas, permissoes granulares por campo sensivel.

### P6 - Refinamento E Hardening

Status: `in-progress`.

Objetivo: remover friccoes, inconsistencias e estados quebrados.

Entregas:

- Estados de loading com skeletons reais.
- Estados de erro recuperaveis.
- Empty states com acao principal.
- Tratamento de imagens em todos os lugares via composicao com `next/image`.
- Acessibilidade:
  - foco visivel;
  - aria em drawers/dialogs;
  - navegacao por teclado;
  - contraste.
- Responsividade de admin em telas menores.

Checkpoint testavel:

- Passar por todos os fluxos principais sem dados, com dados e com erro simulado.

Progresso (2026-07-17):

- Auditoria encontrou: exclusao imediata sem confirmacao em **todas** as tabelas (projects, skills, experiences, pages, users) e na lista de custom-sections; nenhum tratamento de `isError` fora de `projects-table.tsx`; nenhum `<img>` cru fora de `next/image`/`AsyncImageFrame` (nada a migrar ali).
- Adicionado `ConfirmDialog` (ja existia como componente, so nao era usado) antes de toda mutation de exclusao em `projects-table.tsx`, `skills-table.tsx`, `experiences-table.tsx`, `pages-table.tsx`, `users-table.tsx` e `custom-sections-feature.tsx`. Padrao: estado `pendingDelete`, dialogo com titulo/descricao especifico do item, `loading` ligado ao `isPending` da mutation.
- Adicionado `ErrorState` (`components/ds/admin-primitives.tsx`) nas 5 tabelas que nao tratavam `isError`; `custom-sections-feature.tsx` tambem ganhou `EmptyState` real no lugar do texto solto.
- `users-table.tsx` manteve a regra de nao permitir excluir a propria conta (botao fica desabilitado, sem nem abrir o dialogo).
- Falta: skeletons de loading reais (hoje e so texto "Carregando..."), acessibilidade (foco visivel, aria em drawers/dialogs, navegacao por teclado), contraste e responsividade do admin em telas menores. Verificacao final no navegador (clicar excluir/cancelar/confirmar de ponta a ponta) ficou pendente.

Progresso (2026-07-17, continuacao): skeletons, foco visivel, aria/teclado e responsividade.

- `DataTable` (`components/datatable/data-table.tsx`) ganhou prop `isLoading`: mostra linhas skeleton (barras pulsantes) em vez do texto "Carregando..." nas 5 tabelas que usam o componente (projects, skills, experiences, pages, users).
- Foco visivel padronizado: `Input`, `Textarea` e os `<select>` nativos (form-fields, projects-table, portfolio-builder, resume-builder) ganharam `focus-visible:ring-2` igual ao `Button`/`Checkbox`, que ja tinham. Antes, Input/Textarea so mudavam a cor da borda no foco (mais fraco como indicador visivel).
- Auditoria de aria/dialogs: unico dialog do admin e o `ConfirmDialog` (Base UI `AlertDialog`), que ja tem foco preso e aria corretos por construcao. `Drawer` (vaul) so e usado no portfolio publico, fora do escopo do hardening do admin.
- Navegacao por teclado: confirmado por revisao de codigo que todo elemento interativo do admin e HTML semantico nativo (`button`, `a`, `input`, `select`) em ordem de DOM logica, sem `tabIndex` manual nem divs fingindo ser botao. Nao ha reset global de `outline` em `globals.css`, entao o foco padrao do navegador funciona nos links de navegacao. Teste ao vivo de `Tab` real via automacao de navegador nao foi possivel simular de forma confiavel (mesma limitacao ja registrada com dnd-kit) — fica valendo a revisao de codigo mais o foco visivel reforcado acima.
- Responsividade mobile (375px): testado `/admin/skills` e `/admin/portfolio-builder`. Achado um problema real: `DataTable` usava `overflow-hidden` no wrapper, entao em telas estreitas a coluna "Acoes" (Editar/Excluir) ficava cortada e inacessivel, fora da tela. Corrigido para `overflow-x-auto` com `min-w-[640px]` na tabela, garantindo scroll horizontal em vez de conteudo cortado. Builders (`BuilderLayout`) ja empilham corretamente em telas pequenas (grid so vira duas colunas a partir de `lg:`).
- Fora de escopo (fica para o refino visual formal, P0/P1): auditoria de contraste WCAG numerica, redesign visual dos estados.

## Ordem Recomendada De Execucao

Reordenado pelo usuario em 2026-07-17 (substitui a ordem original abaixo). Cada fase ja tem uma primeira fatia testavel feita; a ordem agora e sobre qual fase aprofundar a seguir:

1. **P3** - Builders com preview real e drag and drop (drag and drop de itens dentro de secao, comparacao de versoes).
2. **P4** - Editor de conteudo (sistema de variaveis, blocos padronizados, import Markdown).
3. **P6** - Refinamento e hardening (skeletons, acessibilidade, contraste, responsividade).
4. **P5** - Usuarios, auth e permissoes (convite por email, auditoria, permissoes granulares).
5. **P0 + P1** - Base visual do admin e sistema de formularios (refinamento visual, deixado por ultimo de proposito).

Ordem original (historico, ja executada em boa parte):

1. Criar base visual admin + atualizar `/admin/design-system`.
2. Criar componentes DS de formulario e refatorar `ProjectForm`.
3. Criar `DataTableFrame` e refatorar `ProjectsTable`.
4. Melhorar `PortfolioBuilder` com preview real e dnd-kit.
5. Melhorar `ResumeBuilder` com preview real, dnd-kit e PDF.
6. Implementar Tiptap/RichText/Markdown para paginas e secoes.
7. Criar usuarios, profile, cadastro e esqueci senha.
8. Aplicar padroes aos demais CRUDs.
9. Hardening de estados, acessibilidade e responsividade.

## Dependencias Provaveis

Instalar somente com confirmacao explicita:

- `@tiptap/react`, `@tiptap/starter-kit` e extensoes necessarias.
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Possivel combobox/autocomplete via componente shadcn baseado em `cmdk` ou alternativa ja adotada.
- Possivel editor markdown se Tiptap nao cobrir paginas/secoes tecnicas.

## Perguntas Abertas

Todas respondidas em 2026-07-16:

1. Admin mantem navegacao superior com grupos.
2. Wizards apenas para entidades complexas.
3. Tiptap salva HTML string; Markdown pode ser importado e convertido.
4. Paginas/secoes usam blocos padronizados.
5. Preview do portfolio usa componentes reais da landing com dados em memoria.
6. Preview do curriculo deve ser fiel ao PDF final.
7. Drag and drop reordena secoes e itens internos.
8. Usuarios podem vir por cadastro publico e convite admin, com controle de solicitacao.
9. Recuperacao de senha com MVP simples.
10. Roles iniciais: `owner`, `admin`, `editor`, `viewer`.
11. Permissoes por acao e campo sensivel quando necessario.
12. Anexos/galerias ficam para depois, exceto bloco de media simples.
13. Versionamento inicial lista, visualiza e publica/restaura, sem diff visual.
14. Design system tera docs MD para IA e tela para usuarios.

## Regra De Retomada

Se o contexto da conversa acabar:

1. Ler `PROJECT.md`.
2. Ler `DESIGN.md`.
3. Ler este arquivo.
4. Verificar `/admin/design-system`.
5. Continuar pela menor fase pendente com checkpoint testavel.

**Retomada especifica do redesign (2026-07-17):** antes de escrever qualquer componente React novo para nav/dashboard/tabelas/builders, abrir `docs/design-references/admin-redesign-direction.html` e `docs/design-references/admin-redesign-pages.html` no navegador (arquivos estaticos, sem servidor) e ler a secao "Direcao Confirmada Para O Redesign (2026-07-17)" em `docs/admin-visual-references.md`. Ha perguntas em aberto registradas la (grade vs tabela como padrao unico em Projetos/Skills, preview em janela/papel) que devem ser respondidas com o usuario antes de implementar. A navegacao top nav estilo Vercel/Supabase esta bloqueada ate o usuario enviar uma imagem de referencia.
