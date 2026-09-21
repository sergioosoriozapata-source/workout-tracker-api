# Workout Tracker API — GA1-220501098-03-AA1-EV09

API RESTful con **Node.js + Express**: inicialización del proyecto, rutas CRUD por recurso,
`req.params` / `req.query` / `req.body` / `req.headers`, cabeceras HTTP, estados HTTP y
versionamiento en GitHub por ramas (`main`, `develop`, `feat/*`).

## 1. Instalación y ejecución

```bash
npm install
npm run dev    # desarrollo (nodemon)
npm start      # producción
```

Variables de entorno (ver `.env.example`): `PORT`, `API_KEY`.
Base URL: `http://localhost:3000` · Versión API: `/api/v1`.

## 2. Estructura de carpetas

```text
workout-tracker-api/
├── src/
│   ├── server.js                      # arranque: importa app + puerto desde config/env
│   ├── app.js                         # app Express, parsers, montaje /api/v1, 404/500
│   ├── config/
│   │   └── env.js                     # importa .env y exporta { port, apiKey, nodeEnv }
│   ├── controllers/
│   │   ├── users.controller.js        # lógica CRUD de users
│   │   ├── workouts.controller.js     # lógica CRUD de workouts
│   │   ├── exercises.controller.js    # lógica CRUD de exercises
│   │   └── progress.controller.js     # lógica CRUD de progress
│   ├── data/store.js                  # datos en memoria (se migra a MySQL/mysql2)
│   ├── middleware/
│   │   └── validateId.middleware.js   # valida :id entero positivo -> 400
│   └── routes/
│       └── v1/                        # rutas versionadas (/api/v1/...)
│           ├── index.js               # barril: centraliza users, workouts, exercises, progress
│           ├── users.routes.js        # define rutas y delega al controlador
│           ├── workouts.routes.js
│           ├── exercises.routes.js
│           └── progress.routes.js
├── .env / .env.example
├── package.json (scripts start/dev, deps: express, mysql2, dotenv)
└── README.md
```

## 3. Tabla de endpoints (CRUD × 4 recursos)

| Recurso | Método | Endpoint | Descripción | Estado éxito |
|---|---|---|---|---|
| General | GET | `/` | Mensaje bienvenida (`res.send`) | 200 |
| General | GET | `/health` | Estado API (`res.json`) | 200 |
| General | GET | `/api/v1/headers/demo` | Eco de cabeceras | 200 |
| Users | GET | `/api/v1/users` | Listar (`?limit`, `?search`) | 200 |
| Users | GET | `/api/v1/users/ping` | Demo `res.send()` | 200 |
| Users | GET | `/api/v1/users/:id` | Uno por ID (`req.params`) | 200 |
| Users | POST | `/api/v1/users` | Crear | 201 |
| Users | PUT | `/api/v1/users/:id` | Reemplazo completo | 200 |
| Users | PATCH | `/api/v1/users/:id` | Actualización parcial | 200 |
| Users | DELETE | `/api/v1/users/:id` | Eliminar | 204 |
| Workouts | GET | `/api/v1/workouts` | Listar (`?limit`, `?level`, `?userId`) | 200 |
| Workouts | GET | `/api/v1/workouts/ping` | Demo `res.send()` | 200 |
| Workouts | GET | `/api/v1/workouts/:id` | Uno por ID | 200 |
| Workouts | POST | `/api/v1/workouts` | Crear | 201 |
| Workouts | PUT | `/api/v1/workouts/:id` | Reemplazo completo | 200 |
| Workouts | PATCH | `/api/v1/workouts/:id` | Actualización parcial | 200 |
| Workouts | DELETE | `/api/v1/workouts/:id` | Eliminar | 204 |
| Exercises | GET | `/api/v1/exercises` | Listar (`?limit`, `?muscleGroup`, `?workoutId`) | 200 |
| Exercises | GET | `/api/v1/exercises/ping` | Demo `res.send()` | 200 |
| Exercises | GET | `/api/v1/exercises/:id` | Uno por ID | 200 |
| Exercises | POST | `/api/v1/exercises` | Crear | 201 |
| Exercises | PUT | `/api/v1/exercises/:id` | Reemplazo completo | 200 |
| Exercises | PATCH | `/api/v1/exercises/:id` | Actualización parcial | 200 |
| Exercises | DELETE | `/api/v1/exercises/:id` | Eliminar | 204 |
| Progress | GET | `/api/v1/progress` | Listar (`?limit`, `?userId`, `?workoutId`) | 200 |
| Progress | GET | `/api/v1/progress/ping` | Demo `res.send()` | 200 |
| Progress | GET | `/api/v1/progress/:id` | Uno por ID | 200 |
| Progress | POST | `/api/v1/progress` | Crear | 201 |
| Progress | PUT | `/api/v1/progress/:id` | Reemplazo completo | 200 |
| Progress | PATCH | `/api/v1/progress/:id` | Actualización parcial | 200 |
| Progress | DELETE | `/api/v1/progress/:id` | Eliminar | 204 |

