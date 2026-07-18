# Admin - Referencias Visuais

## Objetivo

Registrar a direcao visual do admin a partir de referencias fornecidas pelo usuario em 2026-07-16 e 2026-07-17.

As referencias foram traduzidas em principios e regras aplicaveis. Nada de codigo, asset, copy ou marca das referencias deve ser reproduzido. Ver skill `reference-safe-redesign`.

## Direcao Confirmada Para O Redesign (2026-07-17)

O usuario aprovou uma composicao propria (nao copiada de nenhuma referencia) construida para calibrar a direcao antes de implementar.

**Arquivos vivos (fonte de retomada, nao depende de sessao/conta do artifact):**

- `docs/design-references/admin-redesign-direction.html` — nav superior, dashboard bklit, tabela ReUI/Coss, matriz de formulario. Abrir direto no navegador (arquivo estatico, tema claro/escuro e variante A/B funcionam via botao).
- `docs/design-references/admin-redesign-pages.html` — Projetos (grade/tabela), Skills (grade/lista), Portfolio Builder (preview em janela) e Curriculo Builder (preview em folha). Toggle grade/tabela funcional.

Essas duas paginas HTML sao a referencia visual oficial do redesign do admin. Qualquer implementacao futura de nav, dashboard, listagens ou builders deve abrir esses arquivos primeiro.

**Decisoes tomadas em 2026-07-17 (perguntas 1-3 fechadas):**

1. **Projetos/Skills - visao de listagem** (usuario delegou a decisao pela quantidade/tipo de informacao):
   - **Projetos**: manter toggle grade/tabela. Cover (imagem) e parte central da identidade do projeto, entao a grade importa para leitura visual; a tabela cobre gestao densa (status, tags, likes, ordem). Os dois casos de uso justificam as duas visoes.
   - **Skills**: fixar em tabela, sem toggle. Campos sao texto puro (nome, categoria, data, visibilidade, ordem), sem imagem, volume tende a ser maior por categoria - grade nao agrega nada aqui, tabela densa e suficiente.
2. Preview em "janela de navegador" (Portfolio Builder) e "folha de papel branca mesmo no dark mode" (Curriculo Builder): **confirmado, manter como esta** nos mockups.
3. Depois de fechar Projetos, Skills, Portfolio Builder e Curriculo Builder, seguir para Experiencias, Paginas, Secoes e Usuarios com o **mesmo processo** (mockup HTML -> aprovacao -> so entao codigo).
4. Navegacao (top nav estilo Vercel/Supabase) segue **bloqueada** ate o usuario mandar a imagem de referencia.

Decisoes fechadas a partir dessa composicao:

