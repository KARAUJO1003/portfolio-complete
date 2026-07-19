# Redesign do Admin - Proxima Onda (Tasks)

> Fonte de verdade operacional desta rodada. Decisoes visuais de longo prazo continuam em `docs/admin-visual-references.md`; aqui e so o checklist de execucao, pensado para sobreviver ao fim de uma sessao.

**Proximo passo:** Fase 6 (task 17) - pesquisar blocks modernos (coss-particles/ReUI) para auth e conta. Builders (Fase 7+8) concluidos. Prioridade combinada com o usuario: Fase 6 (auth/conta) agora, depois Fase 3/4/5 (polimento visual do admin), Fase 11 (input-group/button-group) e Fase 9 (copy) por ultimo.

Plano completo (contexto, decisoes, verificacao por fase) em `C:\Users\saram\.claude\plans\valiant-hatching-tiger.md` - ler antes de retomar se o contexto tiver se perdido.

## Fase 0 - Corrigir dados fantasma + reativar autenticacao local (CONCLUIDA 2026-07-18)

- [x] 1. Corrigido `ADMIN_EMAIL` em `apps/api/.env` para `kaesyoa11@gmail.com`.
- [x] 2. Ativado `AUTH_ENABLED=true` (api) e `NEXT_PUBLIC_AUTH_ENABLED=true` (web).
- [x] 3. Reiniciado API/web (precisou limpar `.next` corrompido pelo kill do processo anterior).
- [x] 4. Login real testado na UI (`kaesyoa11@gmail.com`), funcionando.
- [x] 5. Consolidado: existiam 2 usuarios admin no Mongo local por causa do typo historico no `.env` (`kaesya11@gmail.com` desde o inicio do projeto vs a correcao). O usuario com o typo era dono do unico dado real local (projeto de teste "Mr."); o outro (email certo) tinha acabado de ser criado vazio pela minha propria correcao do `.env`. Apagado o vazio, renomeado o email do antigo para o correto (aprovado pelo usuario) - sem perda de dado.

**Achado importante (revisao da causa raiz original):** a hipotese inicial ("owner mismatch entre admin e portfolio publico") estava **errada** - o banco local nao tem profile nem skills/experiencias cadastradas, so 1 projeto de teste. A causa real da confusao do usuario ("admin vazio mas portfolio com cards") e que `apps/web/src/features/portfolio/components/portfolio-home.tsx:31-97` tem `fallbackProfile`/`fallbackSkills`/`fallbackProjects` **hardcoded no codigo** (nome, projetos "Finance Fire"/"Portfolio 1.4.0"/"Kanban Board", skills etc.) - usados sempre que o portfolio publicado esta vazio, sem nenhum aviso visual de que e conteudo de exemplo. Perguntar ao usuario se quer manter esse fallback (bom para nao ficar feio antes de ter conteudo real) ou trocar por um empty-state real - ainda nao decidido, registrar como pendente.

## Build de verificacao (2026-07-18, a pedido do usuario)

Rodado `pnpm build` (monorepo completo) antes do limite da sessao. Encontrados e corrigidos 3 erros de tipo pre-existentes/da sessao anterior, todos na integracao do novo `Select` (Base UI) com `onValueChange` (que retorna `string | null`, nao so `string`):
- `apps/api/src/modules/public-portfolio/public-portfolio.service.ts:62` - `section.itemIds.map` sem tipo explicito (pre-existente, nao relacionado ao Select).
- `apps/web/src/features/portfolio-builder/components/portfolio-builder-feature.tsx:163` e `resume-builder-feature.tsx:173` - `onValueChange={loadVersion}` (loadVersion espera `string`, nao `string | null`). Corrigido para `onValueChange={(next) => loadVersion(next ?? "")}`.
- `apps/web/src/features/skills/components/skills-table.tsx:130` - `onValueChange={setCategory}` direto (mesmo problema). Corrigido para `(next) => setCategory(next ?? "all")`.

`pnpm build` (packages + api + web) passa limpo agora. Atencao: rodar build de producao sobrescreve o `.next` usado pelo dev server (`next dev` quebra com `Cannot find module` ate limpar `.next` e reiniciar) - fazer isso sempre que rodar build com o dev server ativo.

