import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';
import * as XLSX from 'xlsx'; // Biblioteca para exportar Excel

// Estilização dos componentes
const Container = styled.div`
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #007bff;
  font-size: 2rem;
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
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
    padding: 14px;
    background-color: #ff69b4;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
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

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const Item = styled.li`
  padding: 12px;
  background-color: #f1f1f1;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;

    &.edit {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    &.delete {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }
  }
`;

const Button = styled.button`
  padding: 14px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &.export {
    background-color: #007bff;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const ConfirmationInput = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #dc3545;
    outline: none;
  }
`;

const Configuracoes = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoColaborador, setNovoColaborador] = useState('');
  const [novoProcedimento, setNovoProcedimento] = useState('');
  const [editColaborador, setEditColaborador] = useState(null);
  const [editProcedimento, setEditProcedimento] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colaboradoresRes, procedimentosRes, agendamentosRes] = await Promise.all([
          axios.get('/colaboradores'),
          axios.get('/procedimentos'),
          axios.get('/agendamentos'),
        ]);
        setColaboradores(colaboradoresRes.data);
        setProcedimentos(procedimentosRes.data);
        setAgendamentos(agendamentosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddColaborador = async () => {
    if (!novoColaborador.trim()) return;
    try {
      const response = await axios.post('/colaboradores', { nome: novoColaborador });
      setColaboradores([...colaboradores, response.data]);
      setNovoColaborador('');
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
    }
  };

  const handleAddProcedimento = async () => {
    if (!novoProcedimento.trim()) return;
    try {
      const response = await axios.post('/procedimentos', { nome: novoProcedimento });
      setProcedimentos([...procedimentos, response.data]);
      setNovoProcedimento('');
    } catch (error) {
      console.error('Erro ao adicionar procedimento:', error);
    }
  };

  const handleExportExcel = () => {
    if (agendamentos.length === 0) {
      alert('Não há agendamentos para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(agendamentos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agendamentos');
    XLSX.writeFile(workbook, 'Agendamentos.xlsx');
  };

  const handleDeleteAllAgendamentos = async () => {
    if (deleteConfirmation !== 'CONFIRMAR') {
      alert('Por favor, digite "CONFIRMAR" para excluir todos os agendamentos.');
      return;
    }

    if (window.confirm('Tem certeza que deseja apagar todos os agendamentos? Essa ação não pode ser desfeita!')) {
      try {
        await axios.delete('/agendamentos');
        setAgendamentos([]);
        setDeleteConfirmation('');
        alert('Todos os agendamentos foram apagados com sucesso.');
      } catch (error) {
        console.error('Erro ao apagar todos os agendamentos:', error);
        alert('Ocorreu um erro ao tentar apagar os agendamentos.');
      }
    }
  };

  return (
    <Container>
      <Title>Configurações</Title>

      <Section>
        <SectionTitle>Adicionar Colaborador</SectionTitle>
        <InputContainer>
          <input
            type="text"
            value={novoColaborador}
            onChange={(e) => setNovoColaborador(e.target.value)}
            placeholder="Nome do Colaborador"
          />
          <button onClick={handleAddColaborador}>Adicionar</button>
        </InputContainer>
        <ItemList>
          {colaboradores.map((colaborador) => (
            <Item key={colaborador._id}>
              {colaborador.nome}
            </Item>
          ))}
        </ItemList>
      </Section>

      <Section>
        <SectionTitle>Adicionar Procedimento</SectionTitle>
        <InputContainer>
          <input
            type="text"
            value={novoProcedimento}
            onChange={(e) => setNovoProcedimento(e.target.value)}
            placeholder="Nome do Procedimento"
          />
          <button onClick={handleAddProcedimento}>Adicionar</button>
        </InputContainer>
        <ItemList>
          {procedimentos.map((procedimento) => (
            <Item key={procedimento._id}>
              {procedimento.nome}
            </Item>
          ))}
        </ItemList>
      </Section>

      <Section>
        <SectionTitle>Exportar e Apagar Agendamentos</SectionTitle>
        <Button className="export" onClick={handleExportExcel}>
          Exportar Agendamentos em Excel
        </Button>
        <ConfirmationInput
          type="text"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          placeholder='Digite "CONFIRMAR" para apagar todos os agendamentos'
        />
        <Button className="delete" onClick={handleDeleteAllAgendamentos}>
          Apagar Todos os Agendamentos
        </Button>
      </Section>
    </Container>
  );
};

export default Configuracoes;
