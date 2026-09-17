# Evidencia feat/progress — Workout Tracker API (EV09)

## Endpoints

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/api/v1/progress?limit=10&userId=1&workoutId=1` | 200 |
| GET | `/api/v1/progress/ping` | 200 (`res.send`) |
| GET | `/api/v1/progress/:id` | 200 / 400 / 404 |
| POST | `/api/v1/progress` `{userId, workoutId, date?, weightKg?, notes?}` | 201 / 400 |
| PUT | `/api/v1/progress/:id` (completo) | 200 / 400 / 404 |
| PATCH | `/api/v1/progress/:id` (parcial) | 200 / 400 / 404 |
| DELETE | `/api/v1/progress/:id` | 204 / 404 |

## Conceptos aplicados

- `req.query` para filtros (`limit`, `userId`, `workoutId`).
- `req.params` validado (entero positivo → 400), `req.body` validado, `req.get()` para cabeceras.
- `res.set('X-Total-Count', ...)` y estados 200/201/204/400/404/500.
