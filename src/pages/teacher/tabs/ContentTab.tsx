import { Layout, FileText, Trash2, Video } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

type CourseContent = {
  id: string;
  title: string;
  type: string;
};

type CourseModule = {
  id: string;
  title: string;
  contents: CourseContent[];
};

type Course = {
  modules: CourseModule[];
};

interface ContentTabProps {
  course: Course;
  activeModule: string | null;
  setActiveModule: (id: string) => void;
  handleDeleteContent: (contentId: string, moduleId: string) => void;
}

const ContentTab = ({
  course,
  activeModule,
  setActiveModule,
  handleDeleteContent
}: ContentTabProps) => {

  if (!course.modules?.length) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
        <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center text-slate-200">
          <Layout className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Structure vide</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">Sélectionnez un module existant à gauche ou créez le premier module de votre cours.</p>
        </div>
      </div>
    );
  }

  if (!activeModule) return null;

  const currentModule = course.modules.find((m) => m.id === activeModule);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="space-y-4">
        <div className="p-4 border-none shadow-xl shadow-slate-200/40 bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Structure du cours</h3>
          </div>
          <div className="space-y-2">
            {course.modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeModule === m.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">{currentModule?.title}</h2>
        </div>

          {!currentModule?.contents?.length ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 mb-4">Aucun contenu dans ce module</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentModule.contents.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    {content.type === 'VIDEO' ? <Video className="w-6 h-6 text-indigo-600" /> : <FileText className="w-6 h-6 text-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{content.title}</h4>
                    <p className="text-xs text-slate-400 uppercase">{content.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(content.id, activeModule)} className="text-rose-400 hover:text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTab;
