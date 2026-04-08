import { Settings, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const AdminSettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres système</h1>
          <p className="text-slate-500 font-medium">Configuration plateforme (version v1).</p>
        </div>
        <Badge variant="primary" className="rounded-lg bg-indigo-50 text-indigo-600 border-indigo-100">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Admin
        </Badge>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle>Général</CardTitle>
          <CardDescription>Les paramètres avancés (SMTP, stockage, 2FA) sont planifiés en v2.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Paramètres indisponibles</p>
              <p className="text-sm font-medium text-slate-500">Ce module est prêt côté UI, endpoints en cours de consolidation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

