# MVP Roadmap

## Objetivo

Construir o produto em partes pequenas, sempre com um checkpoint verificavel antes de avancar.

## Fases

| Fase | Status | Checkpoint |
| --- | --- | --- |
| 1. Documentacao base | done | Projeto retomavel por `PROJECT.md` |
| 2. Scaffold monorepo | done | Estrutura de apps/packages criada |
| 3. API base | done | `/health`, Mongo, auth, upload e guards validados |
| 4. Web base | done | Login/admin, providers, tema e publico funcionando |
| 5. CRUDs principais | done | Profile, projects, skills, experiences, pages e custom sections |
| 6. Versoes/publicacao | done | Publicacao por versao reflete imediatamente no portfolio |
| 7. Curriculo/PDF | done | Builders persistentes e dois templates ATS |
| 8. Uploads/likes/GitHub | done | Upload integrado, toggle de like e GitHub com cache |
| 9. Geradores | done | Feature/module criados por comando interativo ou pipe |
| 10. DS base | in-progress | Base funcional pronta; polimento visual e catalogo completo sao o proximo ciclo |

## Criterio Para Avancar

Uma fase so deve virar `done` quando:

- os arquivos principais existem;
- o comportamento minimo da fase foi implementado;
- `PROJECT.md` foi atualizado;
- nenhum build/typecheck/biome/lint foi rodado sem pedido.
