import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Verifica se o usuário já está logado ao carregar o componente
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      // Redireciona para a página inicial, mas verifica para evitar loops
      navigate('/ver-agendamentos', { replace: true });
    }
  }, [navigate]); // Adicionamos apenas o navigate como dependência para evitar loops

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulação de autenticação
    if (email === 'aline@adm.com' && password === 'aline1234') {
      localStorage.setItem('isLoggedIn', 'true'); // Define o estado de login no localStorage
      navigate('/ver-agendamentos'); // Redireciona para a página principal
    } else {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          width: '300px',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