## Fase 1 - Componentes quebrados (Switch e Status) (CONCLUIDA 2026-07-18)

- [x] 6. Criado `components/ui/switch.tsx` (Base UI `@base-ui/react/switch`, particle `@coss/switch` adaptado).
- [x] 7. Migrado `FormFields.Switch` para o novo primitivo (via `checked`/`onCheckedChange`, layout label+descricao mantido).
- [x] 8. Criados `components/ui/toggle.tsx` e `toggle-group.tsx` (Base UI, sem CVA - o projeto nao usa, uma densidade so `h-7`).
- [x] 9. Criado `FormFields.StatusToggle` (ToggleGroup single-select, default "Rascunho") e substituidos os 3 Selects de status (`project-form.tsx`, `page-form.tsx`, `custom-section-form.tsx`).
- [x] 10. Testado: visual em Projetos (Destaque/Portfolio/Curriculo - switch trilho+thumb correto, sem o circulo quebrado do print) e Secoes customizadas; ciclo completo criar+editar+excluir em Paginas confirmando que o status "Publicado" persiste via API corretamente. Sem erros de console.

**Nota tecnica:** `ToggleGroup.value`/`onValueChange` do Base UI trabalham com **array** de valores pressionados (`string[]`), mesmo em modo single-select (`multiple: false` por default) - `StatusToggle` embrulha/desembrulha (`[value]` / `next[0]`).

## Fase 2 - Validacao do campo Ordem (CONCLUIDA 2026-07-18)

- [x] 11. Schema Zod (`project-form-schema.ts`, `skill-form-schema.ts`, `experience-form-schema.ts`, `custom-section-form-schema.ts`) ganhou `.int().min(0)` com mensagens em pt-BR. `FormFields.NumberStepper` ganhou props `min`/`max` (repassadas ao `NumberField` do Base UI, que clampa automaticamente em blur/step) e uma descricao automatica ("Use um valor entre 0 e N..."). Os 4 forms passam `max={itemsQuery.data?.length ?? 0}` (reusa a query da lista via `useQuery` com a mesma key - sem round-trip extra). Testado com clique+digitacao reais (nao manipulacao direta de DOM, que da falso negativo): "999" clampou para o max real (1, com 1 projeto cadastrado) e "-5" clampou para 0. Pages nao tem campo Ordem (fora de escopo).

**Cuidado de teste:** setar `.value` de um `NumberField` do Base UI via `dispatchEvent` manual não aciona o commit/clamp interno dele (fica com o texto “solto”, sem refletir o estado React real) — só testar via clique + teclado de verdade (`computer` tool) ou `requestSubmit()`/clique real em botão.

## Fase 3 - Dashboard com graficos animados

- [ ] 12. Criar `components/ds/chart.tsx` (sparkline/area SVG, sem lib nova, estilo bklit).
- [ ] 13. Integrar no dashboard (composicao real: status de projetos, categorias de skills etc.).

## Fase 4 - Hover premium nas Acoes principais

- [ ] 14. Microinteracao de hover sutil (Motion), mantendo monocromia.

## Fase 5 - Transicao de paginas

- [ ] 15. `components/ds/page-transition.tsx` (crossfade via Motion + `usePathname`).
- [ ] 16. Avaliar adaptar `PortfolioLoadingExperience` para loading states do admin.

## Fase 6 - Telas de auth e Minha conta

- [ ] 17. Pesquisar blocks modernos (coss-particles/ReUI) para auth e conta.
- [ ] 18. Redesenhar forgot-password/reset-password no nivel do login.
- [ ] 19. Avatar do GitHub em Minha conta (via `profile.avatarPath`/`profile.github`).
- [ ] 20. Retrabalhar `account-feature.tsx`.

## Fase 7 - Builders: versionamento intuitivo + empty states (CONCLUIDA 2026-07-19)

