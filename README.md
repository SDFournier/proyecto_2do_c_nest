# Marketplace API

API de usuarios y registro construida con NestJS, TypeScript y MongoDB. Estado del proyecto al 05/10: CRUD de usuarios y registro con password hasheada con bcrypt.

## Ejecutar

```bash
npm install
cp .env.example .env   # y completar MONGODB_URI con tu connection string
npm run start:dev
```

La aplicación escucha en `http://localhost:3000` (o el `PORT` de tu `.env`).

## Endpoints

| Método | Ruta | Éxito | Alternativa |
|---|---|---|---|
| `POST` | `/auth/register` | `201` y el usuario, sin password ni hash | `400` datos inválidos, `409` email repetido |
| `GET` | `/users` | `200` y lista | admite `?active=true` y `?name=...`, combinables |
| `GET` | `/users/:id` | `200` y usuario | `400` id inválido, `404` si no existe |
| `PATCH` | `/users/:id` | `200` y usuario modificado | `400` datos inválidos, `404`, `409` email repetido |
| `DELETE` | `/users/:id` | `204` sin body | `400` id inválido, `404` si no existe |

Los usuarios se crean solo mediante `/auth/register`. Todavía no hay login ni JWT.
