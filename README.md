# Front común · Programación Backend II

Una sola página (`index.html`, sin instalar nada) que sirve para probar tu API del final:

- **Mi app:** pantalla de login y registro. Con la sesión iniciada pide `GET /items` y muestra el título que devuelve tu API y los items agrupados por sección.
- **Verificador del contrato:** crea un usuario de prueba, inicia sesión y revisa cada punto que se pide. Cada línea explica qué falta si algo falla.

## Cómo usarlo

1. Descargá `index.html` (o cloná esta rama: `git clone -b front-final --single-branch https://github.com/SDFournier/proyecto_2do_c_nest.git front`).
2. Levantá tu API (`npm run start:dev`). Tiene que tener `app.enableCors()` en `main.ts`.
3. Abrí `index.html` con doble clic en el navegador. Arriba a la derecha escribí la URL de tu API (por defecto `http://localhost:3000`).
4. Entrá a **Verificador del contrato** y tocá **Probar mi API**.

Si preferís servirlo por HTTP: `npx serve .` dentro de esta carpeta.

## Qué espera el front de tu API

| Request | Respuesta |
|---|---|
| `POST /auth/register` con `{ name, email, password }` | `201`, sin password ni hash en el cuerpo. Email repetido: `409`. Body vacío: `400` |
| `POST /auth/login` con `{ email, password }` | `200` con `{ "accessToken": "..." }`. Credenciales malas: `401` |
| `GET /items` sin token | `401` |
| `GET /items` con `Authorization: Bearer <token>` | `200` con `{ "title": "...", "items": [ { "name": "...", "section": "...", ... } ] }` |

Cada item necesita `name` y `section`. Cualquier otro campo escalar (precio, descripción, autor…) se muestra tal cual en la tarjeta. Las secciones del catálogo salen del campo `section` de tus items, y el título de arriba sale del campo `title` de la respuesta.
