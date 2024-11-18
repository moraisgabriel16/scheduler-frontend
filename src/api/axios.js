// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://scheduler-backend-five.vercel.app/api', // Atualize isso para a URL do backend
});

export default instance;
