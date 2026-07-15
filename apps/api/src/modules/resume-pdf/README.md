# Resume PDF

Modulo para gerar curriculos em PDF textual/selecionavel.

## Template Inicial

- `classic-ats`
- Rota: `POST /resume-pdf/classic-ats`
- Usa dados do perfil, skills, projetos e experiences com `visibility.resume = true`.
- Gera PDF sem imagens, tabelas complexas ou layout que prejudique leitura automatica.

## Status

- Primeira versao funcional implementada.
- Ainda falta integrar com `resumeVersions` quando o modulo de versoes existir.