- **Cor**: variante A confirmada - monocromia por padrao. Badge de variacao (`+11,8%` etc.) e o unico lugar com fundo/texto colorido (`--success`/`--danger` sobre fundo suave, nao solido). Nav ativo, tags e sparklines continuam em tons neutros (`--foreground`/`--foreground-muted`). Isso reforca, nao substitui, o principio "Monocromia Por Padrao, Cor Como Sinal" ja registrado abaixo.
- **Dashboard**: direcao bklit confirmada - `KPI` com numero grande + rotulo caps + sparkline sem eixo (`stroke` neutro, sem grade own) e um painel de area maior com gradiente monocromatico e grade pontilhada discreta. Serve de alvo para os `StatTile`/`StatGrid` existentes e para os novos graficos.
- **Tabelas/listagens**: direcao ReUI Analytics confirmada - celula composta (miniatura + titulo + subtitulo), status por ponto colorido (`--dotc` semantico), tags como chips discretos, e coluna de tendencia com sparkline inline em vez de numero solto sem contexto.
- **Frame da tabela (2026-07-17, referencia Coss)**: usuario trouxe exemplo visual (tabela de voos com frame, checkbox, ordenacao por coluna, badge de status colorido, paginacao "Viewing X-Y of Z" no rodape do frame) e pediu que a barra de busca/filtros fique **fora** do frame, no topo. Confirmado lendo o JSON dos particles: `p-table-8` (`CardFrame` + `TableHeader` sortavel + `TableBody` + `CardFrameFooter` com paginacao) nao tem toolbar embutida - o frame cobre só tabela+paginacao. `p-toolbar-1` confirma o principio de composicao (barra solta, fora de qualquer frame), mas seu conteudo (alinhamento/formatacao de texto) nao serve de conteudo, so de padrao estrutural; a barra de busca/filtro real do `DataTableFrame` deve montar o conteudo a partir de particles de busca/filtro (`p-input-group-20` busca com icone, `p-group-23` filtro com combobox e botao remover, `p-select-14` select de status com dot colorido). Correcao necessaria no mockup do artifact `admin_redesign_direction`: lá a busca ficou dentro do `table-wrap`; na implementacao real ela deve ser um elemento irmao acima do `CardFrame` da tabela, nao um filho dele.
- **Estrategia de formulario**: matriz por tipo de entidade, nao por tela isolada - inline na pagina (Perfil/Conta, entidade unica), Sheet lateral no desktop (formularios simples, poucos campos, sem aside/preview, precisa ver a lista atras), Drawer bottom (Skills/itens rapidos no mobile, **e tambem formularios ricos com muitos campos + aside/preview lateral no desktop, como Projetos** - o Sheet fica estreito demais para o layout de 2 colunas do form + preview; o drawer bottom usa a largura toda), Dialog central (confirmacoes/troca de status, nunca edicao extensa). Isto substitui a ideia antiga de formulario sempre inline na tela.
- **Correcao 2026-07-17 (feedback do usuario ao implementar Projetos)**: `ProjectForm` (steps + preview aside) foi implementado com `Drawer` bottom (`components/ui/drawer.tsx`, ja existente, vaul), nao Sheet lateral. Regra pratica: se o formulario tem aside/preview (layout 2 colunas), usar Drawer bottom; Sheet lateral fica para formularios de coluna unica. `components/ui/sheet.tsx` foi criado (Base UI Dialog adaptado, ver `docs/ui-primitives.md`) e continua disponivel para esses casos mais simples, mas ainda sem uso real no admin.
- **Navegacao**: estrutura de grupos (Base, Conteudo, Publicacao, Sistema) confirmada como valida; o comportamento fino de overflow/dropdown top nav (estilo Vercel/Supabase, sem sidebar, sem scroll de menu) continua **pendente da imagem de referencia do usuario** antes de qualquer implementacao.
- **`/admin/design-system`**: deve evoluir para parecer com essa composicao (tokens, tipografia, dashboard, tabela, formularios documentados no mesmo padrao visual). Fica marcado como alvo futuro; nao mexer nele agora por pedido explicito do usuario.

## Tema Shadcn "Mira" No Admin (2026-07-17)

O usuario customizou um preset no shadcn theme editor (`https://ui.shadcn.com/create?preset=b5KHpmTxo`, estilo "Mira", base color neutral) e pediu para trazer as cores neutras (background/card/popover/muted/input) e a densidade dos componentes desse preset para o admin, **sem afetar o portfolio publico**.

**Por que nao rodar `pnpm dlx shadcn@latest apply --preset b5KHpmTxo` direto no projeto:** testado numa copia isolada (fora do repo) antes de qualquer decisao. O resultado provou ser destrutivo:

- Injeta um bloco `.dark { ... }` com todas as cores shadcn. O projeto usa `next-themes` com `defaultTheme="dark"` (`src/providers/root-providers.tsx`), entao `<html>` ja recebe `class="dark"` por padrao; hoje isso e inofensivo porque `globals.css` nunca definia `.dark`. Assim que o preset adicionasse esse bloco, `.dark` (mais especifico que `:root`) sobrescreveria as cores **no site inteiro**, portfolio incluso.
- Reescreve `:root` como tema claro e move o escuro para `.dark`, invertendo a arquitetura atual (`:root` = escuro padrao, `.light` = override).
- O estilo "Mira" completo (`style: "radix-mira"`, confirmado no `components.json` gerado pela copia isolada) e construido sobre **Radix UI**, nao Base UI — direto contra a decisao ja registrada em `docs/ui-primitives.md` (Base UI e o primitivo padrao deste projeto).

**O que foi feito em vez disso:** os valores exatos (paleta oklch do tema dark/light do Mira, alturas/paddings do `button`/`input`/`card` do Mira) foram extraidos na copia isolada (ja destruida) e portados a mao para as convencoes existentes do projeto — igual ja e feito com particles do Coss.

