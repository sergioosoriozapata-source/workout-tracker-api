const express = require('express');

const router = express.Router();

// Stub de integración — el CRUD completo se implementa en feat/users (EV09).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'users');
  res.send('users API ok');
});

module.exports = router;
