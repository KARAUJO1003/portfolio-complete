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
- Criados `PageFrame`, `ActionBar`, `Toolbar`, `EmptyState`, `LoadingState` e `ErrorState`.
- `/admin/design-system` passou a demonstrar Admin UX, formularios e tabela frame.

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

### P3 - Builders Com Preview Real

Status: `pending`.

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

### P4 - Editor De Conteudo Para Paginas, Secoes E Curriculo

Status: `pending`.

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

### P5 - Usuarios, Auth E Permissoes

Status: `pending`.

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

### P6 - Refinamento E Hardening

Status: `pending`.

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

## Ordem Recomendada De Execucao

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
