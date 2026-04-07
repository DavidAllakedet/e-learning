import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  User,
  Star,
  Loader2
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

interface Course {
  id: string;
  title: string;
  description: string;
  teacher: { firstName: string, lastName: string };
  modules: Module[];
}

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState<Content | null>(null);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
      
      // Auto-select first content if available
      if (res.data.modules.length > 0 && res.data.modules[0].contents.length > 0 && !activeContent) {
        setActiveContent(res.data.modules[0].contents[0]);
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

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!course) return <div>Cours non trouvé</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeContent?.title || course.title}</h1>
              <Button variant="outline" className="rounded-xl border-2 font-black text-slate-700">
                <FileText className="mr-2 w-4 h-4" />
                Ressources
              </Button>
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
                <span className="text-xs font-black text-indigo-400">0%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
              {course.modules.map((module, idx) => (
                <div key={module.id} className="space-y-1">
                  <div className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg">
                    Module {idx + 1}: {module.title}
                  </div>
                  {module.contents.map((content) => (
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
                          activeContent?.id === content.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm"
                        )}>
                          {content.type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <span className={cn("text-sm font-bold truncate max-w-40", activeContent?.id === content.id ? "text-indigo-600" : "text-slate-700")}>
                          {content.title}
                        </span>
                      </div>
                      {activeContent?.id === content.id ? (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">12:45</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-indigo-600 border-none text-white relative overflow-hidden">
            <div className="relative z-10">
              <CheckCircle2 className="w-10 h-10 text-white/20 mb-4" />
              <h4 className="text-xl font-black leading-tight">Obtenez votre certificat</h4>
              <p className="text-indigo-100 text-sm font-medium mt-2 opacity-80">Complétez toutes les leçons et réussissez le quiz final.</p>
              <Button variant="secondary" className="mt-8 w-full bg-white text-indigo-600 hover:bg-indigo-50 h-12 rounded-2xl font-black uppercase text-xs tracking-widest">
                Voir le Quiz
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
