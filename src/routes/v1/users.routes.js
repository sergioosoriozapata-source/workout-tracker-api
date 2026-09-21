const express = require('express');
const usersController = require('../../controllers/users.controller');
const validateIdParam = require('../../middleware/validateId.middleware');

const router = express.Router();

router.get('/ping', usersController.ping);
router.get('/', usersController.getAll);
router.get('/:id', validateIdParam, usersController.getById);
router.post('/', usersController.create);
router.put('/:id', validateIdParam, usersController.updatePut);
router.patch('/:id', validateIdParam, usersController.updatePatch);
router.delete('/:id', validateIdParam, usersController.delete);

module.exports = router;
