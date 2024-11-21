import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const Container = styled.div`
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-top: 20px; /* Ajustado o margin-top para reduzir o espaço */
  font-family: 'Poppins', sans-serif; /* Usando a fonte Poppins */
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
  font-size: 2rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px; /* Aumentando o espaço entre os campos */

  label {
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
  }

  input {
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #ff69b4; /* Cor da borda ao focar */
      outline: none;
      box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); /* Sombras ao focar */
    }

    &::placeholder {
      color: #888;
    }
  }

  button {
    padding: 16px;
    background-color: #ff69b4;  /* Cor rosa da Navbar */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.2s ease;

    &:hover {
      background-color: #e55a8f;  /* Tom de rosa mais escuro */
      transform: translateY(-2px); /* Efeito de levitação ao passar o mouse */
    }

    &:active {
      background-color: #d44c81;  /* Tom de rosa mais escuro ao pressionar */
      transform: translateY(0); /* Volta ao normal ao pressionar */
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 0;
`;

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Reset error message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nome === '' || formData.email === '' || formData.telefone === '' || formData.cpf === '' || formData.dataNascimento === '') {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      await axios.post('/clientes', formData);
      alert('Cliente cadastrado com sucesso!');
      setFormData({ nome: '', email: '', telefone: '', cpf: '', dataNascimento: '' });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente. Tente novamente.');
    }
  };

  return (
    <Container>
      <Title>Cadastro de Cliente</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label>Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite o nome completo"
            required
          />
        </InputContainer>
        <InputContainer>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite o email"
            required
          />
        </InputContainer>
        <InputContainer>
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Digite o telefone (ex: (99) 99999-9999)"
            required
          />
        </InputContainer>
        <InputContainer>
          <label>CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Digite o CPF (ex: 123.456.789-00)"
            required
          />
        </InputContainer>
        <InputContainer>
          <label>Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <button type="submit">Cadastrar Cliente</button>
      </Form>
    </Container>
  );
};

export default CadastroCliente;
