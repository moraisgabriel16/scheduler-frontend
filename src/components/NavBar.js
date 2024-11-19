// src/components/NavBar.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  background-color: #ff69b4; /* Alterado para rosa */
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    background-color: #ff69b4; /* Alterado para rosa */
    position: absolute;
    top: 60px;
    right: 15px;
    padding: 15px;
    border-radius: 8px;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    z-index: 100;
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;

  &:hover {
    color: #ffe4e1; /* Alterado para um tom mais claro de rosa */
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <NavContainer ref={navRef}>
      <h1 style={{ color: 'white', margin: 0 }}>Sistema de Agendamento</h1>
      <HamburgerButton onClick={toggleMenu}>☰</HamburgerButton>
      <NavLinks isOpen={isOpen}>
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
