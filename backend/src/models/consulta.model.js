const pool = require('../config/db');

const SELECT_BASE = `
  SELECT c.id, c.paciente_id, c.profissional_id, c.disponibilidade_id,
         c.data, c.hora, c.preco, c.status, c.observacoes, c.criado_em,
         pa.nome AS paciente_nome,
         pr.nome AS profissional_nome,
         e.nome  AS especialidade
  FROM consultas c
  JOIN pacientes pa     ON pa.id = c.paciente_id
  JOIN profissionais pr ON pr.id = c.profissional_id
  JOIN especialidades e ON e.id = pr.especialidade_id
`;

async function listar() {
  const { rows } = await pool.query(`${SELECT_BASE} ORDER BY c.data, c.hora`);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_BASE} WHERE c.id = $1`, [id]);
  return rows[0];
}

async function criar(d) {
  const { rows } = await pool.query(
    `INSERT INTO consultas (paciente_id, profissional_id, data, hora, preco, status, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [d.paciente_id, d.profissional_id, d.data, d.hora, d.preco, d.status || 'agendada', d.observacoes || null]
  );
  return buscarPorId(rows[0].id);
}

async function atualizar(id, d) {
  const { rowCount } = await pool.query(
    `UPDATE consultas
     SET paciente_id = $1, profissional_id = $2, data = $3, hora = $4,
         preco = $5, status = $6, observacoes = $7
     WHERE id = $8`,
    [d.paciente_id, d.profissional_id, d.data, d.hora, d.preco, d.status || 'agendada', d.observacoes || null, id]
  );
  if (rowCount === 0) return null;
  return buscarPorId(id);
}

async function apagar(id) {
  const { rowCount } = await pool.query('DELETE FROM consultas WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, apagar };
