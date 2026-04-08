import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Users, Eye, Edit, Trash2, UploadCloud, Users2 } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';

type TeacherCourseRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED';
  _count?: { enrollments: number };
};

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TeacherCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/courses/teacher/my')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const togglePublish = async (course: TeacherCourseRow) => {
    setUpdatingId(course.id);
    try {
      const nextStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await api.patch(`/courses/${course.id}`, { status: nextStatus });
      setCourses(prev => prev.map(c => c.id === course.id ? res.data : c));
    } catch (error) {
      console.error(error);
      alert('Impossible de changer le statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm('Supprimer ce cours ? Cette action est irréversible.')) return;
    setUpdatingId(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (error) {
      console.error(error);
      alert('Impossible de supprimer le cours');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes cours</h1>
          <p className="text-slate-500 font-medium">Gérez uniquement les cours dont vous êtes responsable.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/courses/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Créer un cours
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Liste des cours</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${courses.length} cours`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Cours</THead>
                <THead>Étudiants</THead>
                <THead>Statut</THead>
                <THead>Prix</THead>
                <THead className="text-right">Actions</THead>
              </TRow>
            </THeader>
            <TBody>
              {courses.map(c => (
                <TRow key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate max-w-96">{c.title}</p>
                        <p className="text-xs font-medium text-slate-400 line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell>
                    <Badge variant="outline" className="rounded-lg">
                      <Users className="w-4 h-4 mr-2" />
                      {c._count?.enrollments || 0}
                    </Badge>
                  </TCell>
                  <TCell>
                    <Badge variant={c.status === 'PUBLISHED' ? 'success' : 'warning'} className="rounded-lg">
                      {c.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TCell>
                  <TCell className="font-bold text-slate-900">{c.price} €</TCell>
                  <TCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => togglePublish(c)}
                        disabled={updatingId === c.id}
                      >
                        <UploadCloud className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => navigate(`/teacher/courses/${c.id}/enrollments`)}
                      >
                        <Users2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600" onClick={() => navigate(`/courses/${c.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600" onClick={() => navigate(`/teacher/courses/${c.id}/edit`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => deleteCourse(c.id)}
                        disabled={updatingId === c.id}
                      >
                        <Trash2 className="w-4 h-4" />
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

export default TeacherCourses;
