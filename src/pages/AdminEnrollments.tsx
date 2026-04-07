import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../components/ui/Table';
import { 
  Users, 
  Trash2, 
  UserPlus, 
  Search,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Input } from '../components/ui/Input';

interface Enrollment {
  id: string;
  user: { firstName: string; lastName: string; email: string };
  course: { title: string };
  enrolledAt: string;
}

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/courses/enrollments');
      setEnrollments(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      try {
        await api.delete(`/courses/enrollments/${id}`);
        setEnrollments(enrollments.filter(e => e.id !== id));
      } catch {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredEnrollments = enrollments.filter(e => 
    e.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Inscriptions</h1>
          <p className="text-slate-500 font-medium mt-1">Interface d'administration pour gérer les accès aux cours.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100">
          <UserPlus className="mr-2 w-5 h-5" />
          Inscrire manuellement
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inscriptions Totales</p>
              <p className="text-2xl font-black text-slate-900">{enrollments.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actives</p>
              <p className="text-2xl font-black text-slate-900">{enrollments.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">En attente</p>
              <p className="text-2xl font-black text-slate-900">0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Rechercher un étudiant ou un cours..." 
              className="pl-11 h-12 bg-slate-50 border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-xl">
            <Filter className="mr-2 w-4 h-4" />
            Filtrer
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <THeader className="bg-slate-50/50">
              <TRow>
                <THead className="pl-8">Étudiant</THead>
                <THead>Cours</THead>
                <THead>Date d'inscription</THead>
                <THead>Statut</THead>
                <THead className="text-right pr-8">Actions</THead>
              </TRow>
            </THeader>
            <TBody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <TRow key={i} className="animate-pulse">
                    <TCell className="pl-8"><div className="h-4 w-32 bg-slate-100 rounded" /></TCell>
                    <TCell><div className="h-4 w-40 bg-slate-100 rounded" /></TCell>
                    <TCell><div className="h-4 w-24 bg-slate-100 rounded" /></TCell>
                    <TCell><div className="h-6 w-16 bg-slate-100 rounded-full" /></TCell>
                    <TCell className="text-right pr-8"><div className="h-8 w-8 bg-slate-100 rounded ml-auto" /></TCell>
                  </TRow>
                ))
              ) : filteredEnrollments.length === 0 ? (
                <TRow>
                  <TCell colSpan={5} className="py-20 text-center">
                    <p className="text-slate-400 font-bold">Aucune inscription trouvée.</p>
                  </TCell>
                </TRow>
              ) : (
                filteredEnrollments.map((e) => (
                  <TRow key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TCell className="pl-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600 text-xs">
                          {e.user.firstName[0]}{e.user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{e.user.firstName} {e.user.lastName}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{e.user.email}</p>
                        </div>
                      </div>
                    </TCell>
                    <TCell className="font-bold text-slate-700">{e.course.title}</TCell>
                    <TCell className="text-slate-500 font-medium">
                      {new Date(e.enrolledAt || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </TCell>
                    <TCell>
                      <Badge variant="success" className="rounded-lg">Actif</Badge>
                    </TCell>
                    <TCell className="text-right pr-8">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        onClick={() => handleDelete(e.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TCell>
                  </TRow>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminEnrollments;
