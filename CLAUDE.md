# Claude Code

As regras deste projeto sao mantidas em `AGENTS.md` e valem igual para Claude Code e Codex.

@AGENTS.md

## Especifico Do Claude Code

- As skills ficam em `.agents/skills` (fonte unica). `.claude/skills` e apenas um link criado por `pnpm setup:agents` e nao vai para o Git.
- Se as skills nao aparecerem, rode `pnpm setup:agents`.
- Hooks: `.claude/settings.json` espelha `.codex/hooks.json` e executa o mesmo script do impeccable.
