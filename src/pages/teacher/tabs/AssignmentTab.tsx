import { Plus, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface AssignmentTabProps {
  navigate: any;
}

const AssignmentTab = ({ navigate }: AssignmentTabProps) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-900 mb-2">Gestion des devoirs</h3>
        <p className="text-slate-500 mb-6">Créez et gérez vos devoirs depuis la page dédiée.</p>
        <Button onClick={() => navigate('/teacher/assignments/new')} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Créer un nouveau devoir
        </Button>
      </div>
    </div>
  );
};

export default AssignmentTab;