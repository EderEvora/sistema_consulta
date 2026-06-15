const router = require('express').Router();
const ctrl = require('../controllers/consultas.controller');
const { validarConsulta } = require('../middleware/validation.middleware');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', validarConsulta, ctrl.criar);
router.put('/:id', validarConsulta, ctrl.atualizar);
router.delete('/:id', ctrl.apagar);

module.exports = router;
