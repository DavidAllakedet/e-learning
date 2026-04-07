// d:\PROJETS\COURS REACT\e-l\my-react-app\src\pages\QuizPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Question {
  id: string;
  text: string;
  options: string;
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
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(res => setQuiz(res.data));
  }, [id]);

  const handleOptionSelect = (questionId: string, option: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: option });
  };

  const handleSubmit = async () => {
    const answers = Object.entries(userAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));
    const res = await api.post(`/quizzes/${id}/submit`, { quizId: id, answers });
    setResults(res.data);
  };

  if (!quiz) return <div className="text-center p-10">Chargement du quiz...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm mt-10">
      <h1 className="text-3xl font-bold mb-8">{quiz.title}</h1>
      
      {!results ? (
        <>
          {quiz.questions.map((q) => (
            <div key={q.id} className="mb-8 p-6 bg-slate-50 rounded-xl">
              <p className="text-lg font-semibold mb-4">{q.text}</p>
              <div className="space-y-3">
                {JSON.parse(q.options).map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(q.id, opt)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      userAnswers[q.id] === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button 
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition"
          >
            Soumettre le quiz
          </button>
        </>
      ) : (
        <div className="text-center p-10 bg-indigo-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-indigo-900">Résultat : {results.score} / {results.totalQuestions}</h2>
          <p className="mt-4 text-indigo-700">Bravo pour avoir terminé ce quiz !</p>
          <button onClick={() => window.location.reload()} className="mt-8 text-indigo-600 font-bold underline">Recommencer</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;