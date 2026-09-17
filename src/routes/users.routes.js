const express = require('express');
const { users, seq } = require('../data/store');
const validateIdParam = require('../middleware/validateId.middleware');

const router = express.Router();

// GET /api/v1/users/ping — demuestra res.send() (texto plano) vs res.json()
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'users');
  res.send('users API ok'); // res.send() para formato texto
});

// GET /api/v1/users — lista + query strings: ?limit=10&search=ana
// EV09 Paso 2 (GET) + Paso 3 (query strings / filtros)
router.get('/', (req, res) => {
  try {
    const { limit, search } = req.query; // req.query
    let result = [...users];

    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: 'Bad Request', message: 'Query ?limit debe ser entero >= 0.' });
      }
      result = result.slice(0, n);
    }

    res.set('X-Resource', 'users');
    res.set('X-Total-Count', String(result.length));
    return res.status(200).json({ data: result, total: result.length }); // 200 OK
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/v1/users/:id — req.params + validación + 404
router.get('/:id', validateIdParam, (req, res) => {
  const user = users.find((u) => u.id === req.validatedId);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
  }
  // Eco didáctico de cabeceras de entrada (req.get / req.headers)
  return res.status(200).json({
    data: user,
    meta: {
      contentType: req.get('Content-Type') || null,
      authorization: req.get('Authorization') || null,
      apiKeyReceived: req.get('X-API-Key') ? true : false,
    },
  });
});

// POST /api/v1/users — creación, valida req.body, responde 201 Created
router.post('/', (req, res) => {
  const { name, email, age, goal } = req.body || {}; // req.body (express.json)
  if (!name || !email) {
    return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: name, email.' });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: 'Bad Request', message: 'El email ya está registrado.' });
  }
  const created = { id: seq.nextUserId(), name, email, age: age ?? null, goal: goal ?? null };
  users.push(created);
  return res.status(201).json({ message: 'Usuario creado.', data: created }); // 201
});

// PUT /api/v1/users/:id — actualización COMPLETA (exige todos los campos)
router.put('/:id', validateIdParam, (req, res) => {
  const index = users.findIndex((u) => u.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
  }
  const { name, email, age, goal } = req.body || {};
  if (!name || !email || age === undefined || goal === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'PUT exige recurso completo: name, email, age, goal.',
    });
  }
  users[index] = { id: req.validatedId, name, email, age, goal };
  return res.status(200).json({ message: 'Usuario actualizado (PUT).', data: users[index] });
});

// PATCH /api/v1/users/:id — actualización PARCIAL (solo campos enviados)
router.patch('/:id', validateIdParam, (req, res) => {
  const user = users.find((u) => u.id === req.validatedId);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
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

// DELETE /api/v1/users/:id — 204 No Content si elimina, 404 si no existe
router.delete('/:id', validateIdParam, (req, res) => {
  const index = users.findIndex((u) => u.id === req.validatedId);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
  }
  users.splice(index, 1);
  return res.status(204).send(); // 204 sin cuerpo
});

module.exports = router;
