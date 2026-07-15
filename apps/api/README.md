# API App

Express/Node API para regras de negocio, MongoDB, uploads, PDF, permissoes, likes e integracoes.

Estrutura principal:

```txt
src/
├─ modules/
├─ shared/
├─ infra/
├─ config/
└─ main.ts
```

Regras:

- Controllers finos.
- Services com regra de aplicacao.
- Repositories isolando Mongo/Mongoose.
- Backend valida permissoes e feature flags.

