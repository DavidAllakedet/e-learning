import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Video, 
  FileText, 
  Trash2, 
  Layout, 
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Settings as SettingsIcon,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { Badge } from '../components/ui/Badge';
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

interface Question {
  id?: string;
  text: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  status?: 'DRAFT' | 'PUBLISHED';
  modules: Module[];
  quizzes: Quiz[];
}

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'quizzes'>('content');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createPrice, setCreatePrice] = useState('0');
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Content Tab State
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<'VIDEO' | 'PDF'>('VIDEO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Quiz Tab State
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<Question[]>([
    { text: '', options: ['', '', '', ''], answer: '' }
  ]);

  const fetchCourseDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
      if (res.data.modules.length > 0 && !activeModule) {
        setActiveModule(res.data.modules[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cours', error);
    } finally {
      setLoading(false);
    }
  }, [id, activeModule]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchCourseDetails();
  }, [fetchCourseDetails, id]);

  const handleCreateCourse = async () => {
    if (!createTitle.trim() || !createDescription.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post('/courses', {
        title: createTitle,
        description: createDescription,
        price: createPrice,
      });
      navigate(`/teacher/courses/${res.data.id}/edit`);
    } catch (error) {
      console.error('Erreur lors de la création du cours', error);
      alert('Erreur lors de la création du cours');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!course || !id) return;
    setIsPublishing(true);
    try {
      const nextStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await api.patch(`/courses/${id}`, { status: nextStatus });
      setCourse(prev => prev ? { ...prev, status: res.data.status } : prev);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      const res = await api.post('/courses/module', { title: newModuleTitle, courseId: id });
      setCourse(prev => prev ? { ...prev, modules: [...prev.modules, { ...res.data, contents: [] }] } : null);
      setNewModuleTitle('');
      setIsAddingModule(false);
      setActiveModule(res.data.id);
    } catch {
      alert('Erreur lors de l\'ajout du module');
    }
  };

  const handleAddContent = async () => {
    if (!contentTitle.trim() || !selectedFile || !activeModule) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', contentTitle);
    formData.append('type', contentType);
    formData.append('moduleId', activeModule);
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/courses/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules.map(m => 
            m.id === activeModule 
              ? { ...m, contents: [...m.contents, res.data] }
              : m
          )
        };
      });
      
      setContentTitle('');
      setSelectedFile(null);
    } catch {
      alert('Erreur lors de l\'upload du contenu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuizTitle.trim()) return;
    try {
      const res = await api.post('/quizzes', { 
        title: newQuizTitle, 
        courseId: id,
        questions: currentQuizQuestions 
      });
      setCourse(prev => prev ? { ...prev, quizzes: [...prev.quizzes, res.data] } : null);
      setNewQuizTitle('');
      setCurrentQuizQuestions([{ text: '', options: ['', '', '', ''], answer: '' }]);
      setIsAddingQuiz(false);
    } catch {
      alert('Erreur lors de la création du quiz');
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
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/dashboard')} className="rounded-xl bg-white shadow-sm border border-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] uppercase font-black">Création de cours</Badge>
              <span className="text-slate-300 font-bold">•</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étape 1</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Nouveau cours</h1>
          </div>
        </div>

        <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Titre</label>
              <Input
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="Ex: React Avancé"
                className="rounded-xl border-slate-100 bg-slate-50/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Description</label>
              <textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Décrivez la promesse, les objectifs, le public cible..."
                className="w-full min-h-[140px] rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Prix (€)</label>
                <Input
                  value={createPrice}
                  onChange={(e) => setCreatePrice(e.target.value)}
                  placeholder="0"
                  className="rounded-xl border-slate-100 bg-slate-50/50"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleCreateCourse}
                  isLoading={isCreating}
                  className="w-full rounded-2xl h-12 px-8 shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-xs"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Créer
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!course) return <div>Cours non trouvé</div>;

  const currentModule = course.modules.find(m => m.id === activeModule);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/dashboard')} className="rounded-xl bg-white shadow-sm border border-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="primary" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] uppercase font-black">Éditeur Expert</Badge>
              <span className="text-slate-300 font-bold">•</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.modules.length} Modules</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{course.title}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 font-black text-slate-600 bg-white">
            <SettingsIcon className="mr-2 w-4 h-4" />
            Paramètres
          </Button>
          <Button
            className="rounded-2xl h-12 px-8 shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-xs"
            onClick={handlePublishToggle}
            isLoading={isPublishing}
          >
            <Save className="mr-2 w-4 h-4" />
            {course.status === 'PUBLISHED' ? 'Dépublier' : 'Publier'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/50">
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'content' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Layout className="w-4 h-4 mr-2" />
          Curriculum
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'quizzes' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Quiz & Évaluations
        </button>
      </div>

      {activeTab === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Modules List */}
          <div className="space-y-4">
            <Card className="p-4 border-none shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Structure du cours</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingModule(true)} className="h-8 w-8 text-indigo-600 bg-indigo-50 rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 font-bold text-sm",
                      activeModule === module.id 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center">
                      <Layout className={cn("w-4 h-4 mr-3", activeModule === module.id ? "text-white" : "text-slate-400")} />
                      <span className="truncate max-w-35">{module.title}</span>
                    </div>
                    <Badge className={cn("text-[10px]", activeModule === module.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
                      {module.contents.length}
                    </Badge>
                  </button>
                ))}

                {isAddingModule && (
                  <div className="p-2 space-y-2 animate-in slide-in-from-top-2">
                    <Input 
                      placeholder="Titre du module..." 
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      autoFocus
                      className="h-10 text-sm"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 rounded-xl h-9 text-xs font-black" onClick={handleAddModule}>Ajouter</Button>
                      <Button size="sm" variant="ghost" className="rounded-xl h-9 text-xs font-black" onClick={() => setIsAddingModule(false)}>Annuler</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Area: Content of Selected Module */}
          <div className="lg:col-span-3 space-y-8">
            {currentModule ? (
              <>
                <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{currentModule.title}</h2>
                      <p className="text-slate-500 font-medium">Gérez les leçons de ce module.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer le module
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentModule.contents.length === 0 ? (
                      <div className="py-16 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <MessageSquare className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold">Aucune leçon dans ce module.</p>
                        <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest mt-1">Commencez par ajouter du contenu ci-dessous</p>
                      </div>
                    ) : (
                      currentModule.contents.map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-all bg-white hover:shadow-lg hover:shadow-indigo-50/50 group">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                              {content.type === 'VIDEO' ? <Video className="w-6 h-6 text-indigo-600" /> : <FileText className="w-6 h-6 text-indigo-600" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{content.title}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{content.type} • Ressource active</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl">
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Add Content Section */}
                <Card className="p-10 border-none shadow-xl shadow-slate-200/40 bg-white">
                  <CardHeader className="p-0 mb-10">
                    <CardTitle className="text-xl font-black">Ajouter une nouvelle leçon</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Uploadez une vidéo HD ou un document de référence.</CardDescription>
                  </CardHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <Input 
                        label="Titre de la leçon" 
                        placeholder="Ex: Architecture de l'application"
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        className="rounded-xl border-slate-100 bg-slate-50/50"
                      />
                      
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Type de média</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setContentType('VIDEO')}
                            className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest",
                              contentType === 'VIDEO' ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100" : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                            )}
                          >
                            <Video className="w-5 h-5" />
                            <span>Vidéo MP4</span>
                          </button>
                          <button
                            onClick={() => setContentType('PDF')}
                            className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest",
                              contentType === 'PDF' ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100" : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                            )}
                          >
                            <FileText className="w-5 h-5" />
                            <span>Document PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <FileUpload 
                        onFileSelect={(file) => setSelectedFile(file)}
                        accept={contentType === 'VIDEO' ? '.mp4' : '.pdf'}
                        helperText={contentType === 'VIDEO' ? 'Format MP4 recommandé (max 100MB)' : 'Format PDF uniquement (max 10MB)'}
                      />
                      
                      <Button 
                        className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                        disabled={!selectedFile || !contentTitle.trim()}
                        isLoading={isUploading}
                        onClick={handleAddContent}
                      >
                        {isUploading ? 'Finalisation de l\'upload...' : 'Valider et ajouter'}
                        {!isUploading && <CheckCircle2 className="ml-2 w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center text-slate-200">
                  <Layout className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Structure vide</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">Sélectionnez un module existant à gauche ou créez le premier module de votre cours.</p>
                </div>
                <Button onClick={() => setIsAddingModule(true)} className="rounded-xl px-8 h-12 font-black">
                  <Plus className="w-5 h-5 mr-2" />
                  Nouveau Module
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Tab */
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
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Questions</label>
                    <Badge variant="outline" className="font-black">{currentQuizQuestions.length} Questions</Badge>
                  </div>

                  {currentQuizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-6 relative group">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                        onClick={() => setCurrentQuizQuestions(prev => prev.filter((_, i) => i !== qIdx))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <Input 
                        placeholder="Intitulé de la question..." 
                        value={q.text}
                        onChange={(e) => {
                          const newQs = [...currentQuizQuestions];
                          newQs[qIdx].text = e.target.value;
                          setCurrentQuizQuestions(newQs);
                        }}
                        className="bg-white border-none font-bold"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="relative">
                            <Input 
                              placeholder={`Option ${oIdx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const newQs = [...currentQuizQuestions];
                                newQs[qIdx].options[oIdx] = e.target.value;
                                setCurrentQuizQuestions(newQs);
                              }}
                              className={cn(
                                "pl-12 bg-white border-none text-sm",
                                q.answer === opt && opt !== '' && "ring-2 ring-emerald-500"
                              )}
                            />
                            <button
                              onClick={() => {
                                const newQs = [...currentQuizQuestions];
                                newQs[qIdx].answer = opt;
                                setCurrentQuizQuestions(newQs);
                              }}
                              className={cn(
                                "absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                q.answer === opt && opt !== '' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                              )}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 font-black text-xs uppercase tracking-widest"
                    onClick={() => setCurrentQuizQuestions([...currentQuizQuestions, { text: '', options: ['', '', '', ''], answer: '' }])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une question
                  </Button>
                </div>

                <div className="pt-10 border-t border-slate-100 flex justify-end">
                  <Button 
                    className="rounded-2xl px-12 h-14 shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-xs"
                    disabled={!newQuizTitle.trim() || currentQuizQuestions.some(q => !q.text || !q.answer)}
                    onClick={handleAddQuiz}
                  >
                    Créer le Quiz
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {course.quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-8 border-none shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-50 transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)} className="text-slate-300 hover:text-rose-500 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{quiz.questions.length} Questions</p>
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <Button variant="ghost" className="w-full rounded-xl font-black text-indigo-600 hover:bg-indigo-50 group-hover:translate-x-1 transition-all flex items-center justify-center">
                      Modifier les questions
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
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
      )}
    </div>
  );
};

export default CourseEditor;
