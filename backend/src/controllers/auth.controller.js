const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto_dev';

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      const erro = new Error('Email ou senha inválidos');
      erro.status = 401;
      throw erro;
    }

    const token = jwt.sign({ id: usuario.id, role: usuario.role }, SECRET, { expiresIn: '7d' });

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { login };
