import { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, FileText, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

type Stats = {
  users: number;
  courses: number;
  enrollments: number;
  assignments: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/users/stats').then(res => setStats(res.data)).catch(err => console.error(err));
  }, []);

  const cards = [
    { label: 'Utilisateurs', value: stats?.users ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cours', value: stats?.courses ?? 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Inscriptions', value: stats?.enrollments ?? 0, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Devoirs', value: stats?.assignments ?? 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Administration</h1>
          <p className="text-slate-500 font-medium">Vue globale et pilotage de la plateforme.</p>
        </div>
        <Badge variant="primary" className="rounded-lg bg-indigo-50 text-indigo-600 border-indigo-100">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Admin
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{c.value}</p>
              </div>
              <div className={cn('p-3 rounded-2xl', c.bg, c.color)}>
                <c.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

