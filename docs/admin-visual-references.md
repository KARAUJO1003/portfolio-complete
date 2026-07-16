# Admin - Referencias Visuais

## Objetivo

Registrar a direcao visual do admin a partir de referencias fornecidas pelo usuario em 2026-07-16.

As referencias foram traduzidas em principios e regras aplicaveis. Nada de codigo, asset, copy ou marca das referencias deve ser reproduzido. Ver skill `reference-safe-redesign`.

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
