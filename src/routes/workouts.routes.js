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

router.post('/', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
