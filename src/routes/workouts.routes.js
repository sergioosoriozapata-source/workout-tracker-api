const express = require('express');
const { workouts } = require('../data/store');

const router = express.Router();

// EV09 Paso 2 — scaffold del router workouts. Endpoints básicos (se implementan por pasos).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'workouts');
  res.send('workouts API ok'); // res.send() para texto plano
});

// EV09 Paso 2 — GET: listar todas y obtener una por ID (res.json)
router.get('/', (req, res) => {
  res.set('X-Resource', 'workouts');
  return res.status(200).json({ data: workouts, total: workouts.length }); // 200 OK
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id); // req.params
  const workout = workouts.find((w) => w.id === id);
  if (!workout) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${req.params.id} no existe.` });
  }
  return res.status(200).json({ data: workout });
});

// EV09 Paso 7 — POST: creación de recursos, valida req.body, responde 201 Created
router.post('/', (req, res) => {
  const { userId, name, date, durationMin, level } = req.body || {}; // req.body (express.json)
  if (!userId || !name) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: userId, name.' });
  }
  const created = {
    id: workouts.length ? Math.max(...workouts.map((w) => w.id)) + 1 : 1,
    userId,
    name,
    date: date ?? new Date().toISOString().slice(0, 10),
    durationMin: durationMin ?? null,
    level: level ?? 'principiante',
  };
  workouts.push(created);
  return res.status(201).json({ message: 'Rutina creada.', data: created }); // 201
});
// EV09 Paso 8 — PUT: actualización COMPLETA (exige todos los campos)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = workouts.findIndex((w) => w.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${id} no existe.` });
  }
  const { userId, name, date, durationMin, level } = req.body || {};
  if (!userId || !name || !date || durationMin === undefined || !level) {
    return res.status(400).json({ error: 'Bad Request', message: 'PUT exige recurso completo: userId, name, date, durationMin, level.' });
  }
  workouts[index] = { id, userId, name, date, durationMin, level };
  return res.status(200).json({ message: 'Rutina actualizada (PUT).', data: workouts[index] });
});

// EV09 Paso 8 — PATCH: actualización PARCIAL (solo campos enviados)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const workout = workouts.find((w) => w.id === id);
  if (!workout) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${id} no existe.` });
  }
  const allowed = ['userId', 'name', 'date', 'durationMin', 'level'];
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'PATCH requiere al menos un campo.' });
  }
  const invalid = keys.filter((k) => !allowed.includes(k));
  if (invalid.length > 0) {
    return res.status(400).json({ error: 'Bad Request', message: `Campos no permitidos: ${invalid.join(', ')}` });
  }
  Object.assign(workout, req.body);
  return res.status(200).json({ message: 'Rutina actualizada (PATCH).', data: workout });
});
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
