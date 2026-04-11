import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, BookOpen, Users, Trophy, ArrowRight, Edit } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, THeader, TBody, TRow, THead, TCell } from '../../components/ui/Table';
import { cn } from '../../utils/cn';

type TeacherQuizRow = {
  id: string;
  title: string;
  course: { id: string; title: string };
  questionsCount: number;
  participants: number;
  avgScore: number | null;
};

const TeacherQuizzes = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TeacherQuizRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/teacher')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quiz (Enseignant)</h1>
          <p className="text-slate-500 font-medium">Gérez les quiz de vos cours uniquement.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/courses/new')}>
          Proposer un cours
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/quizzes/new')}>
          Créer un quiz
          <HelpCircle className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <CardHeader className="p-6 pb-0">
          <CardTitle>Liste des quiz</CardTitle>
          <CardDescription>{loading ? 'Chargement...' : `${items.length} quiz`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-none shadow-none rounded-none">
            <THeader>
              <TRow>
                <THead>Quiz</THead>
                <THead>Cours</THead>
                <THead>Questions</THead>
                <THead>Participants</THead>
                <THead>Moyenne</THead>
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
                      <span className="truncate max-w-64">{q.course.title}</span>
                    </div>
                  </TCell>
                  <TCell className="text-slate-600 font-bold">{q.questionsCount}</TCell>
                  <TCell>
                    <Badge variant="outline" className="rounded-lg">
                      <Users className="w-4 h-4 mr-2" />
                      {q.participants}
                    </Badge>
                  </TCell>
                  <TCell>
                    {q.avgScore == null ? (
                      <Badge variant="warning" className="rounded-lg">Aucun résultat</Badge>
                    ) : (
                      <Badge variant="success" className={cn('rounded-lg', q.avgScore < 50 && 'bg-rose-50 text-rose-600 border-rose-100')}>
                        <Trophy className="w-4 h-4 mr-2" />
                        {Math.round(q.avgScore)}%
                      </Badge>
                    )}
                  </TCell>
                  <TCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" className="rounded-xl border-2" onClick={() => navigate(`/teacher/quizzes/${q.id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Éditer
                      </Button>
                      <Button variant="ghost" className="rounded-xl text-indigo-600 font-black" onClick={() => navigate(`/teacher/courses/${q.course.id}/edit`)}>
                        Cours
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

export default TeacherQuizzes;
