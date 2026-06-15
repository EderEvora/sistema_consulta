const Consulta = require('../models/consulta.model');

function naoEncontrada() {
  const erro = new Error('Consulta não encontrada');
  erro.status = 404;
  return erro;
}

async function listar(req, res, next) {
  try {
    res.json(await Consulta.listar());
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const consulta = await Consulta.buscarPorId(req.params.id);
    if (!consulta) throw naoEncontrada();
    res.json(consulta);
  } catch (erro) {
    next(erro);
  }
}

async function criar(req, res, next) {
  try {
    res.status(201).json(await Consulta.criar(req.body));
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const consulta = await Consulta.atualizar(req.params.id, req.body);
    if (!consulta) throw naoEncontrada();
    res.json(consulta);
  } catch (erro) {
    next(erro);
  }
}

async function apagar(req, res, next) {
  try {
    const ok = await Consulta.apagar(req.params.id);
    if (!ok) throw naoEncontrada();
    res.json({ mensagem: 'Consulta apagada com sucesso' });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, apagar };
