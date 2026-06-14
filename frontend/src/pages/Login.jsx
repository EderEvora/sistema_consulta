import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import MessageAlert from '../components/MessageAlert';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@clinica.cv');
  const [senha, setSenha] = useState('admin123');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resultado = await login(email, senha);
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      onLogin(resultado.usuario);
      navigate('/consultas');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Agenda Saúde</h1>
        <p className="subtitle">Faça login para gerir os agendamentos de consultas.</p>

        <MessageAlert type="error" message={erro} onClose={() => setErro('')} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
