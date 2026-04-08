import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  User,
  Star,
  Loader2,
  Circle,
  Download
} from 'lucide-react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import MediaViewer from '../components/MediaViewer';
import { cn } from '../utils/cn';

interface Content {
  id: string;
  title: string;
  type: 'VIDEO' | 'PDF';
  url: string;
}

interface Module {
  id: string;
  title: string;
  contents: Content[];
}

interface Quiz {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  teacher: { firstName: string, lastName: string };
  modules: Module[];
  quizzes: Quiz[];
  isEnrolled: boolean;
}

interface Progress {
  percentage: number;
  completedContentIds: string[];
  completedQuizIds: string[];
}

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('user') || 'null')?.role as string | undefined;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState<Content | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);

      if (courseRes.data.isEnrolled) {
        const progressRes = await api.get(`/progress/course/${id}`);
        setProgress(progressRes.data);
        
        // Auto-select first content if available and none selected
        if (courseRes.data.modules.length > 0 && courseRes.data.modules[0].contents.length > 0 && !activeContent) {
          setActiveContent(courseRes.data.modules[0].contents[0]);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cours', error);
    } finally {
      setLoading(false);
    }
  }, [id, activeContent]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await api.post('/courses/enroll', { courseId: id });
      await fetchCourseDetails();
    } catch (error) {
      console.error('Erreur lors de l\'inscription', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkAsCompleted = async (contentId: string) => {
    if (isUpdatingProgress) return;
    setIsUpdatingProgress(true);
    try {
      const isCompleted = progress?.completedContentIds.includes(contentId);
      await api.post('/progress/update', { 
        courseContentId: contentId, 
        completed: !isCompleted 
      });
      
      // Refresh progress
      const progressRes = await api.get(`/progress/course/${id}`);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression', error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Erreur lors du téléchargement', error);
      alert('Impossible de télécharger le fichier.');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!course) return <div>Cours non trouvé</div>;

  const isActiveCompleted = progress?.completedContentIds.includes(activeContent?.id || '');

  if (!course.isEnrolled) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/catalog')} className="rounded-xl group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au catalogue
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-video relative">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-4">Prêt à propulser votre carrière ?</h2>
                <p className="text-slate-300 max-w-lg mb-10 text-lg">Inscrivez-vous dès maintenant pour accéder à l'intégralité du contenu, aux quiz et obtenir votre certificat.</p>
                <Button 
                  onClick={handleEnroll} 
                  isLoading={isEnrolling}
                  className="rounded-2xl h-16 px-12 text-lg shadow-2xl shadow-indigo-500/20 font-black uppercase tracking-widest"
                >
                  S'inscrire au cours
                </Button>
              </div>
            </div>

            <div className="space-y-6 px-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{course.title}</h1>
              <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-none">{course.teacher.firstName} {course.teacher.lastName}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Expert Formateur</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed text-lg">
                  {course.description}
                </p>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 relative overflow-hidden">
              <h3 className="text-xl font-black mb-6">Inclus dans ce cours</h3>
              <ul className="space-y-4">
                {[
                  { label: 'Modules de formation complets', icon: PlayCircle },
                  { label: 'Ressources PDF téléchargeables', icon: FileText },
                  { label: 'Évaluations et Quiz', icon: Star },
                  { label: 'Certificat de complétion', icon: CheckCircle2 }
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-300 font-medium">
                    <item.icon className="w-5 h-5 text-indigo-400" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/catalog')} className="rounded-xl group">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au catalogue
        </Button>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-white border-slate-200">Développement</Badge>
          <div className="flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100">
            <Star className="w-3 h-3 fill-amber-600" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Video Player */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 ring-1 ring-white/10">
            {activeContent ? (
              <div className="aspect-video bg-black">
                <MediaViewer 
                  url={`http://localhost:5000${activeContent.url}`} 
                  type={activeContent.type === 'VIDEO' ? 'video' : 'pdf'} 
                />
              </div>
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-black text-white">Prêt à commencer ?</h3>
                <p className="text-slate-400 max-w-xs">Sélectionnez une leçon dans le menu à droite pour débuter votre apprentissage.</p>
              </div>
            )}
          </div>

          <div className="space-y-6 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeContent?.title || course.title}</h1>
              <div className="flex items-center space-x-3">
                {activeContent?.type === 'PDF' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(`http://localhost:5000${activeContent.url}`, activeContent.title + '.pdf')}
                    className="rounded-2xl h-12 px-6 border-2"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    Télécharger
                  </Button>
                )}
                {activeContent && (
                  <Button 
                    onClick={() => handleMarkAsCompleted(activeContent.id)}
                    variant={isActiveCompleted ? "secondary" : "primary"}
                    isLoading={isUpdatingProgress}
                    className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100 min-w-[200px]"
                  >
                    {isActiveCompleted ? (
                      <>
                        <CheckCircle2 className="mr-2 w-5 h-5" />
                        Terminé
                      </>
                    ) : (
                      <>
                        <Circle className="mr-2 w-5 h-5" />
                        Marquer comme terminé
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-none">{course.teacher.firstName} {course.teacher.lastName}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Expert Formateur</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                {course.description}
              </p>
            </Card>
          </div>
        </div>

        {/* Sidebar: Course Curriculum */}
        <div className="space-y-6">
          <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="text-lg font-black tracking-tight">Sommaire du cours</h3>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Votre progression</p>
                <span className="text-xs font-black text-indigo-400">{progress?.percentage || 0}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${progress?.percentage || 0}%` }} 
                />
              </div>
            </div>

            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
              {course.modules.map((module, idx) => (
                <div key={module.id} className="space-y-1">
                  <div className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg">
                    Module {idx + 1}: {module.title}
                  </div>
                  {module.contents.map((content) => {
                    const isCompleted = progress?.completedContentIds.includes(content.id);
                    return (
                      <button
                        key={content.id}
                        onClick={() => setActiveContent(content)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                          activeContent?.id === content.id 
                            ? "bg-indigo-50 text-indigo-600" 
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-colors",
                            activeContent?.id === content.id 
                              ? "bg-indigo-600 text-white" 
                              : isCompleted 
                                ? "bg-emerald-50 text-emerald-500"
                                : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm"
                          )}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : content.type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <span className={cn("text-sm font-bold truncate max-w-40 text-left", activeContent?.id === content.id ? "text-indigo-600" : "text-slate-700")}>
                            {content.title}
                          </span>
                        </div>
                        {activeContent?.id === content.id && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {course.quizzes && course.quizzes.length > 0 && (
                <div className="space-y-1 pt-4">
                  <div className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-indigo-50/50 rounded-lg text-indigo-600">
                    Évaluations finales
                  </div>
                  {course.quizzes.map((quiz) => {
                    const isCompleted = progress?.completedQuizIds.includes(quiz.id);
                    return (
                      <button
                        key={quiz.id}
                        onClick={() => {
                          if (userRole === 'STUDENT' || userRole === 'SUPER_ADMIN') {
                            navigate(`/student/quiz/${quiz.id}`);
                            return;
                          }
                          alert('Les quiz sont accessibles uniquement aux étudiants.');
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group text-slate-600 hover:bg-indigo-50"
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-colors shadow-sm",
                            isCompleted ? "bg-emerald-50 text-emerald-500" : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                          )}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">
                            {quiz.title}
                          </span>
                        </div>
                        <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 bg-indigo-600 border-none text-white relative overflow-hidden">
            <div className="relative z-10">
              <CheckCircle2 className="w-10 h-10 text-white/20 mb-4" />
              <h4 className="text-xl font-black leading-tight">Obtenez votre certificat</h4>
              <p className="text-indigo-100 text-sm font-medium mt-2 opacity-80">Complétez toutes les leçons et réussissez le quiz final.</p>
              {course.quizzes && course.quizzes.length > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    if (userRole === 'STUDENT' || userRole === 'SUPER_ADMIN') {
                      navigate(`/student/quiz/${course.quizzes[0].id}`);
                      return;
                    }
                    alert('Les quiz sont accessibles uniquement aux étudiants.');
                  }}
                  className="mt-8 w-full bg-white text-indigo-600 hover:bg-indigo-50 h-12 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                  Voir le Quiz
                </Button>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
