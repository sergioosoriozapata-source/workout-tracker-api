const express = require('express');
const { workouts, seq } = require('../data/store');
const validateIdParam = require('../middleware/validateId.middleware');

const router = express.Router();

// GET /api/v1/workouts/ping — demuestra res.send()
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'workouts');
  res.send('workouts API ok');
});

// GET /api/v1/workouts — ?limit=10&level=intermedio&userId=1
router.get('/', (req, res) => {
  try {
    const { limit, level, userId } = req.query;
    let result = [...workouts];

    if (level) {
      result = result.filter((w) => w.level === String(level).toLowerCase());
    }
    if (userId !== undefined) {
      const uid = Number(userId);
      if (!Number.isInteger(uid) || uid <= 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?userId debe ser entero positivo.' });
      }
      result = result.filter((w) => w.userId === uid);
    }
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?limit debe ser entero >= 0.' });
      }
      result = result.slice(0, n);
    }

    res.set('X-Resource', 'workouts');
    res.set('X-Total-Count', String(result.length));
    return res.status(200).json({ data: result, total: result.length });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/v1/workouts/:id
router.get('/:id', validateIdParam, (req, res) => {
  const workout = workouts.find((w) => w.id === req.validatedId);
  if (!workout) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${req.validatedId} no existe.` });
  }
  return res.status(200).json({
    data: workout,
    meta: {
      contentType: req.get('Content-Type') || null,
      authorization: req.get('Authorization') || null,
      apiKeyReceived: req.get('X-API-Key') ? true : false,
    },
  });
});

// POST /api/v1/workouts — 201 Created
router.post('/', (req, res) => {
  const { userId, name, date, durationMin, level } = req.body || {};
  if (!userId || !name) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: userId, name.' });
  }
  const created = {
    id: seq.nextWorkoutId(),
    userId,
    name,
    date: date ?? new Date().toISOString().slice(0, 10),
    durationMin: durationMin ?? null,
    level: level ?? 'principiante',
  };
  workouts.push(created);
  return res.status(201).json({ message: 'Rutina creada.', data: created });
});

// PUT /api/v1/workouts/:id — actualización completa
router.put('/:id', validateIdParam, (req, res) => {
  const index = workouts.findIndex((w) => w.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${req.validatedId} no existe.` });
  }
  const { userId, name, date, durationMin, level } = req.body || {};
  if (!userId || !name || !date || durationMin === undefined || !level) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'PUT exige recurso completo: userId, name, date, durationMin, level.',
    });
  }
  workouts[index] = { id: req.validatedId, userId, name, date, durationMin, level };
  return res.status(200).json({ message: 'Rutina actualizada (PUT).', data: workouts[index] });
});

// PATCH /api/v1/workouts/:id — actualización parcial
router.patch('/:id', validateIdParam, (req, res) => {
  const workout = workouts.find((w) => w.id === req.validatedId);
  if (!workout) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${req.validatedId} no existe.` });
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

// DELETE /api/v1/workouts/:id — 204
router.delete('/:id', validateIdParam, (req, res) => {
  const index = workouts.findIndex((w) => w.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Rutina ${req.validatedId} no existe.` });
  }
  workouts.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
