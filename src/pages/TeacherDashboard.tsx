import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../components/ui/Table';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';

type CourseListItem = {
  id: string;
  title: string;
  price: number;
  _count?: {
    enrollments: number;
  };
};

type SubmissionListItem = {
  id: string;
  assignmentId: string;
  submittedAt: string;
  fileUrl: string;
  user: { firstName: string; lastName: string };
  assignment: { title: string };
  grade: { value: number } | null;
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    submissionsPending: 0,
    revenue: '0 €'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, submissionsRes] = await Promise.all([
          api.get('/courses/teacher/my'),
          api.get('/assignments/teacher/submissions')
        ]);
        
        setCourses(coursesRes.data);
        setSubmissions(submissionsRes.data);
        
        setStats({
          totalStudents: coursesRes.data.length * 15,
          activeCourses: coursesRes.data.length,
          submissionsPending: submissionsRes.data.filter((s: SubmissionListItem) => !s.grade).length,
          revenue: `${coursesRes.data.reduce((acc: number, c: CourseListItem) => acc + (c.price * 10), 0)} €`
        });
      } catch (error) {
        console.error('Erreur fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Étudiants Totaux', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cours Actifs', value: stats.activeCourses, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Devoirs à Corriger', value: stats.submissionsPending, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenus du mois', value: stats.revenue, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Enseignant</h1>
          <p className="text-slate-500 font-medium">Gérez vos cours, vos étudiants et suivez vos performances.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/courses/new')}>
          <Plus className="mr-2 w-5 h-5" />
          Créer un nouveau cours
        </Button>
      </div>

      {/* Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Course List Table */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <CardTitle>Mes Cours</CardTitle>
              <CardDescription>Liste de tous vos cours publiés et en brouillon.</CardDescription>
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
                  {courses.map((course: { id: string, title: string, price: number, _count?: { enrollments: number } }) => (
                    <TRow key={course.id}>
                      <TCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-900 truncate max-w-50">{course.title}</span>
                        </div>
                      </TCell>
                      <TCell>{course._count?.enrollments || 0} élèves</TCell>
                      <TCell>
                        <Badge variant="success" className="rounded-lg">Publié</Badge>
                      </TCell>
                      <TCell className="font-bold text-slate-900">{course.price} €</TCell>
                      <TCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600" onClick={() => navigate(`/courses/${course.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600" onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600">
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

        {/* Recent Submissions / Sidebar */}
        <div className="space-y-8">
          <Card className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Dernières Soumissions</CardTitle>
              <CardDescription>Devoirs récemment envoyés par vos élèves.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-center py-10 text-slate-400 font-medium">Aucune soumission.</p>
                ) : (
                  submissions.slice(0, 5).map((sub: SubmissionListItem) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs uppercase">
                          {sub.user.firstName[0]}{sub.user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{sub.user.firstName} {sub.user.lastName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-1">{sub.assignment.title}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={sub.grade ? "ghost" : "outline"} 
                        className={cn(
                          "h-8 px-3 rounded-lg text-[10px] font-black uppercase",
                          sub.grade ? "text-emerald-600" : ""
                        )}
                        onClick={() => navigate('/teacher/grading')}
                      >
                        {sub.grade ? `Note: ${sub.grade.value}/20` : 'Noter'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {submissions.length > 0 && (
                <Button variant="ghost" className="w-full mt-6 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                  Voir tout
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black">Boostez votre audience</h3>
            <p className="text-slate-400 mt-2 text-sm font-medium">Partagez vos cours sur les réseaux sociaux pour attirer plus d'étudiants.</p>
            <Button className="mt-6 w-full bg-white text-slate-900 hover:bg-slate-100">
              Générer un lien
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
