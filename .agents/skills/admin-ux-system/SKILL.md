---
name: admin-ux-system
description: Use ao criar, refatorar ou revisar telas do admin, login, formularios, tabelas, builders, usuarios, permissoes, preview, versoes ou design-system.
---

# Admin UX System

## Leitura Obrigatoria

Antes de alterar admin/login/formularios/tabelas/builders:

1. Leia `PROJECT.md`.
2. Leia `DESIGN.md`.
3. Leia `docs/admin-ux-roadmap.md`.
4. Verifique a tela `/admin/design-system` e atualize-a se criar ou mudar padrao visual/componente.
5. Para formularios/campos, consulte a referencia local `C:\PROJETOS\www\a&a\corpus\corpus-front\src\components\shared\form-fields.tsx`.

## Regras

- Nao criar UX isolada por tela se existir ou puder existir padrao reutilizavel.
- `components/ui` e base shadcn atualizavel.
- Produto visual fica em `components/ds`.
- Composicoes especificas ficam em `features/*/components`.
- Formularios complexos devem usar secoes, etapas, descricoes, preview e estados claros.
- O sistema de formularios deve se inspirar no `FormFields` do `corpus-front`: API agregadora, React Hook Form Controller, erro por campo, labels, masks, currency, number stepper, async autocomplete, upload e selects.
- Tabelas devem usar frame, filtros, busca, ordenacao, empty/loading/error states.
- Builders devem ter preview real, publicacao clara, controle de versao e reordenacao quando aplicavel.
- Preview de portfolio deve usar os mesmos componentes reais da landing com dados em memoria antes de salvar.
- Preview de curriculo deve ser fiel ao PDF final.
- Conteudo rico de paginas/secoes deve salvar `content` como HTML string por padrao; Markdown importado deve ser convertido.
- Paginas e secoes customizadas devem usar blocos padronizados para preservar consistencia visual.
- Wizards devem ficar restritos a entidades complexas como projetos, portfolio, curriculo e paginas/secoes ricas.
- Toda mudanca que afeta portfolio/curriculo deve ser validada no portfolio publico e no curriculo/PDF.
- Toda dependencia nova exige confirmacao explicita do usuario.

## Ordem Padrao

1. Definir ou atualizar padrao no design system.
2. Implementar componente DS reutilizavel.
3. Aplicar em uma tela piloto.
4. Testar fluxo real.
5. Documentar em `DESIGN.md`, `docs/admin-ux-roadmap.md` ou README da feature.

## Componentes Esperados

- Form: `DsForm`, `FormSection`, `FormStep`, `FormActions`, `FormAside`, `FormPreviewFrame`.
- Inputs: text, textarea, mask/currency, number stepper, select/combobox, async autocomplete, tag input, upload, rich text, slider, switch, checkbox, radio, toggle.
- Table: `DataTableFrame`, filtros, busca global, ordenacao, paginacao, visibilidade de colunas.
- Builder: preview real, dnd-kit, versoes, publish bar.
- Content: Tiptap/Markdown, variaveis com `{...}`, preview.
- Roles alvo para multiusuario: `owner`, `admin`, `editor`, `viewer`.
