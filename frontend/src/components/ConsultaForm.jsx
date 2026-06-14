import { useState, useEffect } from 'react';

const STATUS_OPCOES = ['agendada', 'concluida', 'cancelada'];

const valoresIniciais = {
  paciente_id: '',
  profissional_id: '',
  data: '',
  hora: '',
  preco: '',
  status: 'agendada',
  observacoes: '',
};

export default function ConsultaForm({ consulta, pacientes, profissionais, onSubmit, onCancel }) {
  const [form, setForm] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (consulta) {
      setForm({
        paciente_id: String(consulta.paciente_id),
        profissional_id: String(consulta.profissional_id),
        data: consulta.data,
        hora: consulta.hora,
        preco: consulta.preco,
        status: consulta.status,
        observacoes: consulta.observacoes || '',
      });
    } else {
      setForm(valoresIniciais);
    }
    setErros({});
  }, [consulta]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const atualizado = { ...prev, [name]: value };

      // Preenche o preço automaticamente com base no profissional selecionado
      if (name === 'profissional_id') {
        const prof = profissionais.find((p) => String(p.id) === value);
        if (prof) atualizado.preco = prof.preco_consulta;
      }

      return atualizado;
    });
  }

  function validar() {
    const novosErros = {};
    if (!form.paciente_id) novosErros.paciente_id = 'Selecione o paciente';
    if (!form.profissional_id) novosErros.profissional_id = 'Selecione o profissional';
    if (!form.data) novosErros.data = 'Informe a data';
    if (!form.hora) novosErros.hora = 'Informe a hora';
    if (!form.preco || Number(form.preco) <= 0) novosErros.preco = 'Informe um preço válido';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await onSubmit(form);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="paciente_id">Paciente</label>
          <select id="paciente_id" name="paciente_id" value={form.paciente_id} onChange={handleChange}>
            <option value="">Selecione...</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          {erros.paciente_id && <span className="error-text">{erros.paciente_id}</span>}
        </div>

        <div className="field">
          <label htmlFor="profissional_id">Profissional</label>
          <select id="profissional_id" name="profissional_id" value={form.profissional_id} onChange={handleChange}>
            <option value="">Selecione...</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {p.especialidade_nome}
              </option>
            ))}
          </select>
          {erros.profissional_id && <span className="error-text">{erros.profissional_id}</span>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="data">Data</label>
          <input type="date" id="data" name="data" value={form.data} onChange={handleChange} />
          {erros.data && <span className="error-text">{erros.data}</span>}
        </div>

        <div className="field">
          <label htmlFor="hora">Hora</label>
          <input type="time" id="hora" name="hora" value={form.hora} onChange={handleChange} />
          {erros.hora && <span className="error-text">{erros.hora}</span>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="preco">Preço (CVE)</label>
          <input type="number" id="preco" name="preco" step="0.01" value={form.preco} onChange={handleChange} />
          {erros.preco && <span className="error-text">{erros.preco}</span>}
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {STATUS_OPCOES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          value={form.observacoes}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Salvando...' : consulta ? 'Salvar alterações' : 'Agendar consulta'}
        </button>
      </div>
    </form>
  );
}
