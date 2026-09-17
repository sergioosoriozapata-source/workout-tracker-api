const express = require('express');
const { progress } = require('../data/store');

const router = express.Router();

// EV09 Paso 2 — scaffold del router progress. Endpoints básicos (se implementan por pasos).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'progress');
  res.send('progress API ok'); // res.send() para texto plano
});

// EV09 Paso 2 — GET: listar todos y obtener uno por ID (res.json)
router.get('/', (req, res) => {
  res.set('X-Resource', 'progress');
  return res.status(200).json({ data: progress, total: progress.length }); // 200 OK
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id); // req.params
  const entry = progress.find((p) => p.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${req.params.id} no existe.` });
  }
  return res.status(200).json({ data: entry });
});

// EV09 Paso 7 — POST: creación de recursos, valida req.body, responde 201 Created
router.post('/', (req, res) => {
  const { userId, workoutId, date, weightKg, notes } = req.body || {}; // req.body (express.json)
  if (!userId || !workoutId) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: userId, workoutId.' });
  }
  const created = {
    id: progress.length ? Math.max(...progress.map((p) => p.id)) + 1 : 1,
    userId,
    workoutId,
    date: date ?? new Date().toISOString().slice(0, 10),
    weightKg: weightKg ?? null,
    notes: notes ?? null,
  };
  progress.push(created);
  return res.status(201).json({ message: 'Registro de progreso creado.', data: created }); // 201
});
// EV09 Paso 8 — PUT: actualización COMPLETA (exige todos los campos)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = progress.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${id} no existe.` });
  }
  const { userId, workoutId, date, weightKg, notes } = req.body || {};
  if (!userId || !workoutId || !date || weightKg === undefined || notes === undefined) {
    return res.status(400).json({ error: 'Bad Request', message: 'PUT exige recurso completo: userId, workoutId, date, weightKg, notes.' });
  }
  progress[index] = { id, userId, workoutId, date, weightKg, notes };
  return res.status(200).json({ message: 'Progreso actualizado (PUT).', data: progress[index] });
});

// EV09 Paso 8 — PATCH: actualización PARCIAL (solo campos enviados)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const entry = progress.find((p) => p.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${id} no existe.` });
  }
  const allowed = ['userId', 'workoutId', 'date', 'weightKg', 'notes'];
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'PATCH requiere al menos un campo.' });
  }
  const invalid = keys.filter((k) => !allowed.includes(k));
  if (invalid.length > 0) {
    return res.status(400).json({ error: 'Bad Request', message: `Campos no permitidos: ${invalid.join(', ')}` });
  }
  Object.assign(entry, req.body);
  return res.status(200).json({ message: 'Progreso actualizado (PATCH).', data: entry });
});
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