**Mecanismo — escopo por classe `.admin-shell`:** `components/ds/admin-primitives.tsx`, `components/ds/page.tsx`, `components/ds/form.tsx`, `components/ui/button.tsx`, `components/ui/input.tsx` e `components/ui/card.tsx` sao consumidos so pelo admin (confirmado via grep: zero uso em `features/portfolio`). Mas o portfolio usa as mesmas classes utilitarias compartilhadas (`bg-background`, `bg-card`, `border-border` etc.) direto em componentes proprios — entao os **valores** dessas variaveis nao podiam mudar em `:root`. A solucao foi uma classe wrapper `.admin-shell` em `globals.css` (com par `.light .admin-shell` para o toggle claro/escuro do admin continuar funcionando) que redefine so os tokens de superficie (background, card, popover, muted, border, input, ring, surface*, primary*, secondary), escopada em `AdminShell` (`components/layout/admin-shell.tsx`) e nas paginas `/login`, `/forgot-password`, `/reset-password`. Tokens semanticos (`--success`/`--warning`/`--danger`/`--primary-accent`) ficam de fora de proposito: graficos do admin continuam monocromaticos (principio 4 abaixo).

Como os componentes ja consomem `var(--card)` etc. via as classes Tailwind ja registradas em `@theme inline`, o cascade CSS resolve tudo sozinho — nao foi preciso tocar em JSX de `components/ds` para as cores, so escopar a definicao em `globals.css`.

**Densidade:** decisao do usuario foi ficar fiel ao Mira (28-32px), nao um meio-termo. `button.tsx` e `input.tsx` foram redimensionados para `h-7` (28px) mantendo a arquitetura atual (sem trocar `asChild`/`cloneElement` por Radix `Slot`, sem CVA). `card.tsx` e `admin-primitives.tsx` (PageFrame/Toolbar) tiveram padding reduzido de `p-5`/`px-5 py-4` para `p-4`/`px-4 py-3.5`.

**Pendente (fase 2, fora de escopo da primeira passada):** aplicar a mesma densidade em `table.tsx`, `textarea.tsx`, `checkbox.tsx`, `badge.tsx` e `form.tsx` (FormSection/FormActions/FormAside).

### Bug Corrigido: Portal Escapa Do Escopo `.admin-shell` (2026-07-17)

`Drawer` (vaul) e `AlertDialog`/`ConfirmDialog` (Base UI) usam Portal, que por padrao anexa direto em `document.body` — fora da `div.admin-shell`. O cascade de CSS custom properties nao atravessa essa borda, entao esse conteudo caia de volta nos tokens antigos de `:root` mesmo depois do escopo Mira estar aplicado (usuario flagrou visualmente: drawer e confirm dialog com cores diferentes do resto do admin).

**Correcao:** hook `useAdminThemeScope` (`hooks/use-admin-theme-scope.ts`) adiciona a classe `admin-shell` tambem em `document.body` enquanto o componente que o chama esta montado (e remove ao desmontar). Como portais anexam como filhos de `body`, `body` vira ancestral deles e o cascade passa a funcionar. Chamado em `AdminShell` e nos 3 forms de auth (`LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`). Qualquer novo componente-raiz de admin (fora desses) que precise do tema Mira em conteudo portalizado deve chamar esse hook tambem.

### Padrao De Formulario Em Drawer: Acao Principal No Header Como Toolbar (2026-07-17)

Referencia consultada por pedido explicito do usuario: `https://reui.io/components/field` (composicao de campo limpa: label + control + description + error, ver componente oficial shadcn `Field`) e `https://reui.io/blocks/application/form` (formularios reais como "Create invoice" e "API Keys", onde a acao principal fica no header, ao lado do fechar, nao numa barra flutuante no rodape).

Problema encontrado: `DrawerHeader` tem `text-center` embutido por padrao (pensado para bottom-sheet mobile) e o form usava uma `FormActions` flutuante (`sticky bottom-4`, pill com blur) no rodape, competindo visualmente e desalinhada do resto do conteudo (alinhado a esquerda).

**Padrao adotado para forms dentro de Drawer** (`ProjectForm`/`ProjectsFeature`, `SkillForm`/`SkillsFeature` sao a referencia de implementacao):

- `DrawerHeader` usa `flex-row items-start justify-between text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left` (cancela o `text-center` padrao do componente base).
- O botao de acao principal (`Criar X` / `Salvar alteracoes`) fica **no header**, ao lado do botao fechar (X) — nao mais dentro do form. Implementado via atributo HTML nativo `form="<id>"` no botao (fora da arvore DOM do `<form>`) apontando para um `id` fixo exportado pelo componente de form (ex.: `PROJECT_FORM_ID`, `SKILL_FORM_ID`), que e passado para `<DsForm id={...}>`.
- O form expõe o estado de salvamento via prop `onPendingChange?: (pending: boolean) => void` (chamado num `useEffect` a partir de `mutation.isPending`), e o componente pai (`*Feature`) guarda esse estado (`saving`) para desabilitar o botao do header e trocar o label ("Salvando...").
- O form em si nao renderiza mais botoes de acao (`FormActions` removido desses dois forms); mantem so `FormError` quando a mutation falha.
- `DrawerClose` (X) e o unico "cancelar" — nao ha mais botao "Cancelar" separado, seguindo o padrao das referencias.

