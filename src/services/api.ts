// d:\PROJETS\COURS REACT\e-l\my-react-app\src\services\api.ts
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000 // 60 second timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    }
    return Promise.reject(error);
  }
);

export default api;
