import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 16px;
  margin-bottom: 20px;
`;

const ClientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ClientItem = styled.li`
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const ClientDetails = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const DetailItem = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;

  &.edit {
    background-color: #007bff;
    color: white;
  }

  &.delete {
    background-color: #dc3545;
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const BuscarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleInputChange = (e) => {
    setBusca(e.target.value);
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleClienteClick = async (id) => {
    try {
      const response = await axios.get(`/clientes/${id}`);
      setSelectedCliente(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/clientes/${selectedCliente._id}/editar`);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o cliente "${selectedCliente.nome}"?`
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/clientes/${selectedCliente._id}`);
        alert('Cliente excluído com sucesso!');
        setClientes(clientes.filter((cliente) => cliente._id !== selectedCliente._id));
        setSelectedCliente(null);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente. Tente novamente.');
      }
    }
  };

  return (
    <Container>
      <Title>Buscar Clientes</Title>
      <Input
        type="text"
        value={busca}
        onChange={handleInputChange}
        placeholder="Digite o nome do cliente para buscar..."
      />
      <ClientList>
        {filteredClientes.map((cliente) => (
          <ClientItem key={cliente._id} onClick={() => handleClienteClick(cliente._id)}>
            {cliente.nome}
          </ClientItem>
        ))}
      </ClientList>

      {selectedCliente && (
        <ClientDetails>
          <Title>Detalhes do Cliente</Title>
          <DetailItem>
            <strong>Nome:</strong> {selectedCliente.nome}
          </DetailItem>
          <DetailItem>
            <strong>Email:</strong> {selectedCliente.email}
          </DetailItem>
          <DetailItem>
            <strong>Telefone:</strong> {selectedCliente.telefone}
          </DetailItem>
          <DetailItem>
            <strong>CPF:</strong> {selectedCliente.cpf}
          </DetailItem>
          <ButtonContainer>
            <Button className="edit" onClick={handleEditClick}>
              Editar
            </Button>
            <Button className="delete" onClick={handleDeleteClick}>
              Excluir
            </Button>
          </ButtonContainer>
        </ClientDetails>
      )}
    </Container>
  );
};

export default BuscarClientes;