Isto substitui a barra `FormActions` flutuante **apenas para forms dentro de Drawer**. Forms inline em pagina propria (Perfil, Experiencias, Paginas, Secoes — sem Drawer) continuam usando `FormActions` no rodape normalmente; nao foram revisados nesta passada.

### `FormSection` Sem Card (2026-07-17)

Feedback do usuario com print anotado: nao gosta de card em volta de cada secao de formulario, nem de titulo+descricao empilhado dentro de outro titulo+descricao (o `DrawerHeader` ja mostra titulo+descricao do form; a antiga `FormSection` repetia o mesmo padrao em caixa logo abaixo, parecendo caixa-dentro-de-caixa). Card so se justifica em parte especifica pra dar destaque (ex.: `FormPreviewFrame`/`FormAside` do preview lateral, que continua com borda — e um elemento visualmente distinto de proposito, nao uma secao de campos).

Confirmado contra `https://reui.io/blocks/application/form` (bloco "Business Verification"): um unico container guarda varias subsecoes (`Business Details`, `Public Details`, `Customer Support Information`), cada uma so com label em negrito + descricao pequena + campos, separadas por divisor fino (`border-t`) — nunca uma caixa individual com fundo/borda por subsecao.

`FormSection` (`components/ds/form.tsx`) mudou de `rounded-xl border border-border bg-card p-4` para `border-t border-border pt-5 first:border-t-0 first:pt-0` (sem fundo, sem borda ao redor, primeira secao sem divisor). Testado em Projetos e Skills.

### Portfolio Builder E Curriculo Builder Concluidos (2026-07-17)

- **Portfolio Builder**: preview ganhou chrome de "janela de navegador" (`BuilderBrowserBar`, novo em `components/ds/builder.tsx`) — 3 pontos em escala de cinza (nao vermelho/amarelo/verde de macOS, mantem monocromia) + barra de URL mono mostrando `env.appUrl` (domain real, nao hardcoded). Conforme `docs/design-references/admin-redesign-pages.html` (`.browser-frame`/`.browser-bar`).
- **Curriculo Builder**: preview ja tinha a base do conceito de folha de papel (`<article>` A4 em px reais, `bg-white`); ajustado para bater com `docs/design-references/admin-redesign-pages.html` (`.paper-wrap`): tray usa `bg-surface-muted` (token de tema, nao `bg-neutral-200` fixo) para ficar escura no dark mode e clara no light mode, com a folha branca sempre por cima; folha ganhou `rounded-sm` e uma borda fina de 1px na base (`shadow-[0_1px_0_var(--border)]`) em vez de sombra difusa, seguindo o principio "borda, nao sombra".
- Selects nativos de versao/template em ambos os builders corrigidos de `h-10` para `h-7`/`bg-input/20` (densidade Mira, ja aplicada em Projetos/Skills).

### Menu Do Admin: User Menu Com Avatar (2026-07-17)

Pedido do usuario: revisar o admin do zero, tela a tela na ordem do menu, comecando pelo proprio menu. Referencia consultada: `https://reui.io/blocks/application/navbar` (13 variantes revisadas via `/preview/base/navbar-N`). `navbar-4` (logo + busca + New/notificacao/avatar) trouxe o padrao usado: **avatar com dropdown de conta** (nome/email, Profile, Inbox, Settings, Theme inline, Sign Out com separador antes). As variantes com nav agrupado em pills (`navbar-11`) confirmaram que a estrutura atual de grupos (Base/Conteudo/Publicacao/Sistema) ja e adequada para a quantidade de paginas do admin (mais rica que um simples tab-set flat) — nao foi substituida.

**Problema relatado pelo usuario:** sentia falta do botao de "Sair" — ele so aparecia quando `env.authEnabled` era `true`, entao sumia no ambiente de dev (auth desligada).

