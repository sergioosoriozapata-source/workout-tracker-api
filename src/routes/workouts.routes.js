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
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
