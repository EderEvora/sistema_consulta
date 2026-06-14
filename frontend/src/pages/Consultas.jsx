import { useState, useEffect } from 'react';
import {
  listarConsultas,
  criarConsulta,
  atualizarConsulta,
  apagarConsulta,
  listarPacientes,
  listarProfissionais,
} from '../services/api';
import ConsultaTable from '../components/ConsultaTable';
import ConsultaForm from '../components/ConsultaForm';
import Modal from '../components/Modal';
import MessageAlert from '../components/MessageAlert';

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [consultaEditando, setConsultaEditando] = useState(null);
  const [consultaParaApagar, setConsultaParaApagar] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [consultasData, pacientesData, profissionaisData] = await Promise.all([
        listarConsultas(),
        listarPacientes(),
        listarProfissionais(),
      ]);
      setConsultas(consultasData);
      setPacientes(pacientesData);
      setProfissionais(profissionaisData);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovo() {
    setConsultaEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(consulta) {
    setConsultaEditando(consulta);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setConsultaEditando(null);
  }

  async function handleSubmit(dados) {
    setErro('');
    try {
      if (consultaEditando) {
        await atualizarConsulta(consultaEditando.id, dados);
        setSucesso('Consulta atualizada com sucesso.');
      } else {
        await criarConsulta(dados);
        setSucesso('Consulta agendada com sucesso.');
      }
      fecharModal();
      await carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function confirmarApagar() {
    if (!consultaParaApagar) return;
    setErro('');
    try {
      await apagarConsulta(consultaParaApagar.id);
      setSucesso('Consulta apagada com sucesso.');
      setConsultaParaApagar(null);
      await carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Consultas</h1>
          <p>Visualize, agende, edite ou cancele consultas.</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          + Nova consulta
        </button>
      </div>

      <MessageAlert type="error" message={erro} onClose={() => setErro('')} />
      <MessageAlert type="success" message={sucesso} onClose={() => setSucesso('')} />

      {carregando ? (
        <p className="loading-text">Carregando consultas...</p>
      ) : (
        <ConsultaTable
          consultas={consultas}
          onEditar={abrirEdicao}
          onApagar={(c) => setConsultaParaApagar(c)}
        />
      )}

      {modalAberto && (
        <Modal title={consultaEditando ? 'Editar consulta' : 'Agendar nova consulta'} onClose={fecharModal}>
          <ConsultaForm
            consulta={consultaEditando}
            pacientes={pacientes}
            profissionais={profissionais}
            onSubmit={handleSubmit}
            onCancel={fecharModal}
          />
        </Modal>
      )}

      {consultaParaApagar && (
        <Modal title="Confirmar exclusão" onClose={() => setConsultaParaApagar(null)}>
          <p>
            Tem certeza que deseja apagar a consulta de{' '}
            <strong>{consultaParaApagar.paciente_nome}</strong> em{' '}
            <strong>{consultaParaApagar.data}</strong>?
          </p>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setConsultaParaApagar(null)}>
              Cancelar
            </button>
            <button className="btn btn-primary" style={{ background: 'var(--color-danger)' }} onClick={confirmarApagar}>
              Apagar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
