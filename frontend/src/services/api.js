// ============================================================
// Camada de serviço da API
// ============================================================
// ============================================================

const API_BASE_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tratarResposta(res, mensagemErroPadrao) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.mensagem || mensagemErroPadrao);
  }
  return res.json();
}

// ------------------------------------------------------------
// AUTENTICAÇÃO
// ------------------------------------------------------------
export async function login(email, senha) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  return tratarResposta(res, 'Erro ao fazer login');
}

// ------------------------------------------------------------
// CONSULTAS (CRUD principal)
// ------------------------------------------------------------
export async function listarConsultas() {
  const res = await fetch(`${API_BASE_URL}/consultas`, {
    headers: { ...authHeaders() },
  });
  return tratarResposta(res, 'Erro ao carregar consultas');
}

export async function criarConsulta(dados) {
  const res = await fetch(`${API_BASE_URL}/consultas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return tratarResposta(res, 'Erro ao criar consulta');
}

export async function atualizarConsulta(id, dados) {
  const res = await fetch(`${API_BASE_URL}/consultas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return tratarResposta(res, 'Erro ao atualizar consulta');
}

export async function apagarConsulta(id) {
  const res = await fetch(`${API_BASE_URL}/consultas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return tratarResposta(res, 'Erro ao apagar consulta');
}

// ------------------------------------------------------------
// Dados auxiliares (para preencher selects do formulário)
// ------------------------------------------------------------
export async function listarPacientes() {
  const res = await fetch(`${API_BASE_URL}/pacientes`, {
    headers: { ...authHeaders() },
  });
  return tratarResposta(res, 'Erro ao carregar pacientes');
}

export async function listarProfissionais() {
  const res = await fetch(`${API_BASE_URL}/profissionais`, {
    headers: { ...authHeaders() },
  });
  return tratarResposta(res, 'Erro ao carregar profissionais');
}
