import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Eye } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';

type CourseRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  teacher: { firstName: string; lastName: string };
  _count?: { enrollments: number };
};

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseRow[]>([]);

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cours (Admin)</h1>
        <p className="text-slate-500 font-medium">Surveillez et auditez tous les cours de la plateforme.</p>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Tous les cours</CardTitle>
          <CardDescription>{courses.length} cours</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Cours</THead>
                <THead>Enseignant</THead>
                <THead>Étudiants</THead>
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
                        <p className="truncate max-w-80">{c.title}</p>
                        <p className="text-xs text-slate-400 font-medium line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-medium">{c.teacher.firstName} {c.teacher.lastName}</TCell>
                  <TCell>
                    <Badge variant="outline" className="rounded-lg">
                      <Users className="w-4 h-4 mr-2" />
                      {c._count?.enrollments || 0}
                    </Badge>
                  </TCell>
                  <TCell className="font-bold text-slate-900">{c.price.toLocaleString('fr-FR')}FCFA</TCell>
                  <TCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600" onClick={() => navigate(`/courses/${c.id}`)}>
                      <Eye className="w-4 h-4" />
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

export default AdminCourses;

