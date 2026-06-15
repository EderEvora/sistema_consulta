const pool = require('../config/db');

async function listar() {
  const { rows } = await pool.query(
    'SELECT id, nome, email, telefone, data_nascimento FROM pacientes ORDER BY nome'
  );
  return rows;
}

module.exports = { listar };
