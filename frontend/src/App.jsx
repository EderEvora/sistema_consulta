import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Consultas from './pages/Consultas';

function RotaProtegida({ usuario, children }) {
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  function handleLogin(dadosUsuario) {
    setUsuario(dadosUsuario);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        {usuario && <Navbar usuario={usuario} onLogout={handleLogout} />}

        <main className="page-content" style={!usuario ? { padding: 0, maxWidth: 'none' } : undefined}>
          <Routes>
            <Route
              path="/login"
              element={usuario ? <Navigate to="/consultas" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/consultas"
              element={
                <RotaProtegida usuario={usuario}>
                  <Consultas />
                </RotaProtegida>
              }
            />
            <Route path="*" element={<Navigate to={usuario ? '/consultas' : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
