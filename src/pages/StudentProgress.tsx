
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../components/ui/Table';
import api from '../services/api';

type EnrolledCourse = {
  id: string;
  title: string;
  description: string;
  teacher: { firstName: string; lastName: string };
  progress: number;
  modules?: { id: string; contents?: unknown[] }[];
};

const StudentProgress = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/enrolled')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = useMemo(() => courses.filter(c => c.progress === 100).length, [courses]);
  const inProgressCount = useMemo(() => courses.filter(c => c.progress > 0 && c.progress < 100).length, [courses]);
  const averageProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const sum = courses.reduce((acc, c) => acc + (Number.isFinite(c.progress) ? c.progress : 0), 0);
    return Math.round(sum / courses.length);
  }, [courses]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-10 rounded-5xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 rounded-full px-4 py-1.5 font-black text-xs uppercase tracking-widest">
            Progression
          </Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Suivi de progression
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Consultez vos cours suivis et votre avancement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cours suivis</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{courses.length}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cours terminés</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{completedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">En cours</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{inProgressCount}</p>
            </div>
          </div>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-slate-100 text-slate-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avancement moyen</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{averageProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40">
        <CardHeader className="p-8 border-b border-slate-50 bg-white flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Progression par cours</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Données basées sur vos inscriptions.</CardDescription>
          </div>
          <Button variant="ghost" className="text-indigo-600 font-black" onClick={() => navigate('/student/courses')}>
            Mes cours
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <THeader className="bg-slate-50/50">
              <TRow>
                <THead className="pl-8">Cours</THead>
                <THead>Progression</THead>
                <THead className="pr-8 text-right">Action</THead>
              </TRow>
            </THeader>
            <TBody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <TRow key={i} className="animate-pulse">
                    <TCell className="pl-8 py-6"><div className="h-4 w-64 bg-slate-100 rounded" /></TCell>
                    <TCell><div className="h-4 w-40 bg-slate-100 rounded" /></TCell>
                    <TCell className="pr-8 text-right"><div className="h-8 w-24 bg-slate-100 rounded-xl ml-auto" /></TCell>
                  </TRow>
                ))
              ) : courses.length === 0 ? (
                <TRow>
                  <TCell className="pl-8 py-10 text-slate-500 font-medium" colSpan={3}>
                    Aucun cours suivi pour le moment.
                  </TCell>
                </TRow>
              ) : (
                courses.map((course) => {
                  const percent = Math.max(0, Math.min(100, Math.round(course.progress)));
                  const modulesCount = course.modules?.length ?? 0;
                  return (
                    <TRow key={course.id} className="hover:bg-slate-50/30 transition-colors">
                      <TCell className="pl-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 leading-none truncate max-w-[420px]">{course.title}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                              {course.teacher.firstName} {course.teacher.lastName} • {modulesCount} module(s)
                            </p>
                          </div>
                        </div>
                      </TCell>
                      <TCell className="w-64">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase text-indigo-600">
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </TCell>
                      <TCell className="pr-8 text-right">
                        <Button variant="outline" className="rounded-xl border-2" onClick={() => navigate(`/courses/${course.id}`)}>
                          Ouvrir
                        </Button>
                      </TCell>
                    </TRow>
                  );
                })
              )}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default StudentProgress;
