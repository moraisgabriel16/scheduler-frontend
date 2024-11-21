import React, { useState, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { AgendamentoContext } from '../context/AgendamentoContext';
import axios from '../api/axios';
import debounce from 'lodash.debounce';

const Container = styled.div`
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif; /* Usando a fonte Poppins */
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #007bff;
  font-size: 2rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
  }

  select,
  input {
    padding: 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }

  button {
    padding: 16px;
    background-color: #ff69b4;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e55a8f;
    }

    &:active {
      background-color: #d44c81;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClienteInfo = styled.div`
  background-color: #f8f9fa;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Message = styled.div`
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -15px;
`;

const NovoAgendamento = () => {
  const { fetchAgendamentos } = useContext(AgendamentoContext);
  const [colaboradores, setColaboradores] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    colaboradorId: '',
    procedimentoId: '',
    dataHora: '',
    duracao: 60,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [noClientesMessage, setNoClientesMessage] = useState('');

  useEffect(() => {
    fetchColaboradores();
    fetchProcedimentos();
  }, []);

  const fetchColaboradores = useCallback(async () => {
    try {
      const response = await axios.get('/colaboradores');
      setColaboradores(response.data);
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
    }
  }, []);

  const fetchProcedimentos = useCallback(async () => {
    try {
      const response = await axios.get('/procedimentos');
      setProcedimentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
    }
  }, []);

  const fetchClientes = useCallback(
    debounce(async (term) => {
      try {
        const response = await axios.get(`/clientes?search=${term}`);
        setClientes(response.data);
        setNoClientesMessage(response.data.length === 0 ? 'Nenhum cliente encontrado.' : '');
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setNoClientesMessage('Erro ao buscar clientes.');
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      fetchClientes(searchTerm);
    } else {
      setClientes([]);
      setNoClientesMessage('');
    }
  }, [searchTerm, fetchClientes]);

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({ ...formData, clienteId: cliente._id });
    setClientes([]);
    setSearchTerm('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      dataHora: new Date(formData.dataHora).toISOString(),
    };

    console.log('Dados enviados:', formDataToSend);

    try {
      await axios.post('/agendamentos', formDataToSend);
      alert('Agendamento criado com sucesso!');
      fetchAgendamentos();
      setFormData({
        clienteId: '',
        colaboradorId: '',
        procedimentoId: '',
        dataHora: '',
        duracao: 60,
      });
      setSelectedCliente(null);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error.response || error.message);
      alert(`Erro ao criar agendamento: ${error.response?.data?.message || 'Erro desconhecido.'}`);
    }
  };

  return (
    <Container>
      <Title>Novo Agendamento</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label>Cliente (Nome ou CPF)</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou CPF do cliente..."
          />
          {clientes.length > 0 && (
            <ul>
              {clientes.map((cliente) => (
                <li
                  key={cliente._id}
                  onClick={() => handleClienteSelect(cliente)}
                  style={{ cursor: 'pointer', padding: '5px 0' }}
                >
                  {cliente.nome} - CPF: {cliente.cpf}
                </li>
              ))}
            </ul>
          )}
          {noClientesMessage && <Message>{noClientesMessage}</Message>}
          {selectedCliente && (
            <ClienteInfo>
              <strong>Cliente Selecionado:</strong>
              <p>Nome: {selectedCliente.nome}</p>
              <p>CPF: {selectedCliente.cpf}</p>
              <p>Email: {selectedCliente.email}</p>
              <p>Telefone: {selectedCliente.telefone}</p>
            </ClienteInfo>
          )}
        </InputContainer>
        <InputContainer>
          <label>Colaborador</label>
          <select name="colaboradorId" value={formData.colaboradorId} onChange={handleChange} required>
            <option value="">Selecione o colaborador</option>
            {colaboradores.map((colaborador) => (
              <option key={colaborador._id} value={colaborador._id}>
                {colaborador.nome}
              </option>
            ))}
          </select>
        </InputContainer>
        <InputContainer>
          <label>Procedimento</label>
          <select name="procedimentoId" value={formData.procedimentoId} onChange={handleChange} required>
            <option value="">Selecione o procedimento</option>
            {procedimentos.map((procedimento) => (
              <option key={procedimento._id} value={procedimento._id}>
                {procedimento.nome}
              </option>
            ))}
          </select>
        </InputContainer>
        <InputContainer>
          <label>Data e Hora</label>
          <input
            type="datetime-local"
            name="dataHora"
            value={formData.dataHora}
            onChange={handleChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <label>Duração (minutos)</label>
          <input
            type="number"
            name="duracao"
            value={formData.duracao}
            onChange={handleChange}
            min="15"
            required
          />
        </InputContainer>
        <button type="submit">Criar Agendamento</button>
      </Form>
    </Container>
  );
};

export default NovoAgendamento;