- [x] 21. Criado `BuilderVersionSwitcher` em `components/ds/builder.tsx`: junta Select+botao "Nova"+indicador num so componente, com indicador separado "Ao vivo: {nome}" (a versao com `status: published`, independente de qual esta carregada) e um aviso quando a versao carregada e um rascunho diferente da publicada ("Voce esta editando um rascunho - o site publico ainda mostra..."). Usado nos dois builders, removendo o Badge solto que so refletia o status da versao CARREGADA (facil de confundir com "o que esta no ar").
- [x] 22. Criado `BuilderEmptyState` (icone + titulo + descricao) usado no `PreviewGrid` do Portfolio Builder (por secao vazia) e como estado de tela cheia no Resume Builder quando a conta nao tem nenhum dado cadastrado (perfil+skills+projetos+experiencias+secoes todos vazios) - a folha do curriculo so aparece quando ha algo pra mostrar, ao inves de uma folha em branco confusa.
- [x] **Bug achado e corrigido**: o `useEffect` que auto-carrega a versao publicada/mais recente reagia a `versionId` na dependencia - clicar em "Nova" limpa `versionId`, o que re-disparava o mesmo efeito e desfazia o clique instantaneamente (voltava pra versao publicada sem nenhum feedback de erro). Corrigido com um `useRef` que so permite o auto-load rodar uma vez, na primeira carga dos dados. Presente nos dois builders, mesma causa raiz.
- Testado: publicar uma versao faz o indicador "Ao vivo" aparecer corretamente; clicar em "Nova" agora funciona (antes nao fazia nada visivel). Sem erros de console em nenhum dos dois builders.

## Fase 8 - Preview fiel ao site oficial (CONCLUIDA 2026-07-19)

- [x] 23. Portfolio Builder: preview agora reaproveita os componentes reais de `features/portfolio/components/portfolio-home.tsx` (`ProjectsSection`, `TimelineSection`, `SkillsSection`, `AboutSection`, `GitHubSection`, `CustomSectionsSection`, `PagesSection`, `ContactSection` - todos exportados so pra isso) em vez da renderizacao simplificada propria (`PreviewGrid`/`PreviewSection`, removidos). "Hero" continua um bloco simples (nome+titulo) porque o site real nao tem um componente de hero isolado - o conteudo vive espalhado na sidebar/MobileIntro, que dependem de layout de pagina inteira pra fazer sentido. Cada secao com lista (skills/projects/experiences/pages/custom-sections) cai no `BuilderEmptyState` quando vazia, senao renderiza o componente real. "Contato" ganhou preview de verdade (antes nem aparecia - a chave "contact" nao existia no registry antigo). Efeito colateral bom: o bundle de `/` (portfolio publico) caiu de 10.5kB pra 4.29kB, sinal de que o codigo passou a ser compartilhado entre as duas rotas em vez de duplicado.
- [x] 24. Resume Builder: ja resolvido junto com a Fase 7 (mesmo `BuilderVersionSwitcher` e fix do bug de auto-load aplicados aos dois builders simultaneamente).
- Testado: preview do Portfolio Builder reflete corretamente o filtro real (projeto de teste em draft nao aparece no preview, exatamente como nao apareceria no site publico - so a lista de selecao do painel mostra "1 item disponivel", a prova de que o preview usa o mesmo filtro `status=published`+`visibility.portfolio` do site real). Site publico (`/`) testado sem regressao apos as mudancas. Sem erros de console em nenhum dos dois.

## Fase 9 - Copy e acentuacao

- [ ] 25. Varredura por feature (copy de produto, sem acento -> com acento); checklist por pasta abaixo quando comecar:
  - [ ] admin (dashboard)
  - [ ] profile
  - [ ] account
  - [ ] projects
  - [ ] skills
  - [ ] experiences
  - [ ] pages
  - [ ] custom-sections
  - [ ] users
  - [ ] design-system
  - [ ] portfolio-builder / resume-builder
  - [ ] auth (login/forgot/reset)

## Fase 10 - Portfolio publico: loading, scroll e rich-text (CONCLUIDA 2026-07-19)

Pedido direto do usuario fora da ordem das fases (feedback ao vivo testando o site publico).

