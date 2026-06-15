const Paciente = require('../models/paciente.model');

async function listar(req, res, next) {
  try {
    res.json(await Paciente.listar());
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar };
