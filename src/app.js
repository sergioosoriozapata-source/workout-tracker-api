// GA1-220501098-03-AA1-EV09 — Proyecto base (paso 1: inicialización)
// Servidor Express mínimo. Los recursos /api/v1/* se agregan en las ramas feat/*.

const express = require('express');

const app = express();

// EV09 Paso 4 — parsers para req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz — demuestra res.send()
app.get('/', (req, res) => {
  res.send('Workout Tracker API v1 — base inicializada');
});

// Health — demuestra res.json()
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1' });
});

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Ruta ${req.method} ${req.originalUrl} no existe.` });
});

// 500 — manejador global
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Error inesperado.' });
});

module.exports = app;
