import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Clock, Upload } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';

const TeacherAssignmentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const isNew = !id;

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        try {
          const coursesRes = await api.get('/courses/teacher/my');
          setCourses(coursesRes.data);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        return;
      }
      try {
        const res = await api.get(`/assignments/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
        setDueDate(res.data.dueDate ? res.data.dueDate.slice(0, 16) : '');
        setSelectedCourseId(res.data.courseId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        if (!selectedCourseId) {
          alert('Veuillez sélectionner un cours');
          setSaving(false);
          return;
        }
        // Create assignment first with file if uploaded
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dueDate', dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
        formData.append('courseId', selectedCourseId);
        if (file) {
          formData.append('file', file);
        }
        await api.post('/assignments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.put(`/assignments/${id}`, {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
        });
      }
      navigate('/teacher/assignments');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/assignments')} className="rounded-xl bg-white shadow-sm border border-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <Badge variant="primary" className="bg-amber-50 text-amber-600 border-amber-100 text-[10px] uppercase font-black rounded-lg">Éditeur Devoir</Badge>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              {isNew ? 'Nouveau Devoir' : title}
            </h1>
          </div>
        </div>
        <Button className="rounded-2xl h-12 px-8 shadow-lg shadow-amber-100 font-black uppercase tracking-widest text-xs" isLoading={saving} onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      {isNew && (
        <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
          <CardHeader className="p-0 mb-6">
            <CardTitle>Sélectionner un cours</CardTitle>
            <CardDescription>Choisissez le cours pour ce devoir.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="">Sélectionner un cours</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      <Card className="p-8 border-none shadow-xl shadow-slate-200/40">
        <CardHeader className="p-0 mb-6">
          <CardTitle>Informations du devoir</CardTitle>
          <CardDescription>Détails du travail à effectuer.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          <Input
            label="Titre du devoir"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: TP Python - Boucles et conditions"
          />
          
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Description / Instructions</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le travail à faire par les étudiants..."
              className="min-h-[150px]"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Date limite
            </label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Fichier du devoir (PDF)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="hidden" 
                id="assignment-file" 
              />
              <label htmlFor="assignment-file" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-6 h-6 text-amber-600" />
                    <span className="font-bold text-slate-700">{file.name}</span>
                    <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-rose-500 text-sm">Supprimer</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-slate-500 font-medium">Cliquez pour uploader un PDF</p>
                    <p className="text-xs text-slate-400 mt-1">ou glissez le fichier ici</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignmentEditor;
