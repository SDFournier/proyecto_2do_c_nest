# Marketplace API

API de usuarios construida con NestJS y TypeScript. Estado del proyecto al 07/09: usuarios en memoria con filtros y validación al crear.

## Ejecutar

```bash
npm install
npm run start:dev
```

La aplicación escucha en `http://localhost:3000`. Los datos viven en un array: reiniciar el servidor restaura el usuario inicial.

## Endpoints

| Método | Ruta | Éxito | Alternativa |
|---|---|---|---|
| `GET` | `/users` | `200` y lista | admite `?active=true` y `?name=...`, combinables |
| `GET` | `/users/:id` | `200` y usuario | `404` si no existe |
| `POST` | `/users` | `201` y creado | `400` si faltan datos o la edad es menor de 18 |
| `PATCH` | `/users/:id` | `200` y cambio parcial | `404` si no existe |
| `DELETE` | `/users/:id` | `204` sin body | `404` si no existe |
