const STATUS_VALIDOS = ['agendada', 'concluida', 'cancelada'];

function validarLogin(req, res, next) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }
  next();
}

function validarConsulta(req, res, next) {
  const { paciente_id, profissional_id, data, hora, preco, status } = req.body;
  const erros = [];

  if (!paciente_id) erros.push('paciente_id é obrigatório');
  if (!profissional_id) erros.push('profissional_id é obrigatório');
  if (!data) erros.push('data é obrigatória');
  if (!hora) erros.push('hora é obrigatória');
  if (preco === undefined || preco === null || Number(preco) <= 0) {
    erros.push('preco deve ser um número maior que zero');
  }
  if (status && !STATUS_VALIDOS.includes(status)) {
    erros.push(`status deve ser um de: ${STATUS_VALIDOS.join(', ')}`);
  }

  if (erros.length > 0) {
    return res.status(400).json({ mensagem: erros.join('; ') });
  }
  next();
}

module.exports = { validarLogin, validarConsulta };
