const express = require('express');
const { exercises, seq } = require('../data/store');
const validateIdParam = require('../middleware/validateId.middleware');

const router = express.Router();

// GET /api/v1/exercises/ping — demuestra res.send()
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'exercises');
  res.send('exercises API ok');
});

// GET /api/v1/exercises — ?limit=10&muscleGroup=pecho&workoutId=1
router.get('/', (req, res) => {
  try {
    const { limit, muscleGroup, workoutId } = req.query;
    let result = [...exercises];

    if (muscleGroup) {
      result = result.filter((e) => e.muscleGroup === String(muscleGroup).toLowerCase());
    }
    if (workoutId !== undefined) {
      const wid = Number(workoutId);
      if (!Number.isInteger(wid) || wid <= 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?workoutId debe ser entero positivo.' });
      }
      result = result.filter((e) => e.workoutId === wid);
    }
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: 'Bad Request', message: '?limit debe ser entero >= 0.' });
      }
      result = result.slice(0, n);
    }

    res.set('X-Resource', 'exercises');
    res.set('X-Total-Count', String(result.length));
    return res.status(200).json({ data: result, total: result.length });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/v1/exercises/:id
router.get('/:id', validateIdParam, (req, res) => {
  const exercise = exercises.find((e) => e.id === req.validatedId);
  if (!exercise) {
    return res.status(404).json({ error: 'Not Found', message: `Ejercicio ${req.validatedId} no existe.` });
  }
  return res.status(200).json({ data: exercise });
});

// POST /api/v1/exercises — 201 Created
router.post('/', (req, res) => {
  const { workoutId, name, sets, reps, muscleGroup } = req.body || {};
  if (!workoutId || !name) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: workoutId, name.' });
  }
  const created = {
    id: seq.nextExerciseId(),
    workoutId,
    name,
    sets: sets ?? null,
    reps: reps ?? null,
    muscleGroup: muscleGroup ?? null,
  };
  exercises.push(created);
  return res.status(201).json({ message: 'Ejercicio creado.', data: created });
});

// PUT /api/v1/exercises/:id — completa
router.put('/:id', validateIdParam, (req, res) => {
  const index = exercises.findIndex((e) => e.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Ejercicio ${req.validatedId} no existe.` });
  }
  const { workoutId, name, sets, reps, muscleGroup } = req.body || {};
  if (!workoutId || !name || sets === undefined || reps === undefined || !muscleGroup) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'PUT exige recurso completo: workoutId, name, sets, reps, muscleGroup.',
    });
  }
  exercises[index] = { id: req.validatedId, workoutId, name, sets, reps, muscleGroup };
  return res.status(200).json({ message: 'Ejercicio actualizado (PUT).', data: exercises[index] });
});

// PATCH /api/v1/exercises/:id — parcial
router.patch('/:id', validateIdParam, (req, res) => {
  const exercise = exercises.find((e) => e.id === req.validatedId);
  if (!exercise) {
    return res.status(404).json({ error: 'Not Found', message: `Ejercicio ${req.validatedId} no existe.` });
  }
  const allowed = ['workoutId', 'name', 'sets', 'reps', 'muscleGroup'];
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'PATCH requiere al menos un campo.' });
  }
  const invalid = keys.filter((k) => !allowed.includes(k));
  if (invalid.length > 0) {
    return res.status(400).json({ error: 'Bad Request', message: `Campos no permitidos: ${invalid.join(', ')}` });
  }
  Object.assign(exercise, req.body);
  return res.status(200).json({ message: 'Ejercicio actualizado (PATCH).', data: exercise });
});

// DELETE /api/v1/exercises/:id — 204
router.delete('/:id', validateIdParam, (req, res) => {
  const index = exercises.findIndex((e) => e.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Ejercicio ${req.validatedId} no existe.` });
  }
  exercises.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