**Implementado:**
- Novo primitivo `components/ui/menu.tsx`, adaptado do particle `@coss/menu` sobre `@base-ui/react/menu` (Menu, MenuTrigger, MenuPopup, MenuGroup, MenuItem, MenuLinkItem, MenuSeparator — sem checkbox/radio/submenu, nao usados ainda). Popup usa `bg-card`/`border-border` (o projeto nao tem tokens `--popover`/`--accent`/`--destructive`); item destacado usa `bg-muted`; variante `destructive` usa `text-danger`.
- Novo `components/layout/user-menu.tsx`: avatar com iniciais reais do usuario logado (`useAuth().user.name`, nao mais "KA" hardcoded), abre menu com nome/email, "Minha conta", "Site publico", toggle de tema inline (substituindo o antigo `ThemeToggle` solto no header) e "Sair" (variant destructive, **sempre visivel**, sem gate de `env.authEnabled`).
- `AdminShell` simplificado: a fileira solta de botoes (ThemeToggle + link + Sair condicional) virou uma unica `<UserMenu />`.
- Testado: abrir menu, alternar tema (paleta Mira responde corretamente em ambos os modos), navegar para Minha conta/Site publico, Sair redireciona para `/login`. Sem erros de console.

**Nao mexido nesta passada:** comportamento em mobile (viewport estreito), imagem de referencia Vercel/Supabase para top nav segue pendente do usuario.

### Revisao Tela A Tela Pela Ordem Do Menu (2026-07-17 em diante)

Decisao do usuario: revisar o admin do zero, na ordem do menu (Inicio, Perfil, Minha conta, Projetos, Habilidades, Trajetoria, Paginas, Secoes, Curriculo, Portfolio, Usuarios, Design system). Projetos/Skills/Portfolio Builder/Curriculo Builder ja cobertos nas secoes acima.

- **Inicio (`features/admin/components/admin-dashboard.tsx`)**: os 4 `StatusCard` ad-hoc (Card com CardHeader/CardContent) viraram `StatGrid`/`Stat` (`components/ds/stat-grid.tsx`), o componente bklit que ja existia no design system mas nao era usado aqui — um frame so com divisorias internas em vez de 4 cards soltos. Removido o botao "Sair" duplicado (agora vive so no `UserMenu`). Corrigido `hover:border-zinc-500` (cor Tailwind crua, fora do sistema de tokens) para `hover:bg-surface-raised` em 2 lugares.
- **Perfil**: ja ficou correto so com o efeito cascata do fix de `FormSection` (secao unica "Dados pessoais" dentro do Card "Informacoes principais", sem card duplicado). Nenhuma mudanca adicional.
- **Minha conta (`features/account/components/change-password-form.tsx`)**: o `FormSection` interno ("Trocar senha") duplicava titulo/descricao do Card externo ("Senha"). Como e uma unica secao, removido o `FormSection` e mantidos so os campos.
- **Trajetoria, Paginas, Secoes customizadas**: mesma migracao mecanica de Projetos/Skills - listagem virou `DataTableFrame` (busca + filtro por tipo/status, badges de status/visibilidade) e formulario virou `Drawer` bottom com acao principal no header (`form="<id>"` + `DsForm id`, prop `onPendingChange`). `Secoes customizadas` nao tinha nem tabela de verdade antes (lista `<div>` a mao sem TanStack Table) - criado `custom-sections-table.tsx` novo seguindo o mesmo padrao das outras, incluindo o `Can` de permissao que faltava nas acoes.
- **Usuarios**: mesma migracao; botao "Novo usuario" mantido dentro de `<Can can={[USERS_PERMISSIONS.create]}>` (so quem pode criar usuario ve o botao). Campo de email somente-leitura (na edicao) corrigido de `h-10`/`px-3` para `h-7`/`px-2`.
- **Design system (`features/design-system/components/design-system-feature.tsx`)**: card "Botoes" ganhou as variantes que faltavam (Secundario/Outline/Destrutivo, so tinha Primario/Ghost). Painel "Formularios complexos" atualizado para descrever o padrao real (acao no header do Drawer, `FormSection` sem card) em vez do padrao antigo (`FormActions` com botao no rodape); input de exemplo corrigido de `h-10` para `h-7`. Legenda da secao "Tabelas" corrigida - dizia que a integracao com TanStack Table "entra na proxima etapa", mas todos os CRUDs ja usam. Nova secao "Menu" adicionada (nao existia nenhuma representacao do primitivo `Menu` na vitrine) com exemplo funcional (trigger, grupo, separador, item destructive).

