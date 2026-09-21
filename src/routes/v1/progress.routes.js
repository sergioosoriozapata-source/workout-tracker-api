const express = require('express');
const progressController = require('../../controllers/progress.controller');
const validateIdParam = require('../../middleware/validateId.middleware');

const router = express.Router();

router.get('/ping', progressController.ping);
router.get('/', progressController.getAll);
router.get('/:id', validateIdParam, progressController.getById);
router.post('/', progressController.create);
router.put('/:id', validateIdParam, progressController.updatePut);
router.patch('/:id', validateIdParam, progressController.updatePatch);
router.delete('/:id', validateIdParam, progressController.delete);

module.exports = router;
