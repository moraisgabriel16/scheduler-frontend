// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VerAgendamentos from './pages/VerAgendamentos';
import NovoAgendamento from './pages/NovoAgendamento';
import BuscarClientes from './pages/BuscarClientes';
import CadastroCliente from './pages/CadastroCliente';
import ClienteDetails from './pages/ClienteDetails';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login'; // Página de Login
import NavBar from './components/NavBar'; // Componente da barra de navegação
import GlobalStyle from './styles/GlobalStyles'; // Estilos globais

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Verifica autenticação do usuário

  // Função de logout para remover o estado de login
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Remove o estado de login
    window.location.href = '/'; // Redireciona para a página de login
  };

  return (
    <Router>
      <GlobalStyle /> {/* Aplicação de estilos globais */}
      {/* Renderiza a NavBar apenas se o usuário estiver logado */}
      {isLoggedIn && <NavBar handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/ver-agendamentos" /> : <Login />} /> {/* Redireciona para login ou página inicial */}
        <Route
          path="/ver-agendamentos"
          element={isLoggedIn ? <VerAgendamentos /> : <Navigate to="/" />}
        />
        <Route
          path="/novo-agendamento"
          element={isLoggedIn ? <NovoAgendamento /> : <Navigate to="/" />}
        />
        <Route
          path="/buscar-clientes"
          element={isLoggedIn ? <BuscarClientes /> : <Navigate to="/" />}
        />
        <Route
          path="/cadastro-cliente"
          element={isLoggedIn ? <CadastroCliente /> : <Navigate to="/" />}
        />
        <Route
          path="/clientes/:id"
          element={isLoggedIn ? <ClienteDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/configuracoes"
          element={isLoggedIn ? <Configuracoes /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
