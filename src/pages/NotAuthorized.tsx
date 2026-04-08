import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-600 mb-8 shadow-xl shadow-amber-100/50">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">403</h1>
      <h2 className="text-2xl font-black text-slate-800 mb-2">Accès interdit</h2>
      <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
        Votre rôle ne vous permet pas d'accéder à cette page.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="rounded-2xl h-14 px-8 border-2 w-full sm:w-auto">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Retour
        </Button>
        <Button onClick={() => navigate('/')} className="rounded-2xl h-14 px-8 shadow-lg shadow-indigo-100 w-full sm:w-auto">
          <Home className="mr-2 w-5 h-5" />
          Accueil
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorized;

