import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, Users, FileText, Trophy } from 'lucide-react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

type CourseRow = {
  id: string;
  title: string;
  price: number;
  _count?: { enrollments: number };
};

type SubmissionRow = {
  id: string;
  grade: { value: number } | null;
};

const TeacherStats = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/courses/teacher/my'),
      api.get('/assignments/teacher/submissions'),
    ])
      .then(([c, s]) => {
        setCourses(c.data);
        setSubmissions(s.data);
      })
      .catch(err => console.error(err));
  }, []);

  const totalStudents = useMemo(() => courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0), [courses]);
  const pending = useMemo(() => submissions.filter(s => !s.grade).length, [submissions]);
  const graded = useMemo(() => submissions.filter(s => !!s.grade).length, [submissions]);

  const statCards = [
    { label: 'Cours actifs', value: courses.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Étudiants inscrits', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Soumissions à corriger', value: pending, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Soumissions notées', value: graded, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Statistiques</h1>
          <p className="text-slate-500 font-medium">Synthèse de vos cours et évaluations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-2xl', stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherStats;

