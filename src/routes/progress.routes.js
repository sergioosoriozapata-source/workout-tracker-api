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

router.post('/', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
