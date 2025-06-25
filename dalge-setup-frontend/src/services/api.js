import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Certifique-se que isso está presente
});

export default api;
