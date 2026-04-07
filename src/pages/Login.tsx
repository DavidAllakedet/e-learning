// d:\PROJETS\COURS REACT\e-l\my-react-app\src\pages\Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) { alert('Connexion échouée'); }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Email" className="w-full p-3 border rounded" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="w-full p-3 border rounded" onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700">Se connecter</button>
      </form>
    </div>
  );
};
export default Login;