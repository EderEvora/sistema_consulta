const Profissional = require('../models/profissional.model');

async function listar(req, res, next) {
  try {
    res.json(await Profissional.listar());
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar };
