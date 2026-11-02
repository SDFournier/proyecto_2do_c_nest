# Simulacro: API completa (referencia)

API de ejemplo ("Librería") con el recorrido completo que se pide en el parcial y el final de Programación Backend II:

- Configuración con `.env` y conexión a MongoDB Atlas (`@nestjs/config` + `@nestjs/mongoose`).
- `POST /auth/register`: registro con password hasheada (bcrypt) y email único (`409`).
- `POST /auth/login`: devuelve `{ "accessToken": "..." }` (JWT).
- `GET /auth/profile`: ruta protegida con el guard.
- `GET /items` y `POST /items`: protegidas. `GET /items` devuelve `{ "title": "...", "items": [...] }`, el formato que consume el front común.
- Tres módulos: `users`, `auth` e `items`.

## Cómo se usa

```bash
npm install
cp .env.example .env     # completá MONGODB_URI y JWT_SECRET
npm run start:dev
```

Requiere Node 22.12 o superior.

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | Connection string de MongoDB Atlas (con el nombre de la base al final) |
| `JWT_SECRET` | Secreto con el que se firman los tokens |
| `JWT_EXPIRES_IN_SECONDS` | Duración del token en segundos |
| `CATALOG_TITLE` | Título que el front muestra arriba del catálogo |
