# Marketplace API

API de usuarios y autenticación construida con NestJS, TypeScript y MongoDB. Estado del proyecto al 19/10: registro, login con JWT y rutas protegidas con un guard.

## Ejecutar

```bash
npm install
cp .env.example .env   # y completar MONGODB_URI y JWT_SECRET
npm run start:dev
```

La aplicación escucha en `http://localhost:3000` (o el `PORT` de tu `.env`).

Variables de entorno:

| Variable | Para qué |
|---|---|
| `MONGODB_URI` | Connection string de MongoDB |
| `JWT_SECRET` | Texto secreto con el que se firman los tokens. Largo y aleatorio. |
| `JWT_EXPIRES_IN_SECONDS` | Duración del token, en segundos |

## Endpoints

| Método | Ruta | Éxito | Alternativa |
|---|---|---|---|
| `POST` | `/auth/register` | `201` y el usuario, sin password ni hash | `400` datos inválidos, `409` email repetido |
| `POST` | `/auth/login` | `200` y `{ "accessToken": "..." }` | `400` body inválido, `401` credenciales incorrectas |
| `GET` | `/auth/profile` | `200` y el usuario del token | `401` sin token o token inválido |
| `GET` | `/users` | `200` y lista | admite `?active=true` y `?name=...` |
| `GET` | `/users/:id` | `200` y usuario | `400` id inválido, `404` si no existe |
| `PATCH` | `/users/:id` | `200` y usuario modificado | `401` sin token, `403` si no es tu cuenta, `400`, `404`, `409` |
| `DELETE` | `/users/:id` | `204` sin body | `401` sin token, `403` si no es tu cuenta, `400`, `404` |

Las rutas protegidas esperan el header `Authorization: Bearer <accessToken>`.
