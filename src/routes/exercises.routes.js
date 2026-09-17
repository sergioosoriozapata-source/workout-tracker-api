const express = require('express');
const { exercises } = require('../data/store');

const router = express.Router();

// EV09 Paso 2 — scaffold del router exercises. Endpoints básicos (se implementan por pasos).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'exercises');
  res.send('exercises API ok'); // res.send() para texto plano
});

// EV09 Paso 2 — GET: listar todos y obtener uno por ID (res.json)
router.get('/', (req, res) => {
  res.set('X-Resource', 'exercises');
  return res.status(200).json({ data: exercises, total: exercises.length }); // 200 OK
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id); // req.params
  const exercise = exercises.find((e) => e.id === id);
  if (!exercise) {
    return res.status(404).json({ error: 'Not Found', message: `Ejercicio ${req.params.id} no existe.` });
  }
  return res.status(200).json({ data: exercise });
});

// EV09 Paso 7 — POST: creación de recursos, valida req.body, responde 201 Created
router.post('/', (req, res) => {
  const { workoutId, name, sets, reps, muscleGroup } = req.body || {}; // req.body (express.json)
  if (!workoutId || !name) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: workoutId, name.' });
  }
  const created = {
    id: exercises.length ? Math.max(...exercises.map((e) => e.id)) + 1 : 1,
    workoutId,
    name,
    sets: sets ?? null,
    reps: reps ?? null,
    muscleGroup: muscleGroup ?? null,
  };
  exercises.push(created);
  return res.status(201).json({ message: 'Ejercicio creado.', data: created }); // 201
});
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
