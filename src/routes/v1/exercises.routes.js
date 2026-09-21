const express = require('express');
const exercisesController = require('../../controllers/exercises.controller');
const validateIdParam = require('../../middleware/validateId.middleware');

const router = express.Router();

router.get('/ping', exercisesController.ping);
router.get('/', exercisesController.getAll);
router.get('/:id', validateIdParam, exercisesController.getById);
router.post('/', exercisesController.create);
router.put('/:id', validateIdParam, exercisesController.updatePut);
router.patch('/:id', validateIdParam, exercisesController.updatePatch);
router.delete('/:id', validateIdParam, exercisesController.delete);

module.exports = router;
