import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

const AdminReports = () => {
  const download = async (url: string, filename: string) => {
    try {
      const res = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error(error);
      alert('Impossible de télécharger le fichier');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rapports</h1>
        <p className="text-slate-500 font-medium">Exports et audits (version v1).</p>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle>Exports</CardTitle>
          <CardDescription>Export basique pour le déploiement initial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Utilisateurs (CSV)</p>
                <p className="text-xs font-medium text-slate-500">Export complet des comptes (admin).</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl border-2" onClick={() => download('/users/reports/users.csv', 'users.csv')}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Inscriptions (CSV)</p>
                <p className="text-xs font-medium text-slate-500">Export des inscriptions par cours.</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl border-2" onClick={() => download('/users/reports/enrollments.csv', 'enrollments.csv')}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
