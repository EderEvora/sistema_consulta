# Sistema de Gestão de Agendamento de Consultas

Aplicação fullstack **PERN** (PostgreSQL + Express + React + Node.js) para agendar
consultas com profissionais de saúde. Trabalho Prático Nº 2 — Desenvolvimento de
Aplicações Web (Universidade do Mindelo).

## Arquitetura

```
sistema_consulta/
├── docker-compose.yml      # Sobe PostgreSQL + backend
├── schema.sql              # Criação das tabelas + dados iniciais (seeds)
├── backend/                # API Express
│   └── src/
│       ├── server.js       # App + middleware de erros centralizado
│       ├── config/db.js    # Pool de conexão PostgreSQL
│       ├── routes/         # Definição das rotas
│       ├── controllers/    # Handlers das rotas
│       ├── models/         # Acesso ao banco (SQL)
│       └── middleware/     # auth + validação
└── frontend/               # SPA React (Vite)
    └── src/
        ├── pages/          # Login, Consultas
        ├── components/     # Componentes reutilizáveis
        └── services/api.js # Camada de chamadas à API
```

## Como executar

### 1. Backend + Base de dados (Docker)

Requer apenas Docker. Na raiz do projeto:

```bash
docker compose up -d --build
```

Isto sobe:
- **PostgreSQL** na porta `5432` (a base `agendamento` é criada e populada
  automaticamente a partir de `schema.sql` no primeiro arranque).
- **Backend Express** em `http://localhost:3000`.

Para parar: `docker compose down`. Para recriar a base do zero (re-executar os
seeds): `docker compose down -v && docker compose up -d --build`.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. O frontend consome a API em `http://localhost:3000/api`.

### Login de teste

| Email              | Senha      | Role           |
|--------------------|------------|----------------|
| `admin@clinica.cv` | `admin123` | admin          |
| `eder@clinica.cv`  | `eder123`  | recepcionista  |

## API

**Endereço base:** `http://localhost:3000/api`

| Método | Rota                 | Auth | Descrição                       |
|--------|----------------------|------|---------------------------------|
| POST   | `/auth/login`        | Não  | Autenticar e obter token        |
| GET    | `/consultas`         | Sim  | Listar todas as consultas       |
| GET    | `/consultas/:id`     | Sim  | Obter uma consulta              |
| POST   | `/consultas`         | Sim  | Criar consulta                  |
| PUT    | `/consultas/:id`     | Sim  | Atualizar consulta              |
| DELETE | `/consultas/:id`     | Sim  | Apagar consulta                 |
| GET    | `/pacientes`         | Sim  | Listar pacientes (para selects) |
| GET    | `/profissionais`     | Sim  | Listar profissionais            |

As rotas privadas exigem o header `Authorization: Bearer <token>`. Erros são
retornados como `{ "mensagem": "..." }` (status `400` validação, `401` auth,
`404` não encontrado, `500` interno).

### Exemplos com cURL

Obter o token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica.cv","senha":"admin123"}'
```

Resposta: `{ "token": "<JWT>", "usuario": { ... } }`. Use o token nas chamadas:

```bash
TOKEN="<cole-o-token-aqui>"

# Listar
curl http://localhost:3000/api/consultas -H "Authorization: Bearer $TOKEN"

# Criar
curl -X POST http://localhost:3000/api/consultas \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"paciente_id":2,"profissional_id":3,"data":"2026-07-01","hora":"10:30","preco":4500,"status":"agendada","observacoes":"Primeira consulta"}'

# Atualizar
curl -X PUT http://localhost:3000/api/consultas/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"paciente_id":2,"profissional_id":3,"data":"2026-07-01","hora":"10:30","preco":4500,"status":"concluida","observacoes":"Realizada"}'

# Apagar
curl -X DELETE http://localhost:3000/api/consultas/1 -H "Authorization: Bearer $TOKEN"
```

## Base de dados

Diagrama ER: ver `dbdiagram (1).pdf`. Script completo de criação e seeds:
`schema.sql` (executado automaticamente pelo Docker no primeiro arranque).

Tabelas: `usuarios`, `clinicas`, `especialidades`, `pacientes`, `profissionais`,
`disponibilidades`, `consultas` — cada uma com pelo menos 5 registos iniciais.
O recurso principal (CRUD) é `consultas`.
