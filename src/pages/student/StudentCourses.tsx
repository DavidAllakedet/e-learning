import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';

type EnrolledCourse = {
  id: string;
  title: string;
  description: string;
  teacher: { firstName: string; lastName: string };
  progress: number;
};

const StudentCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/courses/enrolled')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes cours</h1>
          <p className="text-slate-500 font-medium">Accédez uniquement aux formations auxquelles vous êtes inscrit.</p>
        </div>
        <Button variant="outline" className="rounded-2xl h-12 px-6 border-2" onClick={() => navigate('/catalog')}>
          Explorer le catalogue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <Card className="p-6 border-none shadow-xl shadow-slate-200/40">
        <div className="max-w-lg">
          <Input
            label="Recherche"
            placeholder="Rechercher dans mes cours..."
            icon={<Search className="w-5 h-5" />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <Card className="p-10 border-none shadow-xl shadow-slate-200/40">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-10 border-none shadow-xl shadow-slate-200/40 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Aucun cours</h3>
            <p className="text-slate-500 font-medium mt-2">Inscrivez-vous à un cours depuis le catalogue.</p>
            <Button className="mt-6 rounded-2xl h-12 px-6" onClick={() => navigate('/catalog')}>Voir le catalogue</Button>
          </Card>
        ) : (
          filtered.map(course => (
            <Card key={course.id} className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40">
              <CardHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <Badge variant={course.progress >= 100 ? 'success' : 'primary'} className={cn('rounded-lg', course.progress >= 100 ? '' : 'bg-indigo-50 text-indigo-600 border-indigo-100')}>
                    {course.progress >= 100 ? (
                      <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" />Complété</span>
                    ) : (
                      <span>{course.progress}%</span>
                    )}
                  </Badge>
                  <Badge variant="outline" className="rounded-lg">
                    {course.teacher.firstName} {course.teacher.lastName}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${Math.min(course.progress, 100)}%` }} />
                </div>
                <Button className="w-full rounded-2xl h-12" onClick={() => navigate(`/student/courses/${course.id}`)}>
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentCourses;

