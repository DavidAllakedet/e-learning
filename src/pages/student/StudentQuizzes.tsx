import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, HelpCircle, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';
import { cn } from '../../utils/cn';

type StudentQuizRow = {
  id: string;
  title: string;
  course: { id: string; title: string };
  bestScore: number | null;
  attemptsUsed: number;
};

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<StudentQuizRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/student')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes quiz</h1>
          <p className="text-slate-500 font-medium">Uniquement les quiz des cours auxquels vous êtes inscrit.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Liste des quiz</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${items.length} quiz disponible(s)`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Quiz</THead>
                <THead>Cours</THead>
                <THead>Meilleure note</THead>
                <THead className="text-right">Action</THead>
              </TRow>
            </THeader>
            <TBody>
              {items.map(q => (
                <TRow key={q.id} className="hover:bg-slate-50/50 transition-colors">
                  <TCell className="font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="truncate max-w-72">{q.title}</span>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{q.course.title}</span>
                    </div>
                  </TCell>
                  <TCell>
                    {q.bestScore == null ? (
                      <Badge variant="warning" className="rounded-lg">Pas encore tenté</Badge>
                    ) : (
                      <Badge variant="success" className="rounded-lg">
                        <Trophy className="w-4 h-4 mr-2" />
                        {Math.round(q.bestScore)}%
                      </Badge>
                    )}
                    <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-widest">{q.attemptsUsed} tentative(s)</span>
                  </TCell>
                  <TCell className="text-right">
                    <Button className={cn('rounded-xl h-10 px-4', q.bestScore != null && 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100')} onClick={() => navigate(`/student/quiz/${q.id}`)}>
                      {q.bestScore == null ? 'Commencer' : 'Retenter'}
                      <ArrowRight className="ml-2 w-4 h-4" />
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

export default StudentQuizzes;