- [x] 26. Removido `PortfolioEntryOverlay` (`portfolio-home.tsx` + arquivo deletado): mostrava uma tela "Construindo a interface" por `minimumLoadingMs = 1800` **sempre**, mesmo com os dados ja prontos (era so um efeito cosmetico no mount, nao esperava nada de verdade). Agora só o Suspense real (`app/(portfolio)/loading.tsx`, mesmo componente `PortfolioLoadingExperience`) aparece, e só quando ha carregamento de verdade em andamento - satisfaz o "somente quando for necessario" pedido. A demora que aparecia no dev e principalmente compilacao a frio do Next (`Compiling / ...`), que não existe em build de producao.
- [x] 27. Scroll suave dos links da sidebar (`#sobre`, `#projetos` etc.): causa raiz era o Next.js interceptando o hashchange e resetando o scroll antes do browser rolar de fato (`hash` mudava na URL, `scrollY` nunca saia de 0). Corrigido: extraido `SidebarNavLink` para `components/sidebar-nav-link.tsx` (Client Component - `portfolio-home.tsx` e Server Component, nao pode ter `onClick` direto) com `preventDefault` + `scrollIntoView({behavior:"smooth"})` manual + `scroll-smooth` global em `app/layout.tsx` (`<html>`, estava antes numa div interna que nao rolava a pagina de verdade). Confirmado que o clique agora dispara o scroll de verdade (antes: zero movimento). **Nao consegui confirmar 100% via automacao que a animacao sempre completa ate o alvo exato** (o ambiente de teste automatizado parece throttlar requestAnimationFrame de forma inconsistente) - pedir para o usuario confirmar visualmente num uso real.
- [x] 28. `project.description` ("Descricao longa"): trocado de `FormFields.RichTextField` (que apesar do nome so era Textarea) para `FormFields.HtmlEditor` (editor Tiptap de verdade). Seguro porque esse campo nao alimenta o gerador de PDF (so `project.summary` alimenta) e nao tem nenhum renderer publico hoje que espere o texto plano antigo.
- [x] 29. **Decidido pelo usuario: atualizar o PDF tambem.** Criado `apps/api/src/modules/resume-pdf/html-to-pdf-lines.ts` (`htmlToPdfLines`/`htmlToPlainSpans`/`htmlToInlineSpans`) - conversor hand-rolled (sem lib nova, mesmo estilo do gerador de PDF existente) que le o HTML do Tiptap (p/h2/h3/ul/ol/li/blockquote/negrito/callout) e produz `PdfLine[]`. Adicionados `bulletSpans`/`numberedSpans` em `resume-pdf.generator.ts` (bullet/numbered com spans, nao so texto). `resume-pdf.service.ts` atualizado para usar o conversor em `profile.summary`, `profile.objective`, `experience.description`, `skill.description` (bullet de skill pessoal) **e** `custom-sections` content (bug latente que ja existia - conteudo HTML de secoes customizadas caia direto em `paragraph()` sem conversao, mesma causa raiz). Formularios trocados para `FormFields.HtmlEditor`: `profile-form.tsx` (Resumo/Objetivo), `experience-form.tsx`, `skill-form.tsx`. Portfolio publico corrigido para nao vazar tags: `experience.description` agora renderiza via `HtmlContent`; `skill.description` (usado como `title` de tooltip nativo) usa `stripHtmlToText()` novo. Testado via API direta: criei skill com `<strong>`/`<em>`/lista, gerei o PDF classic-ats e confirmei que o texto aparece decodificado (sem tags cruas) no conteudo do PDF. Build (api+web) limpo, UI do editor rico confirmada visualmente no form de Skill.

## Fase 11 - Input group / Button group nos formularios (pedido do usuario, ainda nao iniciada)

- [ ] 30. Mapear quais campos de formulario (admin) fazem sentido virar `InputGroup`/`ButtonGroup` com addons (ex.: URL com prefixo `https://`, campos com unidade/sufixo, Demo URL/Repo URL do projeto, campo de busca com icone dentro do input). Pesquisar particle `@coss/input-group` e `@coss/button-group` (skill `coss-particles`) antes de implementar, seguindo o mesmo padrao de adaptacao ja usado em select/number-field/switch/toggle-group.

## Backlog (nao agora, por pedido do usuario)

- [ ] DND real para ordenar itens do portfolio/curriculo (fica para depois de tudo acima).

## Decisoes pendentes de confirmar com o usuario

- [ ] Fallback hardcoded do portfolio publico (`portfolio-home.tsx:31-97`, achado na Fase 0): manter como esta (bom pra nao ficar feio sem conteudo) ou trocar por empty-state real quando nao houver versao publicada?
