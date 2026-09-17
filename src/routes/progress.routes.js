const express = require('express');
const { progress, seq } = require('../data/store');
const validateIdParam = require('../middleware/validateId.middleware');

const router = express.Router();

// GET /api/v1/progress/ping — demuestra res.send()
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'progress');
  res.send('progress API ok');
});

// GET /api/v1/progress — ?limit=10&userId=1&workoutId=1
router.get('/', (req, res) => {
  try {
    const { limit, userId, workoutId } = req.query;
    let result = [...progress];

    if (userId !== undefined) {
      const uid = Number(userId);
      if (!Number.isInteger(uid) || uid <= 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?userId debe ser entero positivo.' });
      }
      result = result.filter((p) => p.userId === uid);
    }
    if (workoutId !== undefined) {
      const wid = Number(workoutId);
      if (!Number.isInteger(wid) || wid <= 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?workoutId debe ser entero positivo.' });
      }
      result = result.filter((p) => p.workoutId === wid);
    }
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?limit debe ser entero >= 0.' });
      }
      result = result.slice(0, n);
    }

    res.set('X-Resource', 'progress');
    res.set('X-Total-Count', String(result.length));
    return res.status(200).json({ data: result, total: result.length });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/v1/progress/:id
router.get('/:id', validateIdParam, (req, res) => {
  const entry = progress.find((p) => p.id === req.validatedId);
  if (!entry) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${req.validatedId} no existe.` });
  }
  return res.status(200).json({
    data: entry,
    meta: {
      contentType: req.get('Content-Type') || null,
      authorization: req.get('Authorization') || null,
      apiKeyReceived: req.get('X-API-Key') ? true : false,
    },
  });
});

// POST /api/v1/progress — 201 Created
router.post('/', (req, res) => {
  const { userId, workoutId, date, weightKg, notes } = req.body || {};
  if (!userId || !workoutId) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: userId, workoutId.' });
  }
  const created = {
    id: seq.nextProgressId(),
    userId,
    workoutId,
    date: date ?? new Date().toISOString().slice(0, 10),
    weightKg: weightKg ?? null,
    notes: notes ?? null,
  };
  progress.push(created);
  return res.status(201).json({ message: 'Registro de progreso creado.', data: created });
});

// PUT /api/v1/progress/:id — completa
router.put('/:id', validateIdParam, (req, res) => {
  const index = progress.findIndex((p) => p.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${req.validatedId} no existe.` });
  }
  const { userId, workoutId, date, weightKg, notes } = req.body || {};
  if (!userId || !workoutId || !date || weightKg === undefined || notes === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'PUT exige recurso completo: userId, workoutId, date, weightKg, notes.',
    });
  }
  progress[index] = { id: req.validatedId, userId, workoutId, date, weightKg, notes };
  return res.status(200).json({ message: 'Progreso actualizado (PUT).', data: progress[index] });
});

// PATCH /api/v1/progress/:id — parcial
router.patch('/:id', validateIdParam, (req, res) => {
  const entry = progress.find((p) => p.id === req.validatedId);
  if (!entry) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${req.validatedId} no existe.` });
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

// DELETE /api/v1/progress/:id — 204
router.delete('/:id', validateIdParam, (req, res) => {
  const index = progress.findIndex((p) => p.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Progreso ${req.validatedId} no existe.` });
  }
  progress.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
