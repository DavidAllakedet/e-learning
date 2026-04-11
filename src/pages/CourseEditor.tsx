import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Layout, 
  Save,
  ArrowLeft,
  Loader2,
  HelpCircle,
  Video,
  ChevronRight,
  Upload
} from 'lucide-react';
import axios from 'axios';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

interface Module {
  id: string;
  title: string;
  contents: { id: string; title: string; type: string }[];
}

interface QuizQuestion {
  text: string;
  options: string[];
  answer: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  status?: 'DRAFT' | 'PUBLISHED';
  modules: Module[];
  quizzes: { id: string; title: string; questions: QuizQuestion[] }[];
}

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'quizzes' | 'assignments'>('content');

  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<'VIDEO' | 'PDF'>('VIDEO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);



  const fetchCourseDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
      if (res.data.modules?.length > 0) setActiveModule(prev => prev ?? res.data.modules[0].id);
    } catch (error) {
      console.error('Erreur lors du chargement du cours', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setCourse(null);
      setActiveModule(null);
      return;
    }

    setLoading(true);
    fetchCourseDetails();
  }, [id, fetchCourseDetails]);

  const handleCreateCourse = async () => {
    console.log('handleCreateCourse called with title:', createTitle);
    if (!createTitle.trim()) {
      alert('Veuillez saisir un titre pour le cours');
      return;
    }
    console.log('Validation passed, starting course creation...');
    setIsCreating(true);
    try {
      console.log('Creating course with:', { title: createTitle, description: createDescription });
      console.log('Making API request to /courses...');
      const res = await api.post('/courses', { title: createTitle, description: createDescription });
      console.log('API request completed. Response status:', res.status);
      console.log('Course created successfully:', res.data);

      if (res.data && res.data.id) {
        console.log('Navigating to edit page:', `/teacher/courses/${res.data.id}/edit`);
        navigate(`/teacher/courses/${res.data.id}/edit`);
      } else {
        console.error('No course ID in response:', res.data);
        alert('Cours créé mais ID manquant dans la réponse');
        setIsCreating(false);
      }
    } catch (error: unknown) {
      console.error('Error creating course:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        const data = error.response?.data;
        const message =
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string'
            ? (data as Record<string, unknown>).message
            : undefined;
        alert(`Erreur lors de la création du cours: ${message || error.message}`);
      } else {
        alert('Erreur lors de la création du cours');
      }
      setIsCreating(false);
    }
  };

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim() || !id) return;
    try {
      await api.post('/courses/module', { title: newModuleTitle, courseId: id });
      setNewModuleTitle('');
      setIsAddingModule(false);
      await fetchCourseDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadContent = async () => {
    if (!selectedFile || !contentTitle || !activeModule || !id) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', contentTitle);
      formData.append('type', contentType);
      formData.append('moduleId', activeModule);
      formData.append('file', selectedFile);
      await api.post('/courses/content', formData);
      setContentTitle('');
      setSelectedFile(null);
      await fetchCourseDetails();
    } catch {
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!id) return;
    try {
      await api.delete(`/courses/content/${contentId}`);
      await fetchCourseDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Supprimer ce quiz ?')) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      setCourse(prev => prev ? { ...prev, quizzes: prev.quizzes.filter(q => q.id !== quizId) } : null);
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!id) {
    // Check if user has permission to create courses
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      console.log('User does not have permission:', user);
      return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-black text-slate-900 mb-4">Accès refusé</h1>
            <p className="text-slate-500">Vous n'avez pas les permissions pour créer un cours.</p>
            <p className="text-xs text-slate-400 mt-2">Rôle actuel: {user?.role || 'Non connecté'}</p>
            <Button onClick={() => navigate('/')} className="mt-6 rounded-2xl">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      );
    }

    console.log('User has permission to create course:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?.id);
    console.log('Current createTitle:', createTitle);
    console.log('Current createDescription:', createDescription);

    // Check if user has valid token
    const token = localStorage.getItem('token');
    if (!token) {
      return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-black text-slate-900 mb-4">Session expirée</h1>
            <p className="text-slate-500">Veuillez vous reconnecter pour créer un cours.</p>
            <Button onClick={() => navigate('/login')} className="mt-6 rounded-2xl">
              Se connecter
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/teacher/courses')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Proposer un nouveau cours</h1>
        <Card className="p-8">
          <div className="space-y-6">
            <Input label="Titre du cours" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="Ex: Apprendre Python" />
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Description</label>
              <textarea value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} className="w-full min-h-[140px] rounded-2xl border border-slate-100 bg-slate-50/50 p-4" />
            </div>
            <div className="flex items-end col-span-2">
              <Button onClick={handleCreateCourse} isLoading={isCreating} disabled={!createTitle.trim()} className="w-full rounded-2xl h-12">
                <Plus className="mr-2 w-4 h-4" />
                Proposer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentModule = course?.modules?.find(m => m.id === activeModule);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/teacher/courses')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
          <div>
            <Badge variant="outline" className="rounded-lg mb-1">{course?.status}</Badge>
            <h1 className="text-3xl font-black text-slate-900">{course?.title}</h1>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl">
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="flex space-x-2">
        <button onClick={() => setActiveTab('content')} className={cn("flex items-center px-6 py-2.5 rounded-xl text-sm font-black", activeTab === 'content' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}>
          <Layout className="w-4 h-4 mr-2" /> Curriculum
        </button>
        <button onClick={() => setActiveTab('quizzes')} className={cn("flex items-center px-6 py-2.5 rounded-xl text-sm font-black", activeTab === 'quizzes' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}>
          <HelpCircle className="w-4 h-4 mr-2" /> Quiz
        </button>
        <button onClick={() => setActiveTab('assignments')} className={cn("flex items-center px-6 py-2.5 rounded-xl text-sm font-black", activeTab === 'assignments' ? "bg-white text-amber-600 shadow-sm" : "text-slate-500")}>
          <FileText className="w-4 h-4 mr-2" /> Devoirs
        </button>
      </div>

      {activeTab === 'content' && course && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 uppercase text-[10px]">Structure du cours</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingModule(true)} className="h-8 w-8 bg-indigo-50 rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {course.modules?.map(m => (
                  <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn("w-full text-left px-4 py-3 rounded-xl font-bold", activeModule === m.id ? "bg-indigo-600 text-white" : "hover:bg-slate-50")}>
                    {m.title}
                  </button>
                ))}
                {isAddingModule && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Titre du module"
                      className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      autoFocus
                    />
                    <button onClick={handleCreateModule} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">
                      OK
                    </button>
                    <button onClick={() => setIsAddingModule(false)} className="px-3 py-2 bg-slate-200 rounded-lg text-sm">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">{currentModule?.title}</h2>
            </div>
            
            <Card className="p-12 border-none shadow-2xl shadow-indigo-100">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 text-center mb-6">Ajouter un contenu à ce module</h3>
              <div className="space-y-6 max-w-xl mx-auto">
                <Input label="Titre du contenu" value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} placeholder="Ex: Chapitre 1 - Introduction" />
                <div className="flex gap-4 justify-center">
                  <button type="button" onClick={() => setContentType('VIDEO')} className={cn("flex items-center px-6 py-3 rounded-2xl font-bold", contentType === 'VIDEO' ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-600")}>
                    <Video className="w-5 h-5 mr-2" /> Vidéo
                  </button>
                  <button type="button" onClick={() => setContentType('PDF')} className={cn("flex items-center px-6 py-3 rounded-2xl font-bold", contentType === 'PDF' ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-600")}>
                    <FileText className="w-5 h-5 mr-2" /> PDF
                  </button>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <input type="file" accept=".mp4,.mov,.webm,.m4v,.pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-slate-500 font-medium mb-2">{selectedFile ? selectedFile.name : "Glissez votre fichier ici ou cliquez pour sélectionner"}</p>
                    <p className="text-xs text-slate-400">MP4, MOV, WEBM, PDF (max 100MB)</p>
                  </label>
                </div>
                <Button onClick={handleUploadContent} isLoading={isUploading} disabled={!contentTitle || !selectedFile} className="w-full h-14 rounded-2xl" size="lg">
                  <Upload className="w-5 h-5 mr-2" /> Uploader le contenu
                </Button>
              </div>
            </Card>

            {currentModule?.contents?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 mb-4">Aucun contenu dans ce module</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentModule?.contents?.map(content => (
                  <div key={content.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                        {content.type === 'VIDEO' ? <Video className="w-6 h-6 text-indigo-600" /> : <FileText className="w-6 h-6 text-indigo-600" />}
                      </div>
                      <div>
                        <h4 className="font-black">{content.title}</h4>
                        <p className="text-xs text-slate-400 uppercase">{content.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => handleDeleteContent(content.id)} className="text-rose-400">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && course && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Évaluations</h2>
              <p className="text-slate-500">Gérez les quiz de ce cours.</p>
            </div>
            <Button onClick={() => navigate('/teacher/quizzes/new')}>
              <Plus className="mr-2 w-5 h-5" /> Nouveau Quiz
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.quizzes?.map(quiz => (
              <Card key={quiz.id} className="p-8 border-none shadow-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-black">{quiz.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">{(quiz.questions || []).length} Questions</p>
                <Button variant="ghost" className="w-full mt-4" onClick={() => navigate(`/teacher/quizzes/${quiz.id}/edit`)}>
                  Modifier <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">Gestion des devoirs</h3>
            <p className="text-slate-500 mb-6">Créez et gérez vos devoirs depuis la page dédiée.</p>
            <Button onClick={() => navigate('/teacher/assignments/new')}>
              <Plus className="w-4 h-4 mr-2" /> Créer un nouveau devoir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;
