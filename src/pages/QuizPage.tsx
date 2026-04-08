import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Timer, 
  Trophy, 
  AlertCircle, 
  Loader2,
  RefreshCcw,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

interface Question {
  id: string;
  text: string;
  options: string; // JSON string
  answer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  results: {
    questionId: string;
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string | null;
  }[];
}

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
    } catch {
      console.error('Erreur lors du chargement du quiz');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleOptionSelect = (questionId: string, option: string) => {
    if (results) return;
    setUserAnswers({ ...userAnswers, [questionId]: option });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const answers = Object.entries(userAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));
      const res = await api.post(`/quizzes/${id}/submit`, { quizId: id, answers });
      setResults(res.data);
    } catch {
      alert('Erreur lors de la soumission du quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Préparation de l'évaluation...</p>
    </div>
  );

  if (!quiz) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500">
        <AlertCircle className="w-10 h-10" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900">Quiz introuvable</h3>
        <p className="text-slate-500 font-medium">Ce contenu n'est plus disponible ou a été déplacé.</p>
      </div>
      <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl px-8">Retour</Button>
    </div>
  );

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;
  const hasAnsweredCurrent = !!userAnswers[currentQuestion?.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header / Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest mb-3">
            Évaluation de connaissances
          </Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{quiz.title}</h1>
        </div>
        {!results && (
          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <Timer className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Temps écoulé</p>
              <p className="text-sm font-bold text-slate-700 mt-1">04:32</p>
            </div>
          </div>
        )}
      </div>

      {!results ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} sur {quiz.questions.length}</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Question Card */}
            <Card className="p-10 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-10">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {JSON.parse(currentQuestion.options).map((option: string, idx: number) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const labels = ['A', 'B', 'C', 'D', 'E'];
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                      className={cn(
                        "w-full flex items-center p-5 rounded-2xl border-2 transition-all group text-left",
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100" 
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 transition-colors",
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                      )}>
                        {labels[idx]}
                      </div>
                      <span className={cn(
                        "font-bold text-base transition-colors",
                        isSelected ? "text-indigo-900" : "text-slate-600 group-hover:text-slate-900"
                      )}>
                        {option}
                      </span>
                      {isSelected && (
                        <div className="ml-auto">
                          <CheckCircle2 className="w-6 h-6 text-indigo-600 animate-in zoom-in" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="rounded-xl font-black text-slate-400"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" />
                  Précédent
                </Button>

                {isLastQuestion ? (
                  <Button 
                    className="rounded-xl px-10 h-12 shadow-lg shadow-indigo-100"
                    disabled={Object.keys(userAnswers).length < quiz.questions.length || isSubmitting}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Terminer le quiz
                    <CheckCircle2 className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button 
                    className="rounded-xl px-10 h-12 shadow-lg shadow-indigo-100"
                    disabled={!hasAnsweredCurrent}
                    onClick={() => setCurrentQuestionIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                  >
                    Suivant
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar / Instructions */}
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Instructions</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Répondez à toutes les questions pour pouvoir soumettre.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Une seule réponse correcte par question.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Le score final sera ajouté à votre progression globale.</p>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-slate-900 border-none text-white relative overflow-hidden">
              <div className="relative z-10">
                <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
                <h4 className="text-lg font-black">Besoin de réviser ?</h4>
                <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">Vous pouvez quitter le quiz et revenir plus tard. Votre progression ne sera pas perdue.</p>
                <Button variant="outline" className="mt-6 w-full border-white/10 text-white hover:bg-white/5 h-10 text-xs" onClick={() => navigate(-1)}>
                  Retour au cours
                </Button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            </Card>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <Card className="p-12 border-none shadow-2xl shadow-indigo-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-emerald-500" />
            
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-100/50 border-4 border-white">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Félicitations !</h2>
              <p className="text-slate-500 font-medium mb-10 text-lg">Vous avez terminé l'évaluation avec succès.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Votre Score</p>
                  <p className="text-4xl font-black text-indigo-600">{results.score}<span className="text-xl text-slate-300 ml-1">/ {results.totalQuestions}</span></p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Précision</p>
                  <p className="text-4xl font-black text-emerald-500">{Math.round((results.score / results.totalQuestions) * 100)}<span className="text-xl text-slate-300 ml-1">%</span></p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="w-full sm:w-auto rounded-2xl h-14 px-10 shadow-lg shadow-indigo-100" onClick={() => navigate(-1)}>
                  Continuer le cours
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto rounded-2xl h-14 px-10 border-2" onClick={() => window.location.reload()}>
                  <RefreshCcw className="mr-2 w-4 h-4" />
                  Recommencer
                </Button>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />
          </Card>

          {/* Detailed Review */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 px-4">Récapitulatif détaillé</h3>
            <div className="space-y-4">
              {results.results.map((res, i) => {
                const question = quiz.questions.find(q => q.id === res.questionId);
                return (
                  <Card key={i} className={cn(
                    "p-6 border-none shadow-md",
                    res.isCorrect ? "bg-emerald-50/30 ring-1 ring-emerald-100" : "bg-rose-50/30 ring-1 ring-rose-100"
                  )}>
                    <div className="flex items-start space-x-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                        res.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}>
                        {res.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="space-y-3 flex-1">
                        <p className="font-bold text-slate-900">{question?.text}</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Votre réponse</p>
                            <p className={cn("text-sm font-bold", res.isCorrect ? "text-emerald-600" : "text-rose-600")}>
                              {res.userAnswer || 'Pas de réponse'}
                            </p>
                          </div>
                          {!res.isCorrect && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase">Réponse correcte</p>
                              <p className="text-sm font-bold text-emerald-600">{res.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
