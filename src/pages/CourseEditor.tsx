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
  CheckCircle2
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

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);
  
  // Content Form State
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<'VIDEO' | 'PDF'>('VIDEO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
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
    fetchCourseDetails();
  }, [fetchCourseDetails]);

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

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!course) return <div>Cours non trouvé</div>;

  const currentModule = course.modules.find(m => m.id === activeModule);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Éditeur de Cours</h1>
            <p className="text-slate-500 font-medium">{course.title}</p>
          </div>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-indigo-100">
          <Save className="mr-2 w-5 h-5" />
          Publier les modifications
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Modules List */}
        <div className="space-y-4">
          <Card className="p-4 border-none shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Modules</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddingModule(true)} className="h-8 w-8 text-indigo-600">
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
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 rounded-xl" onClick={handleAddModule}>Ajouter</Button>
                    <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => setIsAddingModule(false)}>Annuler</Button>
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
                    <p className="text-slate-500 font-medium">Gérez les vidéos et documents de ce module.</p>
                  </div>
                  <Badge variant="primary" className="rounded-lg h-8 px-3">
                    {currentModule.contents.length} éléments
                  </Badge>
                </div>

                <div className="space-y-4">
                  {currentModule.contents.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold italic">Aucun contenu dans ce module.</p>
                    </div>
                  ) : (
                    currentModule.contents.map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            {content.type === 'VIDEO' ? <Video className="w-6 h-6 text-indigo-600" /> : <FileText className="w-6 h-6 text-indigo-600" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{content.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{content.type} • {content.url.split('/').pop()}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Add Content Section */}
              <Card className="p-8 border-none shadow-xl shadow-slate-200/40 bg-white">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xl">Ajouter du contenu</CardTitle>
                  <CardDescription>Uploadez une nouvelle vidéo ou un document PDF.</CardDescription>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Input 
                      label="Titre du contenu" 
                      placeholder="Ex: Introduction au React"
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                    />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Type de média</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setContentType('VIDEO')}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex items-center justify-center space-x-2 font-bold",
                            contentType === 'VIDEO' ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100" : "border-slate-100 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <Video className="w-5 h-5" />
                          <span>Vidéo</span>
                        </button>
                        <button
                          onClick={() => setContentType('PDF')}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex items-center justify-center space-x-2 font-bold",
                            contentType === 'PDF' ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100" : "border-slate-100 text-slate-400 hover:border-slate-200"
                          )}
                        >
                          <FileText className="w-5 h-5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FileUpload 
                      onFileSelect={(file) => setSelectedFile(file)}
                      accept={contentType === 'VIDEO' ? '.mp4' : '.pdf'}
                      helperText={contentType === 'VIDEO' ? 'MP4 uniquement (max 100MB)' : 'PDF uniquement (max 10MB)'}
                    />
                    
                    <Button 
                      className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                      disabled={!selectedFile || !contentTitle.trim()}
                      isLoading={isUploading}
                      onClick={handleAddContent}
                    >
                      {isUploading ? 'Upload en cours...' : 'Ajouter au module'}
                      {!isUploading && <CheckCircle2 className="ml-2 w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-4xl flex items-center justify-center text-slate-300">
                <Layout className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Aucun module sélectionné</h3>
                <p className="text-slate-500 font-medium">Sélectionnez un module à gauche ou créez-en un nouveau.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
