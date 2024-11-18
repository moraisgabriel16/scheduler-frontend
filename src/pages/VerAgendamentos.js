import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import axios from '../api/axios';
import Modal from 'react-modal';

// Configurando o localizador do calendário usando moment.js
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

// Configuração do estilo do modal
Modal.setAppElement('#root');

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
    margin: 0;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .save {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }

  .cancel {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #a71d2a;
    }
  }

  .delete {
    background-color: #ff0000;
    color: white;

    &:hover {
      background-color: #cc0000;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    font-weight: bold;
    color: #333;
    font-size: 0.9rem;
  }

  select,
  input {
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }

  input[type='datetime-local'] {
    cursor: pointer;
  }
`;

const VerAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    colaboradorId: '',
    procedimentoId: '',
    dataHora: '',
    duracao: 60,
  });

  // Formatar agendamentos para o calendário
  const formatarAgendamentos = (dados) => {
    return dados.map((agendamento) => ({
      title: `${agendamento.clienteId?.nome || 'Cliente'} - ${agendamento.procedimentoId?.nome || 'Procedimento'}`,
      start: new Date(agendamento.dataHora),
      end: new Date(new Date(agendamento.dataHora).getTime() + (agendamento.duracao || 60) * 60000),
      resource: agendamento,
    }));
  };

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendamentosResponse, clientesResponse, colaboradoresResponse, procedimentosResponse] = await Promise.all([
          axios.get('/agendamentos'),
          axios.get('/clientes'),
          axios.get('/colaboradores'),
          axios.get('/procedimentos'),
        ]);

        setAgendamentos(formatarAgendamentos(agendamentosResponse.data));
        setClientes(clientesResponse.data);
        setColaboradores(colaboradoresResponse.data);
        setProcedimentos(procedimentosResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Abrir modal para editar ou criar novo agendamento
  const handleSelectEvent = (event) => {
    setSelectedAgendamento(event.resource);
    setFormData({
      clienteId: event.resource.clienteId?._id || '',
      colaboradorId: event.resource.colaboradorId?._id || '',
      procedimentoId: event.resource.procedimentoId?._id || '',
      dataHora: moment(event.resource.dataHora).format('YYYY-MM-DDTHH:mm'),
      duracao: event.resource.duracao || 60,
    });
    setModalIsOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedAgendamento(null);
    setFormData({
      clienteId: '',
      colaboradorId: '',
      procedimentoId: '',
      dataHora: moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'),
      duracao: 60,
    });
    setModalIsOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Salvar alterações no agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedAgendamento) {
        // Atualizar agendamento existente
        await axios.put(`/agendamentos/${selectedAgendamento._id}`, {
          ...formData,
          dataHora: new Date(formData.dataHora).toISOString(),
        });
        alert('Agendamento atualizado com sucesso!');
      } else {
        // Criar novo agendamento
        await axios.post('/agendamentos', {
          ...formData,
          dataHora: new Date(formData.dataHora).toISOString(),
        });
        alert('Novo agendamento criado com sucesso!');
      }

      closeModal();
      atualizarAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento. Tente novamente.');
    }
  };

  // Excluir agendamento
  const handleDelete = async () => {
    if (!selectedAgendamento) return;

    try {
      await axios.delete(`/agendamentos/${selectedAgendamento._id}`);
      alert('Agendamento excluído com sucesso!');
      closeModal();
      atualizarAgendamentos();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert('Erro ao excluir agendamento. Tente novamente.');
    }
  };

  // Atualizar agendamentos após alterações
  const atualizarAgendamentos = async () => {
    try {
      const response = await axios.get('/agendamentos');
      setAgendamentos(formatarAgendamentos(response.data));
    } catch (error) {
      console.error('Erro ao atualizar agendamentos:', error);
    }
  };

  return (
    <Container>
      <Title>Ver Agendamentos</Title>
      <Calendar
        localizer={localizer}
        events={agendamentos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        defaultView="month"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Editar ou Novo Agendamento"
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '600px',
            width: '90%',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
            border: 'none',
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999,
          },
        }}
      >
        <ModalHeader>
          <h2>{selectedAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <label>Cliente</label>
          <select
            value={formData.clienteId}
            onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          <label>Colaborador</label>
          <select
            value={formData.colaboradorId}
            onChange={(e) => setFormData({ ...formData, colaboradorId: e.target.value })}
            required
          >
            <option value="">Selecione o colaborador</option>
            {colaboradores.map((colaborador) => (
              <option key={colaborador._id} value={colaborador._id}>
                {colaborador.nome}
              </option>
            ))}
          </select>
          <label>Procedimento</label>
          <select
            value={formData.procedimentoId}
            onChange={(e) => setFormData({ ...formData, procedimentoId: e.target.value })}
            required
          >
            <option value="">Selecione o procedimento</option>
            {procedimentos.map((procedimento) => (
              <option key={procedimento._id} value={procedimento._id}>
                {procedimento.nome}
              </option>
            ))}
          </select>
          <label>Data e Hora</label>
          <input
            type="datetime-local"
            value={formData.dataHora}
            onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
            required
          />
          <label>Duração (minutos)</label>
          <input
            type="number"
            value={formData.duracao}
            onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
            min="15"
            required
          />
          <ModalFooter>
            <button type="submit" className="save">Salvar</button>
            {selectedAgendamento && (
              <button type="button" className="delete" onClick={handleDelete}>
                Excluir
              </button>
            )}
            <button type="button" className="cancel" onClick={closeModal}>
              Cancelar
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default VerAgendamentos;
