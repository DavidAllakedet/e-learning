// d:\PROJETS\COURS REACT\e-l\my-react-app\src\services\api.ts
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 60000 // 60 second timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Sending request with token:', token.substring(0, 20) + '...');
  } else {
    console.warn('No token found in localStorage');
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