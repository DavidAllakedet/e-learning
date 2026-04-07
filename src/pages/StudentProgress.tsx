
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../components/ui/Table';

const StudentProgress = () => {
  const stats = [
    { label: 'Cours terminés', value: '12', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Certificats', value: '4', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Moyenne Quiz', value: '18.5/20', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Série (jours)', value: '15', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const courses = [
    { id: '1', title: 'React Avancé & TypeScript', modules: 24, completed: 18, lastActivity: 'Aujourd\'hui', grade: '19/20' },
    { id: '2', title: 'Node.js Architecture & Clean Code', modules: 15, completed: 5, lastActivity: 'Hier', grade: '17/20' },
    { id: '3', title: 'UI Design avec Tailwind CSS v4', modules: 10, completed: 10, lastActivity: 'Il y a 3 jours', grade: '20/20' },
    { id: '4', title: 'Introduction à Prisma ORM', modules: 8, completed: 2, lastActivity: 'Il y a 1 semaine', grade: '-' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Hero Header */}
      <div className="bg-white p-10 rounded-5xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 rounded-full px-4 py-1.5 font-black text-xs uppercase tracking-widest">
            Performance Étudiant
          </Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Continuez sur cette lancée ! 🚀
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Vous avez progressé de <span className="text-indigo-600 font-black">25%</span> de plus que la semaine dernière.
          </p>
        </div>
        <div className="flex items-center space-x-6 bg-slate-50 p-8 rounded-4xl border border-slate-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Prochain Badge</p>
            <p className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Expert React</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Course Progress Table */}
        <Card className="xl:col-span-2 p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40">
          <CardHeader className="p-8 border-b border-slate-50 bg-white flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">Progression par Cours</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Détail de votre avancement dans chaque formation.</CardDescription>
            </div>
            <Button variant="ghost" className="text-indigo-600 font-black">
              Voir tout
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <THeader className="bg-slate-50/50">
                <TRow>
                  <THead className="pl-8">Cours</THead>
                  <THead>Progression</THead>
                  <THead>Note Quiz</THead>
                  <THead className="pr-8 text-right">Dernière activité</THead>
                </TRow>
              </THeader>
              <TBody>
                {courses.map((course) => {
                  const percent = Math.round((course.completed / course.modules) * 100);
                  return (
                    <TRow key={course.id} className="hover:bg-slate-50/30 transition-colors">
                      <TCell className="pl-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{course.title}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                              {course.completed} / {course.modules} modules terminés
                            </p>
                          </div>
                        </div>
                      </TCell>
                      <TCell className="w-48">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase text-indigo-600">
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </TCell>
                      <TCell>
                        <Badge variant={course.grade === '-' ? 'outline' : 'primary'} className="rounded-lg px-3">
                          {course.grade}
                        </Badge>
                      </TCell>
                      <TCell className="pr-8 text-right font-medium text-slate-500">
                        {course.lastActivity}
                      </TCell>
                    </TRow>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </Card>

        {/* Weekly Activity Sidebar */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-xl font-black">Activité Hebdomadaire</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              {[
                { day: 'Lun', hours: 4, active: true },
                { day: 'Mar', hours: 2, active: true },
                { day: 'Mer', hours: 6, active: true },
                { day: 'Jeu', hours: 0, active: false },
                { day: 'Ven', hours: 3, active: true },
                { day: 'Sam', hours: 1, active: true },
                { day: 'Dim', hours: 0, active: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="w-8 text-xs font-black text-slate-400 uppercase">{item.day}</span>
                  <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${item.active ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      style={{ width: `${(item.hours / 6) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-black text-slate-700">{item.hours}h</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total cette semaine</p>
                <p className="text-2xl font-black text-slate-900 mt-1">16 heures</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="bg-slate-900 border-none p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Calendar className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-2xl font-black leading-tight">Planifiez votre <br />prochaine session</h3>
              <p className="text-slate-400 mt-4 text-sm font-medium leading-relaxed opacity-80">
                L'apprentissage régulier est la clé du succès. Bloquez un créneau de 15 minutes demain !
              </p>
              <Button className="mt-10 w-full bg-white text-slate-900 hover:bg-slate-50 h-12 rounded-2xl font-black text-xs uppercase tracking-widest">
                Ajouter au calendrier
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
