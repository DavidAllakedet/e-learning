import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, ArrowRight, Trophy } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';
import { cn } from '../../utils/cn';

type AssignmentRow = {
  id: string;
  title: string;
  dueDate: string;
  course: { id: string; title: string };
  status: 'pending' | 'submitted' | 'graded';
  grade: { value: number; feedback?: string | null } | null;
};

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/assignments/student')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const badgeVariant = (status: AssignmentRow['status']) => {
    if (status === 'graded') return 'success';
    if (status === 'submitted') return 'primary';
    return 'warning';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes devoirs</h1>
          <p className="text-slate-500 font-medium">Soumissions, statuts et notes de vos cours inscrits.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Tableau des devoirs</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${items.length} devoir(s)`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Devoir</THead>
                <THead>Cours</THead>
                <THead>Date limite</THead>
                <THead>Statut</THead>
                <THead className="text-right">Action</THead>
              </TRow>
            </THeader>
            <TBody>
              {items.map(a => (
                <TRow key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="truncate max-w-64">{a.title}</span>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-medium">{a.course.title}</TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                  </TCell>
                  <TCell>
                    <Badge variant={badgeVariant(a.status)} className={cn('rounded-lg', a.status === 'submitted' && 'bg-indigo-50 text-indigo-600 border-indigo-100')}>
                      {a.status === 'pending' ? 'À rendre' : a.status === 'submitted' ? 'Soumis' : 'Noté'}
                    </Badge>
                  </TCell>
                  <TCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {a.status === 'graded' && a.grade && (
                        <Badge variant="success" className="rounded-lg">
                          <Trophy className="w-4 h-4 mr-2" />
                          {a.grade.value}/20
                        </Badge>
                      )}
                      <Button className="rounded-xl h-10 px-4" onClick={() => navigate(`/student/assignments/${a.id}`)}>
                        Ouvrir
                        <ArrowRight className="ml-2 w-4 h-4" />
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
  );
};

export default StudentAssignments;
