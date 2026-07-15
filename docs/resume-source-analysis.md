# Analise Do Curriculo Antigo

Fonte local analisada:

```txt
C:/Users/kaesyo.araujo/Downloads/curriculo.pdf
```

## Secoes Encontradas

- Dados pessoais:
  - nome completo;
  - endereco;
  - portfolio;
  - telefone;
  - email;
  - data de nascimento;
  - CNH;
  - curso/area.
- Resumo profissional.
- Historico profissional.
- Competencias tecnicas.
- Competencias pessoais.
- Conquistas e distincoes.
- Certificacoes.
- Formacao academica.
- Objetivo.

## Ajustes Feitos No Projeto

- Perfil recebeu campos:
  - `objective`;
  - `address`;
  - `birthDate`;
  - `driverLicense`.
- Seed passou a incluir:
  - telefone e email reais do curriculo;
  - objetivo;
  - resumo profissional do PDF;
  - experiencias profissionais;
  - competencias pessoais;
  - conquistas;
  - certificacoes;
  - formacao academica.
- Gerador `classic-ats` criado no backend.
- Botao `Baixar PDF` habilitado no builder de curriculo.

## Observacao

O PDF gerado no MVP prioriza leitura ATS/IA: texto selecionavel, layout simples, sem imagens e sem tabelas complexas.
