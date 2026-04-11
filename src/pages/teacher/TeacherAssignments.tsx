import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Clock, Edit, Plus } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';

type TeacherAssignmentRow = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  course: { id: string; title: string };
};

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TeacherAssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assignments/teacher')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Devoirs (Enseignant)</h1>
          <p className="text-slate-500 font-medium">Gérez les devoirs de vos cours.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/assignments/new')}>
          <Plus className="mr-2 w-4 h-4" />
          Créer un devoir
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Liste des devoirs</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${items.length} devoirs`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Devoir</THead>
                <THead>Cours</THead>
                <THead>Date limite</THead>
                <THead>Statut</THead>
                <THead className="text-right">Actions</THead>
              </TRow>
            </THeader>
            <TBody>
              {items.map(a => (
                <TRow key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="truncate max-w-72">{a.title}</span>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-64">{a.course.title}</span>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {new Date(a.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TCell>
                  <TCell>
                    <Badge variant={new Date(a.dueDate) > new Date() ? 'success' : 'warning'} className="rounded-lg">
                      {new Date(a.dueDate) > new Date() ? 'Actif' : 'Expiré'}
                    </Badge>
                  </TCell>
                  <TCell className="text-right">
                    <div className="flex justify-end">
                      <Button variant="outline" className="rounded-xl" onClick={() => navigate(`/teacher/assignments/${a.id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </TCell>
                </TRow>
              ))}
              {items.length === 0 && !loading && (
                <TRow>
                  <TCell colSpan={5} className="text-center py-10 text-slate-400">
                    Aucun devoir pour le moment
                  </TCell>
                </TRow>
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignments;
