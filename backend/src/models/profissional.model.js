const pool = require('../config/db');

async function listar() {
  const { rows } = await pool.query(`
    SELECT p.id, p.nome, p.email, p.telefone, p.preco_consulta,
           e.nome AS especialidade_nome
    FROM profissionais p
    JOIN especialidades e ON e.id = p.especialidade_id
    ORDER BY p.nome
  `);
  return rows;
}

module.exports = { listar };
