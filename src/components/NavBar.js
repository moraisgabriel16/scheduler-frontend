// src/components/NavBar.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  background-color: #007bff;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;

  &:hover {
    color: #d1e7ff;
  }
`;

const NavBar = () => {
  return (
    <NavContainer>
      <h1 style={{ color: 'white', margin: 0 }}>Sistema de Agendamento</h1>
      <NavLinks>
        <StyledLink to="/">Ver Agendamentos</StyledLink>
        <StyledLink to="/novo-agendamento">Novo Agendamento</StyledLink>
        <StyledLink to="/buscar-clientes">Buscar Clientes</StyledLink>
        <StyledLink to="/cadastro-cliente">Cadastrar Cliente</StyledLink>
        <StyledLink to="/configuracoes">Configurações</StyledLink>
      </NavLinks>
    </NavContainer>
  );
};

export default NavBar;