Com isso, a revisao tela a tela pela ordem do menu (pedido do usuario) esta completa: Inicio, Perfil, Minha conta, Projetos, Habilidades, Trajetoria, Paginas, Secoes, Curriculo, Portfolio, Usuarios, Design system.

### Ajustes De Feedback Ao Vivo (2026-07-17, continuacao)

- **Cor do Textarea/RichTextEditor vs Input**: `textarea.tsx` usava `bg-background` (solido) enquanto `input.tsx` usa `bg-input/20` (translucido) - corrigido para o mesmo tratamento. `rich-text-editor.tsx` (container do Tiptap e o textarea do painel de import Markdown) tinha o mesmo problema, corrigido tambem.
- **Bug sistemico de tamanho de icone dentro de `Button`**: `components/ui/button.tsx` tinha `[&_svg]:size-3.5` - um seletor descendente que, por especificidade CSS, **sobrescrevia silenciosamente** qualquer `className="size-4"` escrito no icone pelo chamador (especificidade de seletor composto vence uma classe unica, independente da ordem no HTML). Isso forcava TODOS os icones dentro de `<Button>` no admin inteiro para 14px, nunca respeitando o `size-4` que varios call-sites ja tinham. Corrigido para `[&_svg]:size-4`, o padrao real do projeto. `MenuItem`/`MenuLinkItem` (`components/ui/menu.tsx`) ja tinham a mesma trava, mas ja apontavam pra `size-4` (correto). Alinhados tambem: icone do mega-menu (estava com `size-3.5` no JSX, mas o menu.tsx ja forcava pra 4 - so limpeza de codigo morto) e do `ViewToggle` (Grade/Tabela, sem Button por baixo, esse sim renderizava 3.5 de verdade).
- **`PageTitle`** (`components/ds/page.tsx`) reduzido de `text-3xl` (30px) para `text-2xl` (24px) - usuario achou grande demais depois da densidade Mira. Heros com override proprio (Inicio, Design system) reduzidos de `text-4xl` para `text-3xl` (continuam maiores que o titulo padrao de proposito, sao banners).
- **NumberStepper sem divisorias laterais**: o stepper de "Ordem" (Projetos/Skills/Trajetoria/Secoes) usava um `grid grid-cols-[40px_1fr_40px]` a mao, com `border-r`/`border-l` explicitos entre os botoes -/+ e o input - exatamente as "divisorias do lado" que o usuario nao queria. Criado `components/ui/number-field.tsx`, adaptado do particle `@coss/number-field` sobre `@base-ui/react/number-field` (sem `ScrubArea`, sem tamanhos sm/lg). O `NumberFieldGroup` tem uma unica borda envolvendo tudo; os botoes Decrement/Increment nao tem borda propria, so um `hover:bg-muted` - sem divisoria visual. `FormFields.NumberStepper` (`components/ds/form-fields.tsx`) migrado para usar esse componente.
- **Drawers bottom: `w-full` com conteudo `max-w` interno**: antes, cada feature colocava `mx-auto max-w-{X}` direto no `DrawerContent` - isso estreitava a folha inteira (bordas, cantos arredondados, tudo). Usuario pediu pra inverter: o Drawer fica `w-full` (o padrao real do primitivo `vaul`, ja e `inset-x-0`) e só o conteudo interno fica limitado. Criado `components/ds/drawer-form.tsx` (`DrawerFormShell`) - um wrapper reutilizavel que resolve isso numa unica implementacao (header + form + botao no toolbar + `max-w` interno via prop) em vez de repetir a estrutura em cada feature. Todas as 6 telas com Drawer (Projetos `max-w-5xl`, Skills/Trajetoria/Usuarios `max-w-2xl` default, Paginas/Secoes `max-w-3xl`) migradas para usar esse componente, reduzindo bastante o codigo de cada `*-feature.tsx`. Confirmado via DOM que o `DrawerContent` ocupa a largura total da viewport e o wrapper interno respeita o `max-w` configurado.

### Select Nativo Substituido Por Componente (2026-07-17, continuacao)

Pedido do usuario: "evite o uso de native select, utilize o componente do shadcn". Criado `components/ui/select.tsx`, adaptado do particle `@coss/select` sobre `@base-ui/react/select` (sem `useRender`/`mergeProps`, sem prop `items` - lista de opcoes so via `SelectItem` filhos, sem variantes de tamanho). Substituido em todos os pontos que usavam `<select>` nativo: `FormFields.Select` (status/tipo/papel em Projetos/Trajetoria/Paginas/Secoes/Usuarios), os 4 filtros de tabela (Projetos, Skills, Trajetoria, Paginas, Secoes), os selects de versao/template do Portfolio Builder e Curriculo Builder, e o "Inserir variavel" do `RichTextEditor`.

