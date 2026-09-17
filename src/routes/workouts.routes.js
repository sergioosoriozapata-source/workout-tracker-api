const express = require('express');

const router = express.Router();

// Stub de integración — el CRUD completo se implementa en feat/workouts (EV09).
router.get('/ping', (req, res) => {
  res.set('X-Resource', 'workouts');
  res.send('workouts API ok');
});

module.exports = router;
