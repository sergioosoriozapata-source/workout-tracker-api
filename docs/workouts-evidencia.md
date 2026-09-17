# Evidencia feat/workouts — Workout Tracker API (EV09)

## Endpoints

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/api/v1/workouts?limit=10&level=intermedio&userId=1` | 200 |
| GET | `/api/v1/workouts/ping` | 200 (`res.send`) |
| GET | `/api/v1/workouts/:id` | 200 / 400 / 404 |
| POST | `/api/v1/workouts` `{userId, name, date?, durationMin?, level?}` | 201 / 400 |
| PUT | `/api/v1/workouts/:id` (completo) | 200 / 400 / 404 |
| PATCH | `/api/v1/workouts/:id` (parcial) | 200 / 400 / 404 |
| DELETE | `/api/v1/workouts/:id` | 204 / 404 |

## Conceptos aplicados

- `req.query` para filtros (`limit`, `level`, `userId`) — ejemplo guía: `/workouts?limit=10`.
- `req.params` validado (entero positivo → 400), `req.body` validado, `req.get()` para cabeceras.
- `res.set('X-Total-Count', ...)` y estados 200/201/204/400/404/500.
