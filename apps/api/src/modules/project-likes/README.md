# Project Likes

Modulo publico para curtidas anonimas em projetos.

## Fluxo

- Front cria um `visitorId` local no navegador.
- Backend recebe o `visitorId`, gera hash HMAC com `JWT_SECRET` e salva apenas o hash.
- Indice unico impede mais de uma curtida do mesmo visitante no mesmo projeto.
- `likesCount` do projeto e sincronizado apos cada tentativa.
