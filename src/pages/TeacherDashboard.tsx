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
  Eye
} from 'lucide-react';
import { cn } from '../utils/cn';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats] = useState({
    totalStudents: 124,
    activeCourses: 8,
    submissionsPending: 12,
    revenue: '1,450 €'
  });

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data));
  }, []);

  const statCards = [
    { label: 'Étudiants Totaux', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cours Actifs', value: stats.activeCourses, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Devoirs à Corriger', value: stats.submissionsPending, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenus du mois', value: stats.revenue, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Enseignant</h1>
          <p className="text-slate-500 font-medium">Gérez vos cours, vos étudiants et suivez vos performances.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6">
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
                  {courses.map((course: { id: string, title: string, price: number }) => (
                    <TRow key={course.id}>
                      <TCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                          <span className="font-bold text-slate-900 truncate max-w-50">{course.title}</span>
                        </div>
                      </TCell>
                      <TCell>45 élèves</TCell>
                      <TCell>
                        <Badge variant="success">Publié</Badge>
                      </TCell>
                      <TCell className="font-bold">{course.price} €</TCell>
                      <TCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/courses/edit/${course.id}`)}>
                            <Edit className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-rose-600">
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
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Jean Dupont</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">React Bases - Devoir 1</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-[10px] font-black uppercase">
                      Noter
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                Voir tout
              </Button>
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
