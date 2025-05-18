const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/email/:email', userController.getUserByEmail);
router.get('/id/:id', userController.getUserById);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;