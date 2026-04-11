import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

type Question = {
  text: string;
  options: string[];
  answer: string;
};

type Quiz = {
  id: string;
  title: string;
  questions: { text: string; options: string; answer: string }[];
};

const safeJsonParseArray = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const TeacherQuizEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const isNew = !id;

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        try {
          const coursesRes = await api.get('/courses/teacher/my');
          setCourses(coursesRes.data);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
        setQuiz({ id: '', title: 'Nouveau Quiz', questions: [] });
        return;
      }
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setTitle(res.data.title);
        setQuestions(
          (res.data.questions || []).map((q: { text: string; options: string; answer: string }) => ({
            text: q.text,
            options: safeJsonParseArray(q.options || '[]'),
            answer: q.answer,
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isNew]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, { text: '', options: ['', '', '', ''], answer: '' }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, next: Partial<Question>) => {
    setQuestions(prev => prev.map((q, i) => (i === idx ? { ...q, ...next } : q)));
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const options = q.options.map((opt, j) => (j === oIdx ? value : opt));
        return { ...q, options };
      })
    );
  };

  const handleSave = async () => {
    if (!quiz && !isNew) return;
    setSaving(true);
    try {
      if (isNew) {
        if (!selectedCourseId) {
          alert('Veuillez sélectionner un cours');
          setSaving(false);
          return;
        }
        await api.post('/quizzes', {
          title,
          courseId: selectedCourseId,
          questions,
        });
      } else {
        await api.put(`/quizzes/${quiz!.id}`, {
          title,
          questions,
        });
      }
      navigate('/teacher/quizzes');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500">
          <HelpCircle className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Quiz introuvable</h3>
          <p className="text-slate-500 font-medium">Ce quiz n'existe plus ou n'est pas accessible.</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl px-8">Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/quizzes')} className="rounded-xl bg-white shadow-sm border border-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] uppercase font-black rounded-lg">Éditeur Quiz</Badge>
              <span className="text-slate-300 font-bold">•</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{questions.length} Questions</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{quiz.title}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-2" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter question
          </Button>
          <Button className="rounded-2xl h-12 px-8 shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-xs" isLoading={saving} onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
        {isNew && (
          <>
            <CardHeader className="p-0 mb-6">
              <CardTitle>Choisir un cours</CardTitle>
              <CardDescription>Sélectionnez le cours pour ce quiz.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mb-6">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Sélectionner un cours</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </CardContent>
          </>
        )}
        <CardHeader className="p-0 mb-6">
          <CardTitle>Titre</CardTitle>
          <CardDescription>Nom affiché aux étudiants.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du quiz" className="rounded-xl border-slate-100 bg-slate-50/50" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <Card key={idx} className="p-8 border-none shadow-xl shadow-slate-200/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="rounded-lg">Question {idx + 1}</Badge>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600" onClick={() => removeQuestion(idx)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Input
                  label="Énoncé"
                  value={q.text}
                  onChange={(e) => updateQuestion(idx, { text: e.target.value })}
                  placeholder="Ex: Quel est le rôle de useEffect ?"
                  className="rounded-xl border-slate-100 bg-slate-50/50"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options.map((opt, optIdx) => (
                    <Input
                      key={optIdx}
                      label={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Bonne réponse</label>
                  <select
                    value={q.answer}
                    onChange={(e) => updateQuestion(idx, { answer: e.target.value })}
                    className={cn(
                      'h-12 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200'
                    )}
                  >
                    <option value="">Sélectionner</option>
                    {q.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt || `Option ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherQuizEditor;
