import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  courseTitle?: string;
  grade?: string;
  feedback?: string;
}

interface User {
  id: string;
  role: string;
}

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [assignment, setAssignment] = useState<Assignment | null>(() => ({
    id: id || '',
    title: "Architecture Clean Code en Node.js",
    description: "Implémentez une API REST suivant les principes de la Clean Architecture. Votre projet doit inclure des couches séparées pour les entités, les cas d'utilisation et les adaptateurs.",
    dueDate: "2024-04-15",
    courseTitle: "Node.js Expert",
    status: 'pending'
  }));

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!file || !assignment) return;
    setIsSubmitting(true);
    // Simulation d'upload
    setTimeout(() => {
      setAssignment({ ...assignment, status: 'submitted' });
      setIsSubmitting(false);
    }, 1500);
  };

  if (!assignment) return null;

  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="rounded-lg">{assignment.courseTitle}</Badge>
            <Badge variant={assignment.status === 'pending' ? 'warning' : 'success'} className="rounded-lg">
              {assignment.status === 'pending' ? 'À rendre' : 'Soumis'}
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{assignment.title}</h1>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Clock className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Date limite</p>
            <p className="text-sm font-bold text-slate-700 mt-1">15 Avril 2026, 23:59</p>
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
                    <li>Un seul essai autorisé</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {assignment.status === 'submitted' && (
            <Card className="border-emerald-100 bg-emerald-50/30">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Travail bien reçu !</h3>
                    <p className="text-sm font-medium text-slate-500">Soumis le {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">architecture_v1.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600">Voir le fichier</Button>
                </div>
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
