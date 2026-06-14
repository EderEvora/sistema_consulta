export default function Navbar({ usuario, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="dot" />
        Agenda Saúde
      </div>
      {usuario && (
        <div className="navbar-user">
          <span>{usuario.nome}</span>
          <button className="btn-logout" onClick={onLogout}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
