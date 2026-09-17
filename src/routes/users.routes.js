const express = require('express');
const { users } = require('../data/store');

const router = express.Router();

// EV09 Paso 2 — scaffold del router users. Endpoints básicos (se implementan por pasos).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'users');
  res.send('users API ok'); // res.send() para texto plano
});

router.get('/', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.get('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.post('/', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.put('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.patch('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
