// src/pages/ClienteDetails.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

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

const DetailItem = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const ClienteDetails = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!cliente) {
    return <p>Cliente não encontrado.</p>;
  }

  return (
    <Container>
      <Title>Detalhes do Cliente</Title>
      <DetailItem>
        <strong>Nome:</strong> {cliente.nome}
      </DetailItem>
      <DetailItem>
        <strong>Email:</strong> {cliente.email}
      </DetailItem>
      <DetailItem>
        <strong>Telefone:</strong> {cliente.telefone}
      </DetailItem>
      {cliente.historico && cliente.historico.length > 0 && (
        <DetailItem>
          <strong>Histórico de Agendamentos:</strong>
          <ul>
            {cliente.historico.map((agendamento) => (
              <li key={agendamento._id}>{`${agendamento.data} - ${agendamento.procedimento}`}</li>
            ))}
          </ul>
        </DetailItem>
      )}
    </Container>
  );
};

export default ClienteDetails;
