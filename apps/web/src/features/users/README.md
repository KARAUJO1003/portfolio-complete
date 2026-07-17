# Users Feature

CRUD de usuarios do admin (owner/admin/editor/viewer). Papel define permissoes automaticamente via `ROLE_PERMISSION_PRESETS`.

Endpoint:

- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

Regras: nao e possivel excluir a propria conta nem o unico usuario com papel `owner`.
