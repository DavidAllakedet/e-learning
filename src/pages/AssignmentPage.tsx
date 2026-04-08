import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/ui/FileUpload';
import { 
  Clock, 
  AlertCircle,
  CheckCircle2,
  FileIcon,
  MessageSquare,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  courseTitle?: string;
  grade?: {
    value: number;
    feedback: string;
  };
  submission?: {
    id: string;
    fileUrl: string;
    submittedAt: string;
  };
}

interface User {
  id: string;
  role: string;
}

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignment = useCallback(async () => {
    try {
      const res = await api.get(`/assignments/${id}`);
      setAssignment(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement du devoir', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleSubmit = async () => {
    if (!file || !assignment) return;
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('assignmentId', assignment.id);
    formData.append('file', file);

    try {
      await api.post('/assignments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchAssignment();
    } catch (error) {
      console.error('Erreur lors de la soumission', error);
      alert('Erreur lors de l\'envoi du devoir.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (!assignment) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-black text-slate-900">Devoir introuvable</h3>
      <Button onClick={() => navigate(-1)} variant="outline" className="mt-4 rounded-xl">Retour</Button>
    </div>
  );

  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="rounded-lg">{assignment.courseTitle}</Badge>
            <Badge 
              variant={assignment.status === 'pending' ? 'warning' : assignment.status === 'graded' ? 'success' : 'primary'} 
              className="rounded-lg"
            >
              {assignment.status === 'pending' ? 'À rendre' : assignment.status === 'graded' ? 'Noté' : 'Soumis'}
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{assignment.title}</h1>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Clock className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Date limite</p>
            <p className="text-sm font-bold text-slate-700 mt-1">
              {new Date(assignment.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed font-medium">
                {assignment.description}
              </p>
              
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4">
                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600 font-medium leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">Règles de soumission :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Format PDF uniquement</li>
                    <li>Taille maximum : 10 Mo</li>
                    <li>Une seule soumission autorisée</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {assignment.submission && (
            <Card className={cn(
              "border-none shadow-xl",
              assignment.status === 'graded' ? "bg-emerald-50/30" : "bg-indigo-50/30"
            )}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      assignment.status === 'graded' ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                    )}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Travail soumis</h3>
                      <p className="text-sm font-medium text-slate-500">
                        Le {new Date(assignment.submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {assignment.status === 'graded' && (
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Note</p>
                      <p className="text-3xl font-black text-emerald-600">{assignment.grade?.value}<span className="text-sm text-slate-400 ml-1">/20</span></p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">
                      {assignment.submission.fileUrl.split('/').pop()}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-600 font-black text-xs uppercase"
                    onClick={() => window.open(`http://localhost:5000${assignment.submission?.fileUrl}`, '_blank')}
                  >
                    Voir le fichier
                  </Button>
                </div>

                {assignment.grade?.feedback && (
                  <div className="mt-6 p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-2" />
                      Feedback de l'enseignant
                    </p>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                      "{assignment.grade.feedback}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          {assignment.status === 'pending' && !isTeacher && (
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Votre Soumission</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <FileUpload 
                  onFileSelect={(file) => setFile(file)}
                  accept=".pdf"
                  label=""
                  helperText="Format PDF uniquement (max 10MB)"
                />
                <Button 
                  className="w-full rounded-2xl h-12" 
                  disabled={!file} 
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Envoyer le devoir
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="p-6 bg-slate-900 text-white border-none">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-black">Commentaires</h3>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Aucun commentaire pour le moment.
            </p>
            <div className="mt-6 flex space-x-2">
              <input 
                placeholder="Écrire un message..." 
                className="flex-1 bg-white/10 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
              <Button size="icon" className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
