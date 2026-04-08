import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, User, ArrowRight, School, Building2, BadgeCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';
import { ROLES, type Role } from '../constants/roles';
import { useAuth } from '../hooks/useAuth';

type RegisterDraft = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const roleRedirect = (role: Role) => {
  if (role === ROLES.TEACHER) return '/teacher/dashboard';
  if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) return '/admin/dashboard';
  return '/student/dashboard';
};

const SelectRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading } = useAuth();

  const draft = useMemo<RegisterDraft | null>(() => {
    const state = location.state as Partial<RegisterDraft> | null;
    if (!state?.email || !state?.password || !state?.firstName || !state?.lastName) return null;
    return { email: state.email, password: state.password, firstName: state.firstName, lastName: state.lastName };
  }, [location.state]);

  const [role, setRole] = useState<Role>(ROLES.STUDENT);
  const [university, setUniversity] = useState('');
  const [className, setClassName] = useState('');
  const [interests, setInterests] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');

  if (!draft) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 rounded-4xl shadow-2xl shadow-slate-200/60 border-none text-center space-y-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mx-auto">
            <BadgeCheck className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Session d'inscription expirée</h2>
            <p className="text-slate-500 font-medium mt-2">Reprenez l'inscription pour choisir votre rôle.</p>
          </div>
          <Button onClick={() => navigate('/register')} className="w-full h-14 rounded-2xl text-lg">
            Revenir à l'inscription
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      await register({
        ...draft,
        role,
        university: role === ROLES.STUDENT ? university : undefined,
        className: role === ROLES.STUDENT ? className : undefined,
        interests: role === ROLES.STUDENT ? interests : undefined,
        institution: role === ROLES.TEACHER ? institution : undefined,
        specialty: role === ROLES.TEACHER ? specialty : undefined,
        bio: role === ROLES.TEACHER ? bio : undefined,
      });
      navigate(roleRedirect(role));
    } catch {
      alert('Erreur lors de la création du compte');
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

      <Card className="max-w-2xl w-full p-8 rounded-4xl shadow-2xl shadow-slate-200/60 border-none">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Choisissez votre rôle</h2>
          <p className="text-slate-500 font-medium mt-2">Votre expérience et vos fonctionnalités dépendent de votre profil.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole(ROLES.STUDENT)}
            className={cn(
              'p-6 rounded-3xl border-2 transition-all text-left',
              role === ROLES.STUDENT ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <School className={cn('w-5 h-5', role === ROLES.STUDENT ? 'text-indigo-600' : 'text-slate-400')} />
              </div>
              <p className="font-black text-slate-900">Étudiant</p>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Accédez à vos cours, quiz, devoirs, progression et notes.</p>
          </button>

          <button
            type="button"
            onClick={() => setRole(ROLES.TEACHER)}
            className={cn(
              'p-6 rounded-3xl border-2 transition-all text-left',
              role === ROLES.TEACHER ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Building2 className={cn('w-5 h-5', role === ROLES.TEACHER ? 'text-indigo-600' : 'text-slate-400')} />
              </div>
              <p className="font-black text-slate-900">Enseignant</p>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Créez des cours, ajoutez des contenus, évaluez et suivez la classe.</p>
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {role === ROLES.STUDENT ? (
            <>
              <Input label="Université" placeholder="Ex: Université ISI" icon={<School className="w-5 h-5" />} value={university} onChange={(e) => setUniversity(e.target.value)} />
              <Input label="Classe" placeholder="Ex: L3 Informatique" icon={<User className="w-5 h-5" />} value={className} onChange={(e) => setClassName(e.target.value)} />
              <Input label="Domaine d'intérêt" placeholder="Ex: React, Node.js, DevOps" icon={<GraduationCap className="w-5 h-5" />} value={interests} onChange={(e) => setInterests(e.target.value)} />
            </>
          ) : (
            <>
              <Input label="Établissement" placeholder="Ex: ISI" icon={<Building2 className="w-5 h-5" />} value={institution} onChange={(e) => setInstitution(e.target.value)} />
              <Input label="Spécialité" placeholder="Ex: Développement Web" icon={<GraduationCap className="w-5 h-5" />} value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez votre expérience et votre approche pédagogique..."
                  className="w-full min-h-[120px] rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-10">
          <Button onClick={handleSubmit} isLoading={loading} className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-indigo-100">
            Finaliser mon compte
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SelectRole;
