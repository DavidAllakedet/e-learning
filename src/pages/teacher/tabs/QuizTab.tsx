import { Plus, Trash2, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

interface QuizTabProps {
  course: any;
  isAddingQuiz: boolean;
  setIsAddingQuiz: (v: boolean) => void;
  newQuizTitle: string;
  setNewQuizTitle: (v: string) => void;
  currentQuizQuestions: any[];
  setCurrentQuizQuestions: (q: any[]) => void;
  handleCreateQuiz: () => void;
  handleDeleteQuiz: (id: string) => void;
  navigate: any;
}

const QuizTab = ({
  course,
  isAddingQuiz,
  setIsAddingQuiz,
  newQuizTitle,
  setNewQuizTitle,
  currentQuizQuestions,
  setCurrentQuizQuestions,
  handleCreateQuiz,
  handleDeleteQuiz,
  navigate
}: QuizTabProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Évaluations</h2>
          <p className="text-slate-500 font-medium">Gérez les tests de connaissances de ce cours.</p>
        </div>
        <Button onClick={() => setIsAddingQuiz(true)} className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100">
          <Plus className="mr-2 w-5 h-5" />
          Nouveau Quiz
        </Button>
      </div>

      {isAddingQuiz ? (
        <Card className="p-10 border-none shadow-2xl shadow-indigo-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black">Création d'un Quiz</h3>
            <Button variant="ghost" onClick={() => setIsAddingQuiz(false)} className="rounded-xl text-slate-400">Annuler</Button>
          </div>

          <div className="space-y-8 max-w-2xl">
            <Input 
              label="Titre du Quiz" 
              placeholder="Ex: Quiz final du Module 1"
              value={newQuizTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuizTitle(e.target.value)}
            />

            <div className="space-y-6">
              <h4 className="font-black text-slate-700">Questions ({currentQuizQuestions.length})</h4>
              {currentQuizQuestions.map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <Input
                    label={`Question ${idx + 1}`}
                    placeholder="Entrez la question"
                    value={q.text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newQs = [...currentQuizQuestions];
                      newQs[idx].text = e.target.value;
                      setCurrentQuizQuestions(newQs);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt: string, optIdx: number) => (
                      <Input
                        key={optIdx}
                        label={`Option ${optIdx + 1}`}
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newQs = [...currentQuizQuestions];
                          newQs[idx].options[optIdx] = e.target.value;
                          setCurrentQuizQuestions(newQs);
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-bold text-slate-700">Bonne réponse:</label>
                    <select
                      value={q.answer}
                      onChange={(e) => {
                        const newQs = [...currentQuizQuestions];
                        newQs[idx].answer = e.target.value;
                        setCurrentQuizQuestions(newQs);
                      }}
                      className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
                    >
                      <option value="">Sélectionner</option>
                      {q.options.map((opt: string, i: number) => (
                        <option key={i} value={opt}>{opt || `Option ${i + 1}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuizQuestions([...currentQuizQuestions, { text: '', options: ['', '', '', ''], answer: '' }])}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une question
              </Button>
            </div>

            <Button onClick={handleCreateQuiz} className="w-full rounded-xl h-12">
              Créer le Quiz
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.quizzes?.map((quiz: any) => (
            <Card key={quiz.id} className="p-8 border-none shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-50 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)} className="text-slate-300 hover:text-rose-500 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{(quiz.questions || []).length} Questions</p>
              <Button variant="ghost" className="w-full rounded-xl font-black text-indigo-600 hover:bg-indigo-50 group-hover:translate-x-1 transition-all flex items-center justify-center" onClick={() => navigate(`/teacher/quizzes/${quiz.id}/edit`)}>
                Modifier les questions
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Card>
          ))}

          <button 
            onClick={() => setIsAddingQuiz(true)}
            className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-slate-300 group-hover:text-indigo-600" />
            </div>
            <p className="font-black text-slate-400 group-hover:text-indigo-600 text-sm uppercase tracking-widest">Nouveau Quiz</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;