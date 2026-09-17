# Evidencia feat/exercises — Workout Tracker API (EV09)

## Endpoints

| Método | Endpoint | Estado |
|---|---|---|
| GET | `/api/v1/exercises?limit=10&muscleGroup=pecho&workoutId=1` | 200 |
| GET | `/api/v1/exercises/ping` | 200 (`res.send`) |
| GET | `/api/v1/exercises/:id` | 200 / 400 / 404 |
| POST | `/api/v1/exercises` `{workoutId, name, sets?, reps?, muscleGroup?}` | 201 / 400 |
| PUT | `/api/v1/exercises/:id` (completo) | 200 / 400 / 404 |
| PATCH | `/api/v1/exercises/:id` (parcial) | 200 / 400 / 404 |
| DELETE | `/api/v1/exercises/:id` | 204 / 404 |

## Conceptos aplicados

- `req.query` para filtros (`limit`, `muscleGroup`, `workoutId`).
- `req.params` validado (entero positivo → 400), `req.body` validado, `req.get()` para cabeceras.
- `res.set('X-Total-Count', ...)` y estados 200/201/204/400/404/500.
