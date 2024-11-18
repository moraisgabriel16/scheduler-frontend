// src/pages/CadastroCliente.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
  }

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
    padding: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s;
    font-weight: bold;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <button type="submit">Cadastrar Cliente</button>
      </Form>
    </Container>
  );
};

export default CadastroCliente;
