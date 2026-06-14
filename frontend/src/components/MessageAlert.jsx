export default function MessageAlert({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Fechar mensagem">
          ×
        </button>
      )}
    </div>
  );
}
