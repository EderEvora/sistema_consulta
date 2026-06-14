# Frontend - Sistema de Gestão de Agendamento de Consultas

Frontend em React para o Tema 4 - Sistema de Gestão de Agendamento de Consultas.

## Como executar

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

## Integração com o Backend

Este frontend espera consumir uma API REST (Express + PostgreSQL) seguindo o
contrato abaixo. Toda a comunicação está centralizada em `src/services/api.js`.

### Endereço base da API

Por padrão está configurado para:

```js
const API_BASE_URL = 'http://localhost:3000/api';
```

Ajuste essa constante em `src/services/api.js` caso o backend rode em outra
porta/endereço.

### Rotas esperadas pelo frontend

| Método | Rota                     | Descrição                          | Autenticação |
|--------|--------------------------|-------------------------------------|--------------|
| POST   | /api/auth/login          | Login (retorna `token` e `usuario`) | Não          |
| GET    | /api/consultas           | Listar todas as consultas           | Sim (Bearer) |
| POST   | /api/consultas           | Criar nova consulta                 | Sim (Bearer) |
| PUT    | /api/consultas/:id       | Atualizar consulta                  | Sim (Bearer) |
| DELETE | /api/consultas/:id       | Apagar consulta                     | Sim (Bearer) |
| GET    | /api/pacientes           | Listar pacientes (para selects)     | Sim (Bearer) |
| GET    | /api/profissionais       | Listar profissionais (para selects) | Sim (Bearer) |

### Formato esperado - POST /api/auth/login

**Request body:**
```json
{ "email": "admin@clinica.cv", "senha": "admin123" }
```

**Response 200:**
```json
{
  "token": "jwt-token-aqui",
  "usuario": { "id": 1, "nome": "Admin Geral", "email": "admin@clinica.cv", "role": "admin" }
}
```

**Response 401 (erro):**
```json
{ "mensagem": "Email ou senha inválidos" }
```

### Formato esperado - GET /api/consultas

Lista de consultas já com os dados de paciente/profissional/especialidade
"achatados" via JOIN (não precisa de requisições extras no frontend):

```json
[
  {
    "id": 1,
    "paciente_id": 1,
    "profissional_id": 1,
    "disponibilidade_id": 1,
    "data": "2026-06-16",
    "hora": "09:00:00",
    "preco": "2500.00",
    "status": "agendada",
    "observacoes": "Consulta de rotina",
    "paciente_nome": "Aurien Silva",
    "profissional_nome": "Dr. João Fortes",
    "especialidade": "Clínica Geral"
  }
]
```

### Formato esperado - POST/PUT /api/consultas

**Request body:**
```json
{
  "paciente_id": 1,
  "profissional_id": 1,
  "data": "2026-06-16",
  "hora": "09:00",
  "preco": "2500.00",
  "status": "agendada",
  "observacoes": "Consulta de rotina"
}
```

A resposta deve retornar o registro criado/atualizado (idealmente já com os
campos `paciente_nome`, `profissional_nome`, `especialidade` via JOIN, para
não precisar recarregar tudo - mas se não vier, o frontend recarrega a lista
completa após cada operação).

### Formato esperado - GET /api/pacientes

```json
[
  { "id": 1, "nome": "Aurien Silva" }
]
```

### Formato esperado - GET /api/profissionais

```json
[
  { "id": 1, "nome": "Dr. João Fortes", "especialidade_nome": "Clínica Geral", "preco_consulta": "2500.00" }
]
```

### Erros (qualquer rota)

Sempre que `res.ok` for `false`, o frontend espera um JSON com a chave
`mensagem`:

```json
{ "mensagem": "Descrição do erro" }
```

### Autenticação

O token retornado no login é salvo em `localStorage` e enviado em todas as
requisições autenticadas como:

```
Authorization: Bearer <token>
```

## Estrutura do projeto

```
src/
├── components/   → componentes reutilizáveis (form, tabela, modal, alertas)
├── pages/        → páginas (Login, Consultas)
├── services/     → api.js (única camada que fala com o backend)
├── App.jsx        → rotas e proteção de autenticação
└── index.css      → estilos globais
```
