const router = require('express').Router();
const { listar } = require('../controllers/profissionais.controller');

router.get('/', listar);

module.exports = router;
