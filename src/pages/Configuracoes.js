// src/pages/Configuracoes.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
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
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  input {
    flex: 1;
    padding: 12px;
    border-radius: 6px;
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
    padding: 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;

    &:hover {
      background-color: #218838;
    }
  }
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const Item = styled.li`
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
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

const Configuracoes = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [novoColaborador, setNovoColaborador] = useState('');
  const [novoProcedimento, setNovoProcedimento] = useState('');
  const [editColaborador, setEditColaborador] = useState(null);
  const [editProcedimento, setEditProcedimento] = useState(null);

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const [colaboradoresRes, procedimentosRes] = await Promise.all([
          axios.get('/colaboradores'),
          axios.get('/procedimentos'),
        ]);
        setColaboradores(colaboradoresRes.data);
        setProcedimentos(procedimentosRes.data);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    fetchConfiguracoes();
  }, []);

  const handleAddColaborador = async () => {
    if (!novoColaborador.trim()) return;
    try {
      if (editColaborador) {
        const response = await axios.put(`/colaboradores/${editColaborador._id}`, { nome: novoColaborador });
        setColaboradores(colaboradores.map((col) => (col._id === editColaborador._id ? response.data : col)));
        setEditColaborador(null);
      } else {
        const response = await axios.post('/colaboradores', { nome: novoColaborador });
        setColaboradores([...colaboradores, response.data]);
      }
      setNovoColaborador('');
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
    }
  };

  const handleAddProcedimento = async () => {
    if (!novoProcedimento.trim()) return;
    try {
      if (editProcedimento) {
        const response = await axios.put(`/procedimentos/${editProcedimento._id}`, { nome: novoProcedimento });
        setProcedimentos(procedimentos.map((proc) => (proc._id === editProcedimento._id ? response.data : proc)));
        setEditProcedimento(null);
      } else {
        const response = await axios.post('/procedimentos', { nome: novoProcedimento });
        setProcedimentos([...procedimentos, response.data]);
      }
      setNovoProcedimento('');
    } catch (error) {
      console.error('Erro ao adicionar procedimento:', error);
    }
  };

  const handleEditColaborador = (colaborador) => {
    setEditColaborador(colaborador);
    setNovoColaborador(colaborador.nome);
  };

  const handleDeleteColaborador = async (id) => {
    try {
      await axios.delete(`/colaboradores/${id}`);
      setColaboradores(colaboradores.filter((col) => col._id !== id));
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
    }
  };

  const handleEditProcedimento = (procedimento) => {
    setEditProcedimento(procedimento);
    setNovoProcedimento(procedimento.nome);
  };

  const handleDeleteProcedimento = async (id) => {
    try {
      await axios.delete(`/procedimentos/${id}`);
      setProcedimentos(procedimentos.filter((proc) => proc._id !== id));
    } catch (error) {
      console.error('Erro ao excluir procedimento:', error);
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
          <button onClick={handleAddColaborador}>{editColaborador ? 'Editar' : 'Adicionar'}</button>
        </InputContainer>
        <ItemList>
          {colaboradores.map((colaborador) => (
            <Item key={colaborador._id}>
              {colaborador.nome}
              <ButtonGroup>
                <button className="edit" onClick={() => handleEditColaborador(colaborador)}>Editar</button>
                <button className="delete" onClick={() => handleDeleteColaborador(colaborador._id)}>Excluir</button>
              </ButtonGroup>
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
          <button onClick={handleAddProcedimento}>{editProcedimento ? 'Editar' : 'Adicionar'}</button>
        </InputContainer>
        <ItemList>
          {procedimentos.map((procedimento) => (
            <Item key={procedimento._id}>
              {procedimento.nome}
              <ButtonGroup>
                <button className="edit" onClick={() => handleEditProcedimento(procedimento)}>Editar</button>
                <button className="delete" onClick={() => handleDeleteProcedimento(procedimento._id)}>Excluir</button>
              </ButtonGroup>
            </Item>
          ))}
        </ItemList>
      </Section>
    </Container>
  );
};

export default Configuracoes;
