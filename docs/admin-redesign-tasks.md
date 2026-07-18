# Redesign do Admin - Proxima Onda (Tasks)

> Fonte de verdade operacional desta rodada. Decisoes visuais de longo prazo continuam em `docs/admin-visual-references.md`; aqui e so o checklist de execucao, pensado para sobreviver ao fim de uma sessao.

**Proximo passo:** Fase 1, task 6 - criar `components/ui/switch.tsx`.

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

## Fase 1 - Componentes quebrados (Switch e Status)

- [ ] 6. Criar `components/ui/switch.tsx` (Base UI `@base-ui/react/switch`).
- [ ] 7. Migrar `FormFields.Switch` para o novo primitivo.
- [ ] 8. Criar `components/ui/toggle-group.tsx` (Base UI `@base-ui/react/toggle-group`).
- [ ] 9. Criar `FormFields.StatusToggle` e substituir os 3 Selects de status (projects/pages/custom-sections).
- [ ] 10. Testar visualmente Destaque/Portfolio/Curriculo e o status nas 3 telas.

## Fase 2 - Validacao do campo Ordem

- [ ] 11. Validar "Ordem" (inteiro >= 0, avisar/ajustar se maior que a quantidade de itens da colecao).

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

## Fase 7 - Builders: versionamento intuitivo + empty states

- [ ] 21. Version-switcher claro (publicado/ao vivo vs em edicao) em `components/ds/builder.tsx`.
- [ ] 22. Empty-state real nos dois previews (icone + copy + CTA).

## Fase 8 - Preview fiel ao site oficial

- [ ] 23. Portfolio Builder: preview reaproveitando componentes reais de `features/portfolio/*`.
- [ ] 24. Resume Builder: reavaliar version UX com o mesmo padrao da Fase 7.

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

## Backlog (nao agora, por pedido do usuario)

- [ ] DND real para ordenar itens do portfolio/curriculo (fica para depois de tudo acima).

## Decisoes pendentes de confirmar com o usuario

- [ ] Fallback hardcoded do portfolio publico (`portfolio-home.tsx:31-97`, achado na Fase 0): manter como esta (bom pra nao ficar feio sem conteudo) ou trocar por empty-state real quando nao houver versao publicada?
