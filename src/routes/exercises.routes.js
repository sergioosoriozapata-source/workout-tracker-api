const express = require('express');

const router = express.Router();

// Stub de integración — el CRUD completo se implementa en feat/exercises (EV09).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'exercises');
  res.send('exercises API ok');
});

module.exports = router;
