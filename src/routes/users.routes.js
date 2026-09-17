const express = require('express');
const { users } = require('../data/store');

const router = express.Router();

// EV09 Paso 2 — scaffold del router users. Endpoints básicos (se implementan por pasos).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'users');
  res.send('users API ok'); // res.send() para texto plano
});

// EV09 Paso 2 — GET: listar todos y obtener uno por ID (res.json)
router.get('/', (req, res) => {
  res.set('X-Resource', 'users');
  return res.status(200).json({ data: users, total: users.length }); // 200 OK
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id); // req.params
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.params.id} no existe.` });
  }
  return res.status(200).json({ data: user });
});

router.post('/', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