## 4. Ejemplos request/response

**GET lista con query:** `GET /api/v1/workouts?limit=10&level=intermedio`
```json
{ "data": [{ "id": 1, "userId": 1, "name": "Tren superior", "level": "intermedio" }], "total": 1 }
```

**GET por ID:** `GET /api/v1/users/1` → `200`
```json
{ "data": { "id": 1, "name": "Ana Torres", "email": "ana@example.com", "age": 24, "goal": "hipertrofia" }, "meta": { "contentType": null, "authorization": null, "apiKeyReceived": false } }
```

**POST crear:** `POST /api/v1/users` → `201`
```json
// request
{ "name": "Luisa", "email": "luisa@example.com", "age": 27, "goal": "fuerza" }
// response
{ "message": "Usuario creado.", "data": { "id": 3, "name": "Luisa", "email": "luisa@example.com", "age": 27, "goal": "fuerza" } }
```

**PUT completo:** `PUT /api/v1/users/3` → `200` (exige `name, email, age, goal`).

**PATCH parcial:** `PATCH /api/v1/users/3` → `200`
```json
// request
{ "goal": "resistencia" }
```

**DELETE:** `DELETE /api/v1/workouts/2` → `204 No Content` (sin cuerpo).

**Cabeceras:**
```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer demo" -H "X-API-Key: workout-demo-key-123" http://localhost:3000/api/v1/headers/demo
```
Respuesta incluye eco + cabeceras `X-API-Version: v1`, `X-API-Key-Received: true`.

## 5. Estados HTTP aplicados

| Código | Uso |
|---|---|
| 200 OK | GET, PUT, PATCH exitosos; `/`, `/health` |
| 201 Created | POST exitoso |
| 204 No Content | DELETE exitoso (sin cuerpo) |
| 400 Bad Request | `:id` inválido, `?limit` inválido, `req.body` incompleto, campo no permitido |
| 404 Not Found | Recurso `/:id` inexistente, ruta desconocida |
| 500 Internal Server Error | Errores no controlados (middleware global) |

## 6. Conceptos EV09 aplicados (guía de sustentación)

1. **Init:** `npm init -y`, `express`, `mysql2`, `dotenv`, `nodemon` (dev), scripts `start`/`dev`.
2. **GET:** listar + uno por ID con `res.json()`; `res.send()` en `/` y `/ping`.
3. **Params/query:** `req.params` (`/:id` validado) y `req.query` (`?limit`, `?search`, filtros).
4. **Req/Res:** `express.json()` + `urlencoded()` para `req.body`; uso de `req.headers/query/params/body` y `res.status().json()/send()`.
5. **Estados:** 200/201/204/400/404/500 en cada ruta + middlewares 404/500.
6. **POST:** validación de `req.body` → `201 Created`.
7. **PUT/PATCH:** PUT completo vs PATCH parcial con lista de campos permitidos.
8. **DELETE:** `204` éxito, `404` si no existe.

## 7. Versionamiento en GitHub

- `main` → principal (protegida), `develop` → integración.
- Ramas por recurso: `feat/users`, `feat/workouts`, `feat/exercises`, `feat/progress`.
- 7 commits por rama: 1 scaffold router · 2 GET · 3 POST · 4 PUT/PATCH · 5 DELETE · 6 validación params/query/estados · 7 README.
- Flujo: `feat/*` → `develop` → `main` (merge / PR).

```bash
git branch -a
git log --oneline --graph --all
```

## 8. Thunder Client — CRUD listo para copiar/pegar

> Base URL: `http://localhost:3000`  
> Header obligatorio en POST/PUT/PATCH: `Content-Type: application/json`

### 8.1 USERS — Flujo completo

| Paso | Método | URL | Body (JSON) | Esperado |
|------|--------|-----|-------------|----------|
| 1 Listar | GET | `/api/v1/users?limit=5` | — | 200 + array |
| 2 Buscar | GET | `/api/v1/users?search=ana` | — | 200 filtrado |
| 3 Ver uno | GET | `/api/v1/users/1` | — | 200 usuario |
| **4 Crear** | **POST** | **`/api/v1/users`** | ver abajo | **201** |
| 5 Parcial | PATCH | `/api/v1/users/{{id}}` | `{"goal":"resistencia"}` | 200 |
| 6 Completo | PUT | `/api/v1/users/{{id}}` | ver abajo | 200 |
| **7 Borrar** | **DELETE** | **`/api/v1/users/{{id}}`** | — | **204** |

**Body POST (crear usuario):**
```json
{
  "name": "Luisa",
  "email": "luisa@example.com",
  "age": 27,
  "goal": "fuerza"
}
```

**Body PUT (reemplazo completo — usa el `id` que devolvió el POST):**
```json
{
  "name": "Luisa",
  "email": "luisa@example.com",
  "age": 28,
  "goal": "hipertrofia"
}
```

> En Thunder Client: crea la request POST, envía, copia el `id` de la respuesta (`data.id`), y úsalo en las URLs `{{id}}` de PATCH/PUT/DELETE.

