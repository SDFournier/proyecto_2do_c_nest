# Proyecto Programación Web II — Clase 3

API de usuarios construida con NestJS y TypeScript. Representa el checkpoint de la clase 3: un módulo con controller, service, inyección de dependencias y datos en memoria.

## Ejecutar

```bash
npm install
npm run start:dev
```

La aplicación escucha en `http://localhost:3000` por defecto. Los datos viven en un array: reiniciar el servidor restaura el usuario inicial.

## Estructura

```text
src/
├── app.module.ts
└── users/
    ├── dto/
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts
```

`UsersController` recibe HTTP y delega. `UsersService` contiene las reglas actuales y el array en memoria. El módulo declara ambas piezas y Nest inyecta el service en el controller.

## Endpoints

| Método | Ruta | Éxito | Alternativa |
|---|---|---|---|
| `GET` | `/users` | `200` y lista | `[]` también devuelve `200` |
| `GET` | `/users/:id` | `200` y usuario | `404` si no existe |
| `POST` | `/users` | `201` y creado | — |
| `PATCH` | `/users/:id` | `200` y cambio parcial | `404` si no existe |
| `DELETE` | `/users/:id` | `204` sin body | `404` si no existe |

## Ejemplos

```http
POST /users
Content-Type: application/json

{
  "name": "Grace Hopper",
  "email": "grace@example.com",
  "age": 35,
  "active": true
}
```

```http
PATCH /users/2
Content-Type: application/json

{
  "active": false,
  "age": 36
}
```

## Alcance de este checkpoint

No incorpora validación declarativa, Swagger/OpenAPI, MongoDB/Mongoose, autenticación ni JWT. Los DTOs describen formas de TypeScript; aún no validan una request real.
