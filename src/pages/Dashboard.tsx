import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  BookOpen, 
  CheckCircle2, 
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
  progress: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/enrolled')
      .then(res => setEnrolledCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Cours en cours', value: enrolledCourses.filter(c => c.progress < 100).length.toString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/student/courses' },
    { label: 'Cours terminés', value: enrolledCourses.filter(c => c.progress === 100).length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/student/courses' },
    // { label: 'Heures apprises', value: '12h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    // { label: 'Points acquis', value: (enrolledCourses.length * 50).toString(), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 font-medium">Bon retour parmi nous, {user?.firstName} ! Prêt pour une nouvelle leçon ?</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100" onClick={() => navigate('/catalog')}>
          Continuer l'apprentissage
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-transform cursor-pointer border-none shadow-xl shadow-slate-200/40" onClick={() => stat.link && navigate(stat.link)}>
            <div className="flex items-center space-x-4">
              <div className={cn('p-4 rounded-2xl transition-colors', stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Mes Cours Récents</h2>
            <Button variant="ghost" className="text-indigo-600 font-black" onClick={() => navigate('/student/courses')}>Voir tout</Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : enrolledCourses.length === 0 ? (
            <Card className="p-12 text-center border-none shadow-xl shadow-slate-200/40">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Aucun cours pour le moment</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">Explorez le catalogue pour commencer à apprendre.</p>
              <Button className="mt-6 rounded-xl" onClick={() => navigate('/catalog')}>Parcourir le catalogue</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.slice(0, 4).map((course) => (
                <Card 
                  key={course.id} 
                  className="p-0 overflow-hidden group border-none shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-50 transition-all cursor-pointer"
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                >
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="primary" className="bg-white/20 backdrop-blur-md text-white border-white/20 font-black text-[10px] uppercase">
                        Développement
                      </Badge>
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/20 backdrop-blur-[2px]">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <PlayCircle className="w-6 h-6 text-indigo-600 fill-indigo-600/10" />
                      </div>
                    </button>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                      Par {course.teacher.firstName} {course.teacher.lastName}
                    </p>
                    
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                        <span className="text-slate-400">Progression</span>
                        <span className="text-indigo-600">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${course.progress}%` }} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Notifications/Activities */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Activités Récentes</h2>
            <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="divide-y divide-slate-50">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-5 flex items-start space-x-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">Module complété</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">Vous avez terminé une leçon importante.</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase mt-2">Il y a {i + 1}h</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
