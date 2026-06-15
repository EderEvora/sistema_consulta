const router = require('express').Router();
const { login } = require('../controllers/auth.controller');
const { validarLogin } = require('../middleware/validation.middleware');

router.post('/login', validarLogin, login);

module.exports = router;
