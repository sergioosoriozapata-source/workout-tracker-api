const express = require('express');
const workoutsController = require('../../controllers/workouts.controller');
const validateIdParam = require('../../middleware/validateId.middleware');

const router = express.Router();

router.get('/ping', workoutsController.ping);
router.get('/', workoutsController.getAll);
router.get('/:id', validateIdParam, workoutsController.getById);
router.post('/', workoutsController.create);
router.put('/:id', validateIdParam, workoutsController.updatePut);
router.patch('/:id', validateIdParam, workoutsController.updatePatch);
router.delete('/:id', validateIdParam, workoutsController.delete);

module.exports = router;
