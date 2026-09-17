// GA1-220501098-03-AA1-EV09 — Proyecto base API RESTful (Node.js + Express)
// Aplica: inicialización, GET, params/query, req/res, cabeceras, estados,
// POST, PUT/PATCH, DELETE + versionado de URIs (/api/v1).

const express = require('express');
const headersContext = require('./middleware/headers.middleware');

const usersRoutes = require('./routes/users.routes');
const workoutsRoutes = require('./routes/workouts.routes');
const exercisesRoutes = require('./routes/exercises.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();

// EV09 Paso 4 — Request/Response: parsers para req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EV09 Paso 5 — Cabeceras HTTP globales
app.use(headersContext);

// Ruta raíz — demuestra res.send() (texto) y versionado disponible
app.get('/', (req, res) => {
  res.set('X-API-Version', 'v1');
  res.send('Workout Tracker API v1 — use /api/v1/users, /api/v1/workouts, /api/v1/exercises, /api/v1/progress');
});

// Health — demuestra res.json()
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1', uptime: process.uptime() });
});

// Demo de cabeceras: lee req.get() y devuelve eco + fija res.set()
app.get('/api/v1/headers/demo', (req, res) => {
  res.set('X-Demo', 'headers');
  res.status(200).json({
    request: {
      contentType: req.get('Content-Type') || null,
      authorization: req.get('Authorization') || null,
      apiKey: req.get('X-API-Key') || null,
      customEcho: req.get('X-Custom-Header') || null,
    },
    note: 'Cabeceras leídas con req.get() y respondidas con res.set() + res.status().json()',
  });
});

// EV09 — Rutas versionadas por recurso (/api/v1/...)
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/workouts', workoutsRoutes);
app.use('/api/v1/exercises', exercisesRoutes);
app.use('/api/v1/progress', progressRoutes);

// 404 para rutas no definidas (EV09 Paso 6 — Estados HTTP)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Ruta ${req.method} ${req.originalUrl} no existe.` });
});

// 500 — manejador global de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Error inesperado.' });
});

module.exports = app;
