import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Trash2, Mail, Search, UserPlus } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';

type EnrollmentRow = {
  id: string;
  user: { id: string; email: string; firstName: string; lastName: string; role: string };
};

type UserSearchRow = { id: string; email: string; firstName: string; lastName: string; role: string };

const TeacherCourseEnrollments = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<UserSearchRow[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/courses/${id}/enrollments`)
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const remove = async (enrollmentId: string) => {
    if (!window.confirm('Retirer cet étudiant du cours ?')) return;
    setRemovingId(enrollmentId);
    try {
      await api.delete(`/courses/${id}/enrollments/${enrollmentId}`);
      setItems(prev => prev.filter(e => e.id !== enrollmentId));
    } catch (error) {
      console.error(error);
      alert('Impossible de retirer cet étudiant');
    } finally {
      setRemovingId(null);
    }
  };

  const search = async () => {
    const query = q.trim();
    if (!query) return;
    setSearching(true);
    try {
      const res = await api.get('/users/search', { params: { q: query, role: 'STUDENT' } });
      setResults(res.data);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  };

  const add = async (userId: string) => {
    setAddingId(userId);
    try {
      const res = await api.post(`/courses/${id}/enrollments`, { userId });
      setItems(prev => [res.data, ...prev]);
      setResults(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error(error);
      alert('Impossible d’inscrire cet étudiant (déjà inscrit ?)');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-xl bg-white shadow-sm border border-slate-100" onClick={() => navigate('/teacher/courses')}>
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inscriptions</h1>
            <p className="text-slate-500 font-medium">Liste des étudiants inscrits à ce cours.</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-lg">
          <Users className="w-4 h-4 mr-2" />
          {items.length}
        </Badge>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle>Inscrire un étudiant</CardTitle>
          <CardDescription>Recherche par email / prénom / nom. Ajout autorisé uniquement pour vos cours.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                label="Recherche étudiant"
                placeholder="Ex: jean@isi.edu ou Jean"
                icon={<Search className="w-5 h-5" />}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="rounded-2xl h-12 px-8" onClick={search} isLoading={searching}>
                Rechercher
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="divide-y divide-slate-50 rounded-3xl border border-slate-100 overflow-hidden bg-white">
              {results
                .filter(u => !items.some(e => e.user.id === u.id))
                .map(u => (
                  <div key={u.id} className="p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-sm text-slate-500 font-medium truncate">{u.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl border-2"
                      onClick={() => add(u.id)}
                      disabled={addingId === u.id}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Inscrire
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Étudiants</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${items.length} inscription(s)`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Nom</THead>
                <THead>Email</THead>
                <THead className="text-right">Action</THead>
              </TRow>
            </THeader>
            <TBody>
              {items.map(e => (
                <TRow key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">{e.user.firstName} {e.user.lastName}</TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-300" />
                      <span>{e.user.email}</span>
                    </div>
                  </TCell>
                  <TCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => remove(e.id)}
                      disabled={removingId === e.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherCourseEnrollments;
