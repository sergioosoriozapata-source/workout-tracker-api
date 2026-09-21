const { users, seq } = require('../data/store');

const usersController = {
  ping: (req, res) => {
    res.set('X-Resource', 'users');
    res.send('users API ok');
  },

  getAll: (req, res) => {
    try {
      const { limit, search, role } = req.query;
      let result = [...users];

      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
      }
      if (role) {
        const r = String(role).toLowerCase();
        result = result.filter((u) => u.role && u.role.toLowerCase() === r);
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
      return res.status(200).json({ data: result, total: result.length });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  getById: (req, res) => {
    const user = users.find((u) => u.id === req.validatedId);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
    }
    return res.status(200).json({ data: user });
  },

  create: (req, res) => {
    const { name, email, age, goal, role } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: 'Bad Request', message: 'Campos requeridos: name, email.' });
    }
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ error: 'Bad Request', message: 'El email ya está registrado.' });
    }
    const created = {
      id: seq.nextUserId(),
      name,
      email,
      age: age ?? null,
      goal: goal ?? null,
      role: role ?? 'user',
    };
    users.push(created);
    return res.status(201).json({ message: 'Usuario creado.', data: created });
  },

  updatePut: (req, res) => {
    const index = users.findIndex((u) => u.id === req.validatedId);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
    }
    const { name, email, age, goal, role } = req.body || {};
    if (!name || !email || age === undefined || goal === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'PUT exige recurso completo: name, email, age, goal.',
      });
    }
    users[index] = { id: req.validatedId, name, email, age, goal, role: role ?? users[index].role ?? 'user' };
    return res.status(200).json({ message: 'Usuario actualizado (PUT).', data: users[index] });
  },

  updatePatch: (req, res) => {
    const user = users.find((u) => u.id === req.validatedId);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
    }
    const allowed = ['name', 'email', 'age', 'goal', 'role'];
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
  },

  delete: (req, res) => {
    const index = users.findIndex((u) => u.id === req.validatedId);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: `Usuario ${req.validatedId} no existe.` });
    }
    users.splice(index, 1);
    return res.status(204).send();
  },
};

module.exports = usersController;
