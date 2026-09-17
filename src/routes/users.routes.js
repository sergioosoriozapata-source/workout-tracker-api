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

// EV09 Paso 7 — POST: creación de recursos, valida req.body, responde 201 Created
router.post('/', (req, res) => {
  const { name, email, age, goal } = req.body || {}; // req.body (express.json)
  if (!name || !email) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: name, email.' });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: 'Bad Request', message: 'El email ya está registrado.' });
  }
  const created = { id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1, name, email, age: age ?? null, goal: goal ?? null };
  users.push(created);
  return res.status(201).json({ message: 'Usuario creado.', data: created }); // 201
});
// EV09 Paso 8 — PUT: actualización COMPLETA (exige todos los campos)
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${id} no existe.` });
  }
  const { name, email, age, goal } = req.body || {};
  if (!name || !email || age === undefined || goal === undefined) {
    return res.status(400).json({ error: 'Bad Request', message: 'PUT exige recurso completo: name, email, age, goal.' });
  }
  users[index] = { id, name, email, age, goal };
  return res.status(200).json({ message: 'Usuario actualizado (PUT).', data: users[index] });
});

// EV09 Paso 8 — PATCH: actualización PARCIAL (solo campos enviados)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${id} no existe.` });
  }
  const allowed = ['name', 'email', 'age', 'goal'];
  const keys = Object.keys(req.body || {});
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'PATCH requiere al menos un campo.' });
  }
  const invalid = keys.filter((k) => !allowed.includes(k));
  if (invalid.length > 0) {
    return res.status(400).json({ error: 'Bad Request', message: `Campos no permitidos: ${invalid.join(', ')}` });
  }
  Object.assign(user, req.body);
  return res.status(200).json({ message: 'Usuario actualizado (PATCH).', data: user });
});
router.delete('/:id', (req, res) => res.status(501).json({ error: 'Not Implemented' }));

module.exports = router;
