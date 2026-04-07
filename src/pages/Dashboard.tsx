import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

interface User {
  firstName: string;
  lastName: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  teacher: { firstName: string, lastName: string };
}

const Dashboard = () => {
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: 'Cours en cours', value: '3', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Cours terminés', value: '12', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Heures apprises', value: '48h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Points acquis', value: '1,250', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 font-medium">Bon retour parmi nous, {user?.firstName} ! Prêt pour une nouvelle leçon ?</p>
        </div>
        <Button className="rounded-2xl">
          Continuer l'apprentissage
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-transform cursor-default">
            <div className="flex items-center space-x-4">
              <div className={cn('p-3 rounded-2xl transition-colors', stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Mes Cours Récents</h2>
            <Button variant="ghost" className="text-indigo-600 font-black">Voir tout</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 4).map((course) => (
              <Card key={course.id} className="p-0 overflow-hidden group border-slate-100 hover:border-indigo-100 transition-all">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="primary" className="bg-white/20 backdrop-blur-md text-white border-white/20">
                      Développement
                    </Badge>
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/20 backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                      <PlayCircle className="w-6 h-6 text-indigo-600 fill-indigo-600/10" />
                    </div>
                  </button>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium"> Par {course.teacher.firstName} {course.teacher.lastName}</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-slate-400">Progression</span>
                      <span className="text-indigo-600">65%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Notifications/Activities */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Activités Récentes</h2>
            <Card className="p-0">
              <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="p-4 flex items-start space-x-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">Vous avez terminé le module "Bases du React"</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">Il y a 2 heures</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upgrade Banner */}
          <Card className="bg-indigo-600 border-none p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
            <div className="relative z-10">
              <h3 className="text-xl font-black leading-tight">Passez au niveau supérieur !</h3>
              <p className="text-indigo-100 mt-2 text-sm font-medium opacity-90">Accédez à tous les cours premium et aux certificats officiels.</p>
              <Button variant="secondary" className="mt-6 w-full bg-white text-indigo-600 hover:bg-indigo-50">
                Devenir Pro
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
