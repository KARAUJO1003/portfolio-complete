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

**Perguntas em aberto (nao respondidas ainda, checar antes de avancar):**

1. Projetos/Skills: fixar uma unica visao (grade OU tabela) como padrao, ou manter as duas com toggle como nos exemplos?
2. O preview em "janela de navegador" (Portfolio Builder) e "folha de papel branca mesmo no dark mode" (Curriculo Builder) fazem sentido como estao?
3. Depois de fechar essas quatro telas (Projetos, Skills, Portfolio Builder, Curriculo Builder), seguir para Experiencias, Paginas, Secoes e Usuarios com o mesmo processo (mockup HTML -> aprovacao -> so entao codigo).
4. Navegacao (top nav estilo Vercel/Supabase) segue **bloqueada** ate o usuario mandar a imagem de referencia.

Decisoes fechadas a partir dessa composicao:

- **Cor**: variante A confirmada - monocromia por padrao. Badge de variacao (`+11,8%` etc.) e o unico lugar com fundo/texto colorido (`--success`/`--danger` sobre fundo suave, nao solido). Nav ativo, tags e sparklines continuam em tons neutros (`--foreground`/`--foreground-muted`). Isso reforca, nao substitui, o principio "Monocromia Por Padrao, Cor Como Sinal" ja registrado abaixo.
- **Dashboard**: direcao bklit confirmada - `KPI` com numero grande + rotulo caps + sparkline sem eixo (`stroke` neutro, sem grade own) e um painel de area maior com gradiente monocromatico e grade pontilhada discreta. Serve de alvo para os `StatTile`/`StatGrid` existentes e para os novos graficos.
- **Tabelas/listagens**: direcao ReUI Analytics confirmada - celula composta (miniatura + titulo + subtitulo), status por ponto colorido (`--dotc` semantico), tags como chips discretos, e coluna de tendencia com sparkline inline em vez de numero solto sem contexto.
- **Frame da tabela (2026-07-17, referencia Coss)**: usuario trouxe exemplo visual (tabela de voos com frame, checkbox, ordenacao por coluna, badge de status colorido, paginacao "Viewing X-Y of Z" no rodape do frame) e pediu que a barra de busca/filtros fique **fora** do frame, no topo. Confirmado lendo o JSON dos particles: `p-table-8` (`CardFrame` + `TableHeader` sortavel + `TableBody` + `CardFrameFooter` com paginacao) nao tem toolbar embutida - o frame cobre só tabela+paginacao. `p-toolbar-1` confirma o principio de composicao (barra solta, fora de qualquer frame), mas seu conteudo (alinhamento/formatacao de texto) nao serve de conteudo, so de padrao estrutural; a barra de busca/filtro real do `DataTableFrame` deve montar o conteudo a partir de particles de busca/filtro (`p-input-group-20` busca com icone, `p-group-23` filtro com combobox e botao remover, `p-select-14` select de status com dot colorido). Correcao necessaria no mockup do artifact `admin_redesign_direction`: lá a busca ficou dentro do `table-wrap`; na implementacao real ela deve ser um elemento irmao acima do `CardFrame` da tabela, nao um filho dele.
- **Estrategia de formulario**: confirmada a matriz por tipo de entidade, nao por tela isolada - inline na pagina (Perfil/Conta, entidade unica), Sheet lateral no desktop (Projetos/Experiencias, 6-12 campos, precisa ver a lista atras), Drawer bottom no mobile (Skills/itens rapidos, poucos campos), Dialog central (confirmacoes/troca de status, nunca edicao extensa). Isto substitui a ideia antiga de formulario sempre inline na tela.
- **Navegacao**: estrutura de grupos (Base, Conteudo, Publicacao, Sistema) confirmada como valida; o comportamento fino de overflow/dropdown top nav (estilo Vercel/Supabase, sem sidebar, sem scroll de menu) continua **pendente da imagem de referencia do usuario** antes de qualquer implementacao.
- **`/admin/design-system`**: deve evoluir para parecer com essa composicao (tokens, tipografia, dashboard, tabela, formularios documentados no mesmo padrao visual). Fica marcado como alvo futuro; nao mexer nele agora por pedido explicito do usuario.

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
- Padding de card: 16px a 20px, nunca mais.
- Espaco vertical entre campos: 12px a 16px.
- Altura de controle: 36px como padrao (nao 40px+).

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
