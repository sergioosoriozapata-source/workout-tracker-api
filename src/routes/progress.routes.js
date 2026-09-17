const express = require('express');

const router = express.Router();

// Stub de integración — el CRUD completo se implementa en feat/progress (EV09).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'progress');
  res.send('progress API ok');
});

module.exports = router;
