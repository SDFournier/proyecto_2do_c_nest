# Marketplace API

API de usuarios construida con NestJS y TypeScript. Estado del proyecto al 28/09: los usuarios se guardan en MongoDB con Mongoose.

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
| `GET` | `/users` | `200` y lista | admite `?active=true` y `?name=...`, combinables |
| `POST` | `/users` | `201` y creado | `400` si faltan datos o la edad es menor de 18 |

Buscar por id, modificar y borrar se reescriben con la base en el siguiente paso del proyecto.
