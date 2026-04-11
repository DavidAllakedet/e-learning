import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle2, FileText, MessageSquare, Clock, Save } from 'lucide-react';

type SubmissionRow = {
  id: string;
  assignmentId: string;
  fileUrl: string;
  submittedAt: string;
  user: { firstName: string; lastName: string };
  assignment: { title: string };
  grade: { value: number; feedback?: string | null } | null;
};

const TeacherGrading = () => {
  const [items, setItems] = useState<SubmissionRow[]>([]);
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/assignments/teacher/submissions')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setValue(selected.grade ? String(selected.grade.value) : '');
    setFeedback(selected.grade?.feedback || '');
  }, [selected]);

  const pendingCount = useMemo(() => items.filter(i => !i.grade).length, [items]);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await api.post('/assignments/grade', { submissionId: selected.id, value, feedback });
      setItems(prev => prev.map(i => (i.id === selected.id ? { ...i, grade: res.data } : i)));
      setSelected(prev => prev ? { ...prev, grade: res.data } : prev);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la notation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Correction</h1>
          <p className="text-slate-500 font-medium">Corrigez uniquement les devoirs de vos cours.</p>
        </div>
        <Badge variant="warning" className="rounded-lg">
          {pendingCount} à corriger
        </Badge>
      </div>

      {selected && (
        <Card className="border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle>Noter la soumission</CardTitle>
            <CardDescription>{selected.user.firstName} {selected.user.lastName} • {selected.assignment.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[280px]">{selected.fileUrl.split('/').pop()}</span>
                </div>
                <Button variant="outline" className="rounded-xl border-2" onClick={() => window.open(`${import.meta.env.VITE_UPLOADS_URL}${selected.fileUrl}`, '_blank')}>
                  Voir le fichier
                </Button>
              </div>
              <div className="w-full lg:w-80 space-y-4">
                <Input label="Note (/20)" placeholder="Ex: 15" value={value} onChange={(e) => setValue(e.target.value)} />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Commentaires, points d'amélioration..."
                    className="w-full min-h-[120px] rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <Button className="w-full rounded-2xl h-12" isLoading={saving} onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Soumissions</CardTitle>
          <CardDescription>{items.length} soumission(s)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Étudiant</THead>
                <THead>Devoir</THead>
                <THead>Date</THead>
                <THead>Statut</THead>
                <THead className="text-right">Action</THead>
              </TRow>
            </THeader>
            <TBody>
              {items.map(s => (
                <TRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">{s.user.firstName} {s.user.lastName}</TCell>
                  <TCell className="text-slate-600 font-medium">{s.assignment.title}</TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-300" />
                      <span>{new Date(s.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </TCell>
                  <TCell>
                    {s.grade ? (
                      <Badge variant="success" className="rounded-lg">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Noté ({s.grade.value}/20)
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="rounded-lg">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        À corriger
                      </Badge>
                    )}
                  </TCell>
                  <TCell className="text-right">
                    <Button variant={s.grade ? 'outline' : 'primary'} className="rounded-xl h-10 px-4" onClick={() => setSelected(s)}>
                      {s.grade ? 'Modifier' : 'Noter'}
                    </Button>
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

export default TeacherGrading;

