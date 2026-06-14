function formatarData(dataISO) {
  if (!dataISO) return '-';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' CVE';
}

export default function ConsultaTable({ consultas, onEditar, onApagar }) {
  if (consultas.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">Nenhuma consulta agendada.</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Profissional</th>
            <th>Especialidade</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => (
            <tr key={c.id}>
              <td>{formatarData(c.data)}</td>
              <td>{c.hora?.slice(0, 5)}</td>
              <td>{c.paciente_nome}</td>
              <td>{c.profissional_nome}</td>
              <td>{c.especialidade}</td>
              <td>{formatarPreco(c.preco)}</td>
              <td>
                <span className={`badge badge-${c.status}`}>{c.status}</span>
              </td>
              <td>
                <div className="actions-cell">
                  <button className="btn-edit" onClick={() => onEditar(c)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => onApagar(c)}>
                    Apagar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
