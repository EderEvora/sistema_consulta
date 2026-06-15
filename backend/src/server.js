require('dotenv').config();
const express = require('express');
const cors = require('cors');

const autenticar = require('./middleware/auth.middleware');
const authRoutes = require('./routes/auth.routes');
const consultasRoutes = require('./routes/consultas.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const profissionaisRoutes = require('./routes/profissionais.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/consultas', autenticar, consultasRoutes);
app.use('/api/pacientes', autenticar, pacientesRoutes);
app.use('/api/profissionais', autenticar, profissionaisRoutes);

// Tratamento de erros centralizado.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ mensagem: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
