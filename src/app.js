// GA1-220501098-03-AA1-EV09 — Configurar proyecto de API RESTful con Nodejs, express y creación de rutas + control de versiones

const express = require('express');
const v1Router = require('./routes/v1');

const app = express();

// Parsers para req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.set('X-API-Version', 'v1');
  res.send('Hola mi server en Express — Workout Tracker API v1');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1', uptime: process.uptime() });
});

// Rutas versionadas centralizadas (/api/v1/...)
app.use('/api/v1', v1Router);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Ruta ${req.method} ${req.originalUrl} no existe.` });
});

// Manejo de errores globales (500)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Error inesperado.' });
});

module.exports = app;
