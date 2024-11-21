import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Poppins', sans-serif; /* Fonte Poppins */
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #4a90e2;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
`;

const ClientList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ClientCard = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    transform: translateY(-5px);
    background-color: #f1f1f1;
  }
`;

const ClientName = styled.h4`
  font-size: 18px;
  color: #333;
  margin: 0;
`;

const ClientDetails = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DetailItem = styled.p`
  font-size: 16px;
  margin: 8px 0;
  color: #555;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  transition: opacity 0.3s;

  &.edit {
    background-color: #4a90e2;
  }

  &.delete {
    background-color: #e94e77;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const BuscarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
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
    setIsModalOpen(true);
    setFormData({ ...selectedCliente });
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleModalSave = async () => {
    try {
      await axios.put(`/clientes/${formData._id}`, formData);
      alert('Cliente editado com sucesso!');
      setClientes(clientes.map(cliente => cliente._id === formData._id ? formData : cliente));
      handleModalClose();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
      alert('Erro ao editar cliente. Tente novamente.');
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <Title>Buscar Clientes</Title>
      <SearchContainer>
        <Input
          type="text"
          value={busca}
          onChange={handleInputChange}
          placeholder="Digite o nome do cliente para buscar..."
        />
      </SearchContainer>
      <ClientList>
        {filteredClientes.map((cliente) => (
          <ClientCard key={cliente._id} onClick={() => handleClienteClick(cliente._id)}>
            <ClientName>{cliente.nome}</ClientName>
          </ClientCard>
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

      {/* Modal para Editar Cliente */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Editar Cliente"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          content: {
            padding: '20px',
            width: '500px',
            margin: 'auto',
            borderRadius: '12px',
            backgroundColor: 'white',
          },
        }}
      >
        <ModalContent>
          <h3>Editar Cliente</h3>
          <ModalInput
            type="text"
            name="nome"
            value={formData.nome || ''}
            onChange={handleModalChange}
            placeholder="Nome Completo"
          />
          <ModalInput
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleModalChange}
            placeholder="Email"
          />
          <ModalInput
            type="text"
            name="telefone"
            value={formData.telefone || ''}
            onChange={handleModalChange}
            placeholder="Telefone"
          />
          <ModalInput
            type="text"
            name="cpf"
            value={formData.cpf || ''}
            onChange={handleModalChange}
            placeholder="CPF"
          />
          <ModalInput
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento || ''}
            onChange={handleModalChange}
          />
          <ButtonContainer>
            <Button className="edit" onClick={handleModalSave}>
              Salvar
            </Button>
            <Button className="delete" onClick={handleModalClose}>
              Cancelar
            </Button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default BuscarClientes;
