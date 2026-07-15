# Deploy Gratuito

## Arquitetura Recomendada

- Frontend Next.js: Vercel.
- API Express: Render Web Service no plano gratuito.
- MongoDB: MongoDB Atlas M0.
- Repositorio: um unico monorepo no GitHub.

O `render.yaml` da raiz configura a API. O front deve ser criado como um projeto separado na Vercel apontando para o mesmo repositorio.

O build executa `pnpm@9.0.0` via `npx` para nao depender do Corepack nem tentar escrever nos diretorios globais somente-leitura do Render.

## 1. Publicacao Manual No GitHub

Execute na raiz do projeto:

```bash
git init
git add .
git status
git commit -m "feat: initial portfolio platform"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Antes do commit, confirme no `git status` que `.env`, `.env.local`, `node_modules`, `.next`, `dist`, `work` e uploads locais nao aparecem.

## 2. MongoDB Atlas

1. Crie um cluster gratuito M0.
2. Crie um usuario exclusivo para a aplicacao.
3. Libere conexoes de rede para o Render. No MVP, `0.0.0.0/0` e a opcao mais simples; use senha forte.
4. Copie a connection string e substitua usuario, senha e nome do banco.
5. Use a string completa como `MONGODB_URI` no Render.

## 3. API No Render

1. No Render, escolha `New > Blueprint` e conecte o repositorio.
2. O Render encontrara o `render.yaml` na raiz.
3. Preencha as variaveis marcadas como `sync: false`.
4. Em `APP_URL`, informe a URL final da API, por exemplo `https://portfolio-platform-api.onrender.com`.
5. Em `WEB_URL`, use inicialmente a URL de producao que a Vercel fornecer.
6. Confirme que `/health` retorna `ok: true` e `mongo: 1`.

Configuracao manual equivalente:

```txt
Root Directory: vazio
Build Command: npx --yes pnpm@9.0.0 install --frozen-lockfile && npx --yes pnpm@9.0.0 --filter @portfolio/api build
Start Command: node apps/api/dist/main.js
```

Variaveis opcionais que podem ser adicionadas depois:

```env
GITHUB_TOKEN=
```

O plano gratuito pode suspender a API por inatividade. A primeira requisicao apos a suspensao pode demorar mais.

## 4. Frontend Na Vercel

Importe o mesmo repositorio e configure:

- Framework Preset: `Next.js`.
- Root Directory: `apps/web`.
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`.
- Build Command: `cd ../.. && pnpm --filter @portfolio/web build`.

Variaveis de producao:

```env
NEXT_PUBLIC_API_BASE_URL=https://portfolio-platform-api.onrender.com
NEXT_PUBLIC_BASE_URL_FILES=https://portfolio-platform-api.onrender.com/files
NEXT_PUBLIC_APP_URL=https://SEU_PROJETO.vercel.app
NEXT_PUBLIC_AUTH_ENABLED=true
```

Apos obter a URL definitiva da Vercel, atualize `WEB_URL` no Render e faca um novo deploy da API.

## 5. Validacao Depois Do Deploy

1. Abra `/health` na API.
2. Abra a landing publica e confirme os dados do seed.
3. Entre em `/login` e valide login, `me` e logout.
4. Edite um item, publique a versao e confira a landing.
5. Gere os dois templates de PDF.
6. Teste curtir e descurtir um projeto em janela anonima.
7. Teste um upload e recarregue a imagem.

## Limitacao Dos Uploads Locais

O filesystem do Render gratuito e efemero. Arquivos em `storage/tmp/uploads` podem desaparecer em reinicios, suspensoes e novos deploys. O banco continuara contendo o path relativo, mas o arquivo podera deixar de existir.

Para producao duravel, a proxima evolucao deve manter a interface atual de upload e trocar somente o adapter de storage por Cloudinary, S3 ou servico equivalente. Ate essa troca, nao use o Render como armazenamento definitivo dos arquivos do portfolio.
