const router = require('express').Router();
const { listar } = require('../controllers/pacientes.controller');

router.get('/', listar);

module.exports = router;
