# Padroes Herdados Dos Projetos De Referencia

Este projeto usa ideias observadas em `corpus-front` e `fbi_front`, ajustadas para um produto novo e mais desacoplado.

## O Que Aproveitar Do `fbi_front`

- `features/` como unidade de produto.
- `core/api` para Axios Instance.
- `AuthGuard` envolvendo pagina/bloco grande.
- `Can` reutilizando contexto do `AuthGuard` para acoes internas.
- Feature flags tipadas por dot path.
- `NuqsAdapter` no provider raiz.
- TanStack Query no provider raiz.
- TanStack Table com componentes de tabela compartilhados.
- `components/ui` como base shadcn.
- `components/ds` ou extensoes para componentes proprios.

## O Que Aproveitar Do `corpus-front`

- Gerador em `scripts/core`, com separacao de:
  - prompts;
  - file writer;
  - path constants;
  - string transformers;
  - templates;
  - config operations.
- Skills locais para orientar agentes.
- Documentacao de padroes especificos do projeto.

## Ajustes Para Este Projeto

- Tipos e schemas de uma feature devem ficar perto dela quando forem locais.
- Tipos compartilhados entre front e back ficam em `packages/contracts`.
- Permissoes puras ficam em `packages/permissions`.
- Feature flags compartilhadas ficam em `packages/feature-flags`.
- Geradores devem criar README por feature/modulo.
- Geradores devem evitar regex fragil em arquivos grandes quando um registry estruturado for possivel.

## Regra De Ouro

O padrao deve ajudar humanos e IA:

- nomes previsiveis;
- fronteiras pequenas;
- arquivos com responsabilidade clara;
- docs curtos por modulo;
- sem barrel exports genericos por padrao;
- sem customizacao de produto na camada shadcn base.

