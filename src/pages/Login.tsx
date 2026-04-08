import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const roleRedirect = (role?: string) => {
    if (role === ROLES.TEACHER) return '/teacher/dashboard';
    if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) return '/admin/dashboard';
    return '/student/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
      navigate(roleRedirect(savedUser?.role));
    } catch (err) { 
      console.error(err);
      alert('Connexion échouée. Veuillez vérifier vos identifiants.'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center space-x-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-black text-slate-900 tracking-tighter">E-LEARN</span>
      </div>

      <Card className="max-w-md w-full p-8 rounded-4xl shadow-2xl shadow-slate-200/60 border-none">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Bon retour !</h2>
          <p className="text-slate-500 font-medium mt-2">Connectez-vous pour continuer votre apprentissage</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email professionnel"
            placeholder="nom@exemple.com"
            type="email" 
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Mot de passe"
            placeholder="••••••••"
            type="password" 
            icon={<Lock className="w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex items-center justify-end">
            <button 
              type="button" 
              onClick={() => alert('Fonctionnalité de réinitialisation de mot de passe à venir. Veuillez contacter un administrateur.')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-indigo-100"
            isLoading={isLoading}
          >
            Se connecter
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 font-medium">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-indigo-600 font-black hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </Card>
      
      <p className="mt-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
        &copy; 2026 E-Learn Platform
      </p>
    </div>
  );
};

export default Login;
