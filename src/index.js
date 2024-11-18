// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AgendamentoProvider } from './context/AgendamentoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AgendamentoProvider>
    <App />
  </AgendamentoProvider>
);
