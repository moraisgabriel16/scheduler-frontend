// src/context/AgendamentoContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const AgendamentoContext = createContext();

const AgendamentoProvider = ({ children }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);

  const fetchAgendamentos = useCallback(async () => {
    try {
      const response = await axios.get('/agendamentos');
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  }, []);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  return (
    <AgendamentoContext.Provider value={{ agendamentos, clientes, colaboradores, procedimentos, fetchAgendamentos }}>
      {children}
    </AgendamentoContext.Provider>
  );
};

export { AgendamentoContext, AgendamentoProvider };
