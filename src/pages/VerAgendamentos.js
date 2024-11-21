// src/pages/VerAgendamentos.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import axios from '../api/axios';
import Modal from 'react-modal';
import { FaSave, FaTrash, FaTimes } from 'react-icons/fa';

// Configurando o localizador do calendário usando moment.js
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

// Configuração do estilo do modal
Modal.setAppElement('#root');

// Container principal
const Container = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
`;

// Título da página
const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  font-size: 2.5rem;
  font-family: 'Montserrat', sans-serif;
`;

// Cabeçalho do Modal
const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;

  h2 {
    font-size: 2rem;
    color: #333;
    font-family: 'Montserrat', sans-serif;
    margin: 0;
  }
`;

// Rodapé do Modal com botões
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    color: white;
  }

  .save {
    background-color: #28a745;

    &:hover {
      background-color: #218838;
      transform: translateY(-2px);
    }
  }

  .delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
      transform: translateY(-2px);
    }
  }

  .cancel {
    background-color: #6c757d;

    &:hover {
      background-color: #5a6268;
      transform: translateY(-2px);
    }
  }
`;

// Formulário do Modal
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    font-weight: 600;
    color: #555;
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
  }

  select,
  input {
    padding: 12px 14px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: 'Roboto', sans-serif;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
      outline: none;
    }
  }

  input[type='datetime-local'] {
    cursor: pointer;
  }
`;

// Estilização do Modal
const customModalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px',
    width: '90%',
    padding: '30px 25px',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.2)',
    border: 'none',
    zIndex: 1000,
    fontFamily: 'Roboto, sans-serif',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

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

  // Abrir modal para editar agendamento
  const handleSelectEvent = (event) => {
    const agendamento = event.resource;
    setSelectedAgendamento(agendamento);
    setFormData({
      clienteId: agendamento.clienteId?._id || '',
      colaboradorId: agendamento.colaboradorId?._id || '',
      procedimentoId: agendamento.procedimentoId?._id || '',
      dataHora: moment(agendamento.dataHora).format('YYYY-MM-DDTHH:mm'),
      duracao: agendamento.duracao || 60,
    });
    setModalIsOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAgendamento(null);
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

    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;

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
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            border: 'none',
            padding: '5px',
          },
        })}
      />

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Agendamento"
        style={customModalStyles}
      >
        <ModalHeader>
          <h2>Editar Agendamento</h2>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <div>
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={formData.dataHora}
              onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Duração (minutos)</label>
            <input
              type="number"
              value={formData.duracao}
              onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
              min="15"
              required
            />
          </div>

          <ModalFooter>
            <button type="submit" className="save">
              <FaSave /> Salvar
            </button>
            <button type="button" className="delete" onClick={handleDelete}>
              <FaTrash /> Excluir
            </button>
            <button type="button" className="cancel" onClick={closeModal}>
              <FaTimes /> Cancelar
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default VerAgendamentos;