**Bug encontrado: Select nao abria dentro de um Drawer.** Dentro de qualquer `DrawerFormShell` (Projetos, Trajetoria, etc.), clicar no trigger nao abria o popup - `aria-expanded` ficava sempre `false`. Diagnostico (via instrumentacao de `onOpenChange` direto no componente, nao only console.log): o popup **abria e fechava sozinho ~60ms depois**, com `reason: "none"` disparado por um evento `focusin`. Causa raiz: `SelectPositioner` do Base UI tem `alignItemWithTrigger` (default `true`) - um comportamento estilo `<select>` nativo que tenta alinhar/focar o item selecionado exatamente sobre o trigger. Isso disputa foco com o focus-trap modal do `vaul` (Drawer): o foco tenta ir para o popup (portalizado em `document.body`, fora da subtree do Drawer), o trap do vaul redireciona de volta pro trigger, o `onFocus` do `SelectTrigger` ve `open && alignItemWithTriggerActiveRef.current` e fecha o popup (`SelectTrigger.js`, reason `REASONS.none`). Testado e descartado antes de achar a causa real: `data-vaul-no-drag` no trigger (resolve um problema diferente do vaul - `shouldDrag`/pointer capture, ver comentario no codigo - mas nao esse) e `modal={false}` no `Select.Root` (nao afeta o focus-trap de fora). **Fix real**: `alignItemWithTrigger={false}` no `SelectPositioner` (dentro de `SelectPopup`, em `select.tsx`) - vira um dropdown comum ancorado abaixo do trigger (side="bottom"/align="start", que ja era o estilo visual usado), sem a logica de alinhamento/foco que conflitava com o vaul.

Testado: abrir/selecionar em todos os Selects dentro de Drawer (Projetos, Trajetoria) e fora de Drawer (filtros de tabela, builders, RichTextEditor), criar+editar+excluir usando o novo Select, sem erros de console.

**Pendente para uma proxima fase** (nao pedido ainda, so registrado para retomada):
- Fase 2 de densidade: `table.tsx`, `textarea.tsx`, `checkbox.tsx`, `badge.tsx` e `form.tsx` (FormAside/FormPreviewFrame) ainda nao foram revisados para a densidade Mira (28px), so os componentes que ja tinham sido tocados (button/input/card/admin-primitives).
- Comportamento da nav mega-menu em mobile/viewport estreito nao foi testado.
- Imagem de referencia Vercel/Supabase para o estilo fino da top nav continua pendente do usuario.

### Nav Principal: Mega-Menu Por Grupo (2026-07-17)

Segunda parte do pedido do usuario ao revisar o menu: referencia `https://reui.io/preview/base/navbar-12` (padrao usado "para menus maiores onde passa o mouse e exibe um card com mais opcoes, como um agrupamento"). Cada grupo top-level abre, ao passar o mouse (ou clicar), um card com icone + titulo + descricao por link — em vez de pills soltas listando todos os links inline.

**Motivo pratico, alem do visual:** a nav antiga (todas as 12 paginas como pills, agrupadas visualmente mas todas visiveis) precisava de `overflow-x-auto` com scrollbar horizontal (visivel em quase todos os screenshots anteriores). Com 4 triggers de grupo (Base/Conteudo/Publicacao/Sistema) + logo + avatar, tudo cabe numa linha sem scroll em qualquer viewport razoavel.

**Implementado em `components/layout/admin-shell.tsx`:**
- Cada link ganhou `description` (uma linha) e `icon` (lucide) opcionais, alem de `href`/`label`.
- Grupo vira `<Menu>` com `<MenuTrigger openOnHover delay={150}>` (abre no hover, com pequeno atraso para nao disparar sem querer ao passar o mouse de raspao) + `<MenuPopup>` listando os links como `MenuLinkItem` (icone em caixa com borda + titulo + descricao).
- Trigger do grupo fica destacado (`bg-surface-raised`) quando a rota atual pertence aquele grupo, mesmo com o menu fechado — mantem orientacao.
- Marker `// <generated-admin-links>` preservado exatamente (usado por `scripts/generate-feature.mjs` para inserir novas rotas geradas); links gerados automaticamente nao tem `icon`/`description` ainda — o componente usa um icone generico (`FileTextIcon`) de fallback e simplesmente omite a descricao quando ausente, entao continuam funcionando sem quebrar.
- Testado: hover e clique abrem os 4 grupos corretamente, navegacao funciona, estado ativo do grupo funciona, sem erros de console.

