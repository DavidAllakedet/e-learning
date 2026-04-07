// d:\PROJETS\COURS REACT\e-l\my-react-app\src\pages\Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'STUDENT' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) { 
      console.error(err);
      alert('Erreur lors de l\'inscription'); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Prénom" className="p-3 border rounded" onChange={e => setFormData({...formData, firstName: e.target.value})} required />
          <input placeholder="Nom" className="p-3 border rounded" onChange={e => setFormData({...formData, lastName: e.target.value})} required />
        </div>
        <input type="email" placeholder="Email" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Mot de passe" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <select className="w-full p-3 border rounded bg-white" onChange={e => setFormData({...formData, role: e.target.value})}>
          <option value="STUDENT">Étudiant</option>
          <option value="TEACHER">Enseignant</option>
        </select>
        <button className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition shadow-md">S'inscrire</button>
      </form>
      <p className="mt-4 text-center text-slate-600 text-sm">Déjà un compte ? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</Link></p>
    </div>
  );
};
export default Register;