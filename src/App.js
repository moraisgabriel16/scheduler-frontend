// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerAgendamentos from './pages/VerAgendamentos';
import NovoAgendamento from './pages/NovoAgendamento';
import BuscarClientes from './pages/BuscarClientes';
import CadastroCliente from './pages/CadastroCliente';
import ClienteDetails from './pages/ClienteDetails';
import Configuracoes from './pages/Configuracoes';
import NavBar from './components/NavBar';
import GlobalStyle from './styles/GlobalStyles'; // Importação dos estilos globais

function App() {
  return (
    <Router>
      <GlobalStyle /> {/* Aplicação dos estilos globais */}
      <NavBar />
      <Routes>
        <Route path="/" element={<VerAgendamentos />} />
        <Route path="/novo-agendamento" element={<NovoAgendamento />} />
        <Route path="/buscar-clientes" element={<BuscarClientes />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/clientes/:id" element={<ClienteDetails />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;