## ReUI (2026-07-17)

Referencia adicional: https://reui.io/blocks. O usuario apontou o visual do ReUI como "exatamente o visual que eu gosto para o admin". ReUI e construido sobre shadcn/ui + Tailwind, compativel com Base UI (alinhado a decisao deste projeto, ver `docs/ui-primitives.md`). Registrado como MCP em `.mcp.json` (ver `docs/design-mcp-and-skills.md`); consultar seus blocks/primitivos como referencia visual e de padrao antes de criar componentes novos, adaptando ao design system local sem copiar codigo/asset diretamente.

## Leitura Das Referencias

As referencias mostram componentes de produto densos e escuros: cards de metrica, formularios curtos, listas de transacao, variaveis de ambiente, upload, empty states e graficos monocromaticos.

Qualidades que o usuario quer trazer: limpo, compacto, moderno, premium, com boa UX.

## Principios

### 1. Separacao Por Borda, Nao Por Sombra

O card fica apenas um degrau acima do fundo. A leitura de profundidade vem de uma borda de 1px, nao de sombra difusa.

- Evitar `shadow-lg`/`shadow-xl` em superficie de admin.
- Sombra no maximo como reforco sutil em popovers e dialogs.
- Contraste entre `--background` e `--card` deve ser pequeno e constante.

### 2. Densidade Alta

Admin e superficie operacional. O usuario precisa ver muita informacao sem rolar.

- Titulo de card: 14px semibold.
- Descricao: 13px em `--foreground-muted`, no maximo duas linhas.
- Padding de card: 16px (`p-4`), nao mais 20px.
- Espaco vertical entre campos: 12px a 16px.
- Altura de controle: 28px como padrao (`h-7`), atualizado em 2026-07-17 para casar com a densidade do preset shadcn "Mira" adotado (ver secao "Tema Mira" abaixo). Substitui o valor anterior de 36px.

### 3. Numero Como Protagonista

Quando o card comunica uma metrica, o numero domina e o rotulo se apaga.

- Valor em escala grande, peso alto, `--foreground`.
- Rotulo acima em 11px, caps, tracking largo, `--foreground-subtle`.
- Contexto/comparacao em 12px, discreto, ao lado ou abaixo.

### 4. Monocromia Por Padrao, Cor Como Sinal

Este e o ponto que mais diferencia as referencias de um dashboard generico.

- Graficos, barras e sparklines usam escala de cinza.
- Cor entra apenas quando carrega significado: `--success` para entrada/publicado, `--danger` para risco/remocao, `--warning` para rascunho/atencao.
- Nao colorir series so para diferenciar; usar tom de cinza, rotulo ou posicao.
- `--primary-accent` fica reservado para foco e detalhe pontual.

### 5. Mono Para Valor Tecnico

Chave, token, IBAN, slug, id e path usam fonte mono.

- Reforca que o valor e literal e copiavel.
- Valor secreto aparece mascarado por padrao.

### 6. Botao Primario Solido E Raro

- Primario solido claro sobre escuro, um por area de decisao.
- Secundario e apenas borda.
- Acao destrutiva nunca compete visualmente com a acao principal; vive em zona propria e declarada.

### 7. Empty State Com Icone, Titulo E Uma Linha

- Icone em container circular com borda.
- Titulo curto.
- Uma frase explicando o que acontece ao agir.
- Uma acao principal.
- Nunca deixar area vazia sem instrucao.

## Regras Derivadas Para O Design System

- `EmptyState` recebe icone obrigatorio via prop.
- `StatTile` padroniza rotulo caps + numero grande + delta opcional.
- Graficos do admin recebem cinza por padrao; cor exige justificativa semantica.
- `ConfirmDialog` e o unico caminho para acao destrutiva.
- Toda superficie nova usa borda de 1px e raio consistente: 12px em card, 8px em controle.

## Nao Fazer

- Nao copiar layout, copy ou identidade das referencias.
- Nao introduzir gradiente decorativo no admin; isso pertence ao portfolio publico.
- Nao usar animacao decorativa; motion no admin e feedback de estado.
- Nao aumentar padding para "respirar"; a densidade e intencional.
