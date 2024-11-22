import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Importação de fontes
import '@fontsource/poppins';

const NavContainer = styled.nav`
  background: linear-gradient(90deg, #ff69b4, #ff1493);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 100;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    background: linear-gradient(90deg, #ff69b4, #ff1493);
    position: absolute;
    top: 70px;
    right: 15px;
    padding: 20px;
    border-radius: 12px;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 100;
  }
`;

const StyledButton = styled(Link)`
  background-color: white;
  color: #ff1493;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  text-align: center;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff1493;
    color: white;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const LogoutButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff3333;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  letter-spacing: 1px;
`;

const NavBar = ({ handleLogout }) => {
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
      <Logo>Sistema de Agendamento</Logo>
      <HamburgerButton onClick={toggleMenu}>☰</HamburgerButton>
      <NavLinks isOpen={isOpen}>
        <StyledButton to="/ver-agendamentos">Ver Agendamentos</StyledButton>
        <StyledButton to="/novo-agendamento">Novo Agendamento</StyledButton>
        <StyledButton to="/buscar-clientes">Buscar Clientes</StyledButton>
        <StyledButton to="/cadastro-cliente">Cadastrar Cliente</StyledButton>
        <StyledButton to="/configuracoes">Configurações</StyledButton>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </NavLinks>
    </NavContainer>
  );
};

export default NavBar;
