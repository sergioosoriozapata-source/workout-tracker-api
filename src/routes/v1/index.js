const express = require('express');
const usersRoutes = require('./users.routes');
const workoutsRoutes = require('./workouts.routes');
const exercisesRoutes = require('./exercises.routes');
const progressRoutes = require('./progress.routes');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/workouts', workoutsRoutes);
router.use('/exercises', exercisesRoutes);
router.use('/progress', progressRoutes);

module.exports = router;
