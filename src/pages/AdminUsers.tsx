import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Table, THeader, TBody, TRow, THead, TCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, ShieldCheck, Trash2, Save } from 'lucide-react';
import { cn } from '../utils/cn';
import { ROLES } from '../constants/roles';

type UserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const updateRole = async (id: string, role: string) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/users/${id}`, { role });
      setUsers(prev => prev.map(u => (u.id === id ? res.data : u)));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    setUpdatingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-500 font-medium">Créez, modifiez et sécurisez la plateforme.</p>
        </div>
        <Badge variant="primary" className="rounded-lg bg-indigo-50 text-indigo-600 border-indigo-100 w-fit">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Admin
        </Badge>
      </div>

      <Card className="p-6 border-none shadow-xl shadow-slate-200/40">
        <div className="max-w-lg">
          <Input
            label="Rechercher"
            placeholder="Email, nom, rôle..."
            icon={<Search className="w-5 h-5" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>{filtered.length} résultat(s)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Nom</THead>
                <THead>Email</THead>
                <THead>Rôle</THead>
                <THead>Date</THead>
                <THead className="text-right">Actions</THead>
              </TRow>
            </THeader>
            <TBody>
              {filtered.map(u => (
                <TRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">{u.firstName} {u.lastName}</TCell>
                  <TCell className="text-slate-600 font-medium">{u.email}</TCell>
                  <TCell>
                    <div className="flex items-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                        className="h-10 rounded-xl border border-slate-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        <option value={ROLES.STUDENT}>STUDENT</option>
                        <option value={ROLES.TEACHER}>TEACHER</option>
                        <option value={ROLES.ADMIN}>ADMIN</option>
                        <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN</option>
                      </select>
                      {updatingId === u.id && (
                        <Badge variant="outline" className="rounded-lg">...</Badge>
                      )}
                    </div>
                  </TCell>
                  <TCell className="text-slate-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TCell>
                  <TCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn('h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600', updatingId === u.id && 'opacity-50 pointer-events-none')}
                        onClick={() => deleteUser(u.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => updateRole(u.id, u.role)}
                        disabled={updatingId === u.id}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
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

export default AdminUsers;

