import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      navigate('/select-role', { state: formData });
    } catch (err) { 
      console.error(err);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="mb-8 flex items-center space-x-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-black text-slate-900 tracking-tighter">E-LEARN</span>
      </div>

      <Card className="max-w-xl w-full p-8 rounded-4xl shadow-2xl shadow-slate-200/60 border-none">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Rejoignez-nous !</h2>
          <p className="text-slate-500 font-medium mt-2">Créez votre compte et commencez à apprendre dès aujourd'hui</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input 
              label="Prénom"
              placeholder="Ex: Jean"
              icon={<User className="w-5 h-5" />}
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <Input 
              label="Nom"
              placeholder="Ex: Dupont"
              icon={<User className="w-5 h-5" />}
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Email"
            placeholder="jean.dupont@exemple.com"
            type="email" 
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />

          <Input 
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            type="password" 
            icon={<Lock className="w-5 h-5" />}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />

          <div className="bg-slate-50 p-4 rounded-2xl flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              En vous inscrivant, vous acceptez nos <span className="font-bold text-slate-700">Conditions d'Utilisation</span> et notre <span className="font-bold text-slate-700">Politique de Confidentialité</span>.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-indigo-100 mt-4"
            isLoading={isLoading}
          >
            Créer mon compte
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 font-medium">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-indigo-600 font-black hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