---

### 8.2 WORKOUTS — Flujo completo

| Paso | Método | URL | Body (JSON) | Esperado |
|------|--------|-----|-------------|----------|
| 1 Listar | GET | `/api/v1/workouts?level=intermedio&limit=5` | — | 200 |
| 2 Ver uno | GET | `/api/v1/workouts/1` | — | 200 |
| **3 Crear** | **POST** | **`/api/v1/workouts`** | ver abajo | **201** |
| 4 Parcial | PATCH | `/api/v1/workouts/{{id}}` | `{"level":"avanzado"}` | 200 |
| 5 Completo | PUT | `/api/v1/workouts/{{id}}` | ver abajo | 200 |
| **6 Borrar** | **DELETE** | **`/api/v1/workouts/{{id}}`** | — | **204** |

**Body POST (crear rutina):**
```json
{
  "userId": 1,
  "name": "Pierna + glúteos",
  "durationMin": 50,
  "level": "intermedio"
}
```

**Body PUT (reemplazo completo):**
```json
{
  "userId": 1,
  "name": "Pierna + glúteos",
  "date": "2026-09-20",
  "durationMin": 55,
  "level": "avanzado"
}
```

---

### 8.3 EXERCISES — Flujo completo

| Paso | Método | URL | Body (JSON) | Esperado |
|------|--------|-----|-------------|----------|
| 1 Listar | GET | `/api/v1/exercises?muscleGroup=pecho` | — | 200 |
| 2 Ver uno | GET | `/api/v1/exercises/1` | — | 200 |
| **3 Crear** | **POST** | **`/api/v1/exercises`** | ver abajo | **201** |
| 4 Parcial | PATCH | `/api/v1/exercises/{{id}}` | `{"sets":5}` | 200 |
| 5 Completo | PUT | `/api/v1/exercises/{{id}}` | ver abajo | 200 |
| **6 Borrar** | **DELETE** | **`/api/v1/exercises/{{id}}`** | — | **204** |

**Body POST (crear ejercicio):**
```json
{
  "workoutId": 1,
  "name": "Sentadilla",
  "sets": 4,
  "reps": 12,
  "muscleGroup": "piernas"
}
```

**Body PUT (reemplazo completo):**
```json
{
  "workoutId": 1,
  "name": "Sentadilla",
  "sets": 5,
  "reps": 10,
  "muscleGroup": "piernas"
}
```

---

### 8.4 PROGRESS — Flujo completo

| Paso | Método | URL | Body (JSON) | Esperado |
|------|--------|-----|-------------|----------|
| 1 Listar | GET | `/api/v1/progress?userId=1&limit=5` | — | 200 |
| 2 Ver uno | GET | `/api/v1/progress/1` | — | 200 |
| **3 Crear** | **POST** | **`/api/v1/progress`** | ver abajo | **201** |
| 4 Parcial | PATCH | `/api/v1/progress/{{id}}` | `{"notes":"Incrementé 2.5kg"}` | 200 |
| 5 Completo | PUT | `/api/v1/progress/{{id}}` | ver abajo | 200 |
| **6 Borrar** | **DELETE** | **`/api/v1/progress/{{id}}`** | — | **204** |

**Body POST (crear progreso):**
```json
{
  "userId": 1,
  "workoutId": 1,
  "weightKg": 69.0,
  "notes": "Mejor técnica en press"
}
```

**Body PUT (reemplazo completo):**
```json
{
  "userId": 1,
  "workoutId": 1,
  "date": "2026-09-20",
  "weightKg": 68.5,
  "notes": "Mejor técnica en press"
}
```

---

### 8.5 ERRORES (para mostrar validaciones)

| Qué probar | Método | URL | Body | Código |
|------------|--------|-----|------|--------|
| ID inexistente | GET | `/api/v1/users/9999` | — | 404 |
| ID inválido (no numérico) | GET | `/api/v1/users/abc` | — | 400 |
| POST sin body requerido | POST | `/api/v1/users` | `{}` | 400 |
| PATCH sin campos | PATCH | `/api/v1/users/1` | `{}` | 400 |
| Campo no permitido | PATCH | `/api/v1/users/1` | `{"foo":"bar"}` | 400 |
| Query inválida | GET | `/api/v1/users?limit=-1` | — | 400 |

---

### 8.6 Checklist rápido para el profe (orden sugerido)

1. `GET /health` → 200
2. `GET /api/v1/users?limit=1` → 200 + query string
3. `POST /api/v1/users` (body arriba) → **201** → **copia `id`**
4. `GET /api/v1/users/{{id}}` → 200
5. `PATCH /api/v1/users/{{id}}` (`{"goal":"resistencia"}`) → 200
6. `PUT /api/v1/users/{{id}}` (body PUT arriba) → 200
7. `DELETE /api/v1/users/{{id}}` → **204** (sin body)
8. `GET /api/v1/users/9999` → 404
9. `GET /api/v1/users/abc` → 400
10. `git log --oneline --graph --all` → muestra ramas y merges
