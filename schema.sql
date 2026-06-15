-- ============================================================
-- Sistema de Gestão de Agendamento de Consultas
-- Script de criação da Base de Dados (PostgreSQL)
-- ============================================================

-- Apagar tabelas se já existirem (ordem inversa por causa das FKs)
DROP TABLE IF EXISTS consultas;
DROP TABLE IF EXISTS disponibilidades;
DROP TABLE IF EXISTS profissionais;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS especialidades;
DROP TABLE IF EXISTS clinicas;
DROP TABLE IF EXISTS usuarios;

-- ============================================================
-- TABELA: usuarios (autenticação)
-- ============================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'recepcionista', -- admin, recepcionista
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA: clinicas
-- ============================================================
CREATE TABLE clinicas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA: especialidades
-- ============================================================
CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- ============================================================
-- TABELA: pacientes
-- ============================================================
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA: profissionais
-- ============================================================
CREATE TABLE profissionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    especialidade_id INTEGER NOT NULL REFERENCES especialidades(id) ON DELETE RESTRICT,
    clinica_id INTEGER NOT NULL REFERENCES clinicas(id) ON DELETE CASCADE,
    preco_consulta NUMERIC(10,2) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA: disponibilidades (vagas/horários do profissional)
-- ============================================================
CREATE TABLE disponibilidades (
    id SERIAL PRIMARY KEY,
    profissional_id INTEGER NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'livre', -- livre, ocupado
    criado_em TIMESTAMP DEFAULT NOW(),
    UNIQUE (profissional_id, data, hora_inicio)
);

-- ============================================================
-- TABELA: consultas (recurso principal - CRUD obrigatório)
-- ============================================================
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    profissional_id INTEGER NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
    disponibilidade_id INTEGER REFERENCES disponibilidades(id) ON DELETE SET NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'agendada', -- agendada, concluida, cancelada
    observacoes VARCHAR(255),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DADOS INICIAIS (SEEDS) - mínimo 5 registros por tabela
-- ============================================================

-- USUARIOS (senhas em texto simples apenas para fins de teste/demo)
INSERT INTO usuarios (nome, email, senha, role) VALUES
('Admin Geral', 'admin@clinica.cv', 'admin123', 'admin'),
('Eder Recepção', 'eder@clinica.cv', 'eder123', 'recepcionista'),
('Marcos Recepção', 'marcos@clinica.cv', 'marcos123', 'recepcionista'),
('Sofia Lopes', 'sofia@clinica.cv', 'sofia123', 'recepcionista'),
('Carlos Tavares', 'carlos@clinica.cv', 'carlos123', 'admin');

-- CLINICAS
INSERT INTO clinicas (nome, endereco, telefone) VALUES
('Clínica Mindelo Saúde', 'Rua da Praia, Mindelo, São Vicente', '2321001'),
('Clínica São João', 'Avenida Marginal, Mindelo, São Vicente', '2321002'),
('Centro Médico Lumumba', 'Rua Patrice Lumumba, Mindelo', '2321003'),
('Clínica Monte Sossego', 'Bairro Monte Sossego, Mindelo', '2321004'),
('Clínica Fonte Cónsul', 'Fonte Cónsul, Mindelo, São Vicente', '2321005');

-- ESPECIALIDADES
INSERT INTO especialidades (nome, descricao) VALUES
('Clínica Geral', 'Consultas gerais e check-ups de rotina'),
('Pediatria', 'Cuidados de saúde para crianças'),
('Cardiologia', 'Diagnóstico e tratamento de doenças do coração'),
('Dermatologia', 'Tratamento de doenças da pele'),
('Ginecologia', 'Saúde reprodutiva feminina');

-- PACIENTES
INSERT INTO pacientes (nome, email, telefone, data_nascimento) VALUES
('Aurien Silva', 'aurien@email.com', '9911001', '1995-03-12'),
('Herisene Gomes', 'herisene@email.com', '9911002', '1998-07-22'),
('Elvin Tavares', 'elvin@email.com', '9911003', '2000-01-15'),
('Kelly Andrade', 'kelly@email.com', '9911004', '1992-11-30'),
('Jarni Pires', 'jarni@email.com', '9911005', '1989-05-09'),
('Leonardo Lima', 'leonardo@email.com', '9911006', '1996-09-18');

-- PROFISSIONAIS
INSERT INTO profissionais (nome, email, telefone, especialidade_id, clinica_id, preco_consulta) VALUES
('Dr. João Fortes', 'joao.fortes@clinica.cv', '9922001', 1, 1, 2500.00),
('Dra. Bruna Aulindo', 'bruna.aulindo@clinica.cv', '9922002', 2, 1, 3000.00),
('Dr. Marcos Reis', 'marcos.reis@clinica.cv', '9922003', 3, 2, 4500.00),
('Dra. Eder Santos', 'eder.santos@clinica.cv', '9922004', 4, 3, 3500.00),
('Dra. Aulindo Vera', 'aulindo.vera@clinica.cv', '9922005', 5, 4, 4000.00);

-- DISPONIBILIDADES
INSERT INTO disponibilidades (profissional_id, data, hora_inicio, hora_fim, status) VALUES
(1, '2026-06-16', '09:00', '09:30', 'ocupado'),
(1, '2026-06-16', '09:30', '10:00', 'livre'),
(2, '2026-06-17', '14:00', '14:30', 'livre'),
(3, '2026-06-18', '10:00', '10:30', 'ocupado'),
(4, '2026-06-19', '15:00', '15:30', 'livre'),
(5, '2026-06-20', '11:00', '11:30', 'livre');

-- CONSULTAS
INSERT INTO consultas (paciente_id, profissional_id, disponibilidade_id, data, hora, preco, status, observacoes) VALUES
(1, 1, 1, '2026-06-16', '09:00', 2500.00, 'agendada', 'Consulta de rotina'),
(2, 2, NULL, '2026-06-17', '08:30', 3000.00, 'concluida', 'Avaliação pediátrica realizada'),
(3, 3, 4, '2026-06-18', '10:00', 4500.00, 'agendada', 'Acompanhamento cardíaco'),
(4, 4, NULL, '2026-06-10', '16:00', 3500.00, 'cancelada', 'Paciente remarcou'),
(5, 5, NULL, '2026-06-12', '11:30', 4000.00, 'concluida', 'Consulta de seguimento'),
(6, 1, NULL, '2026-06-22', '09:30', 2500.00, 'agendada', 'Primeira consulta');
