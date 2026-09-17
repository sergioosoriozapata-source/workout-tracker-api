# Evidencia feat/users — Workout Tracker API (EV09)

## Endpoints

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/api/v1/users?limit=10&search=ana` | 200 |
| GET | `/api/v1/users/ping` | 200 (`res.send`) |
| GET | `/api/v1/users/:id` | 200 / 400 / 404 |
| POST | `/api/v1/users` `{name, email, age?, goal?}` | 201 / 400 |
| PUT | `/api/v1/users/:id` (completo) | 200 / 400 / 404 |
| PATCH | `/api/v1/users/:id` (parcial) | 200 / 400 / 404 |
| DELETE | `/api/v1/users/:id` | 204 / 404 |

## Conceptos aplicados

- `req.params` (`/:id` validado con middleware → 400 si inválido), `req.query` (`?limit`, `?search`), `req.body` (`express.json()`), `req.get()` (Content-Type, Authorization, X-API-Key).
- Respuestas con `res.status().json()` y `res.send()`; cabeceras `X-Resource`, `X-Total-Count`, `X-API-Version`.
