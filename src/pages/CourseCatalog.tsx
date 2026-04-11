import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, Clock, User } from 'lucide-react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  teacher: { firstName: string, lastName: string };
  category?: string;
  rating?: number;
  duration?: string;
}

type CoursesResponse =
  | Course[]
  | {
      items: Course[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    };

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      api.get<CoursesResponse>('/courses', { params: { search: searchTerm, page, limit } })
        .then(res => {
          const data = res.data;
          if (Array.isArray(data)) {
            setCourses(data);
            setTotal(data.length);
            setTotalPages(1);
            return;
          }

          setCourses(data.items);
          setTotal(data.meta.total);
          setTotalPages(data.meta.totalPages);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  const filteredCourses = courses;
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const pagesToShow = useMemo(() => {
    const current = page;
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);
    const pages: number[] = [];
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Section / Search */}
      <div className="relative bg-slate-900 rounded-5xl p-12 overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Catalogue
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Découvrez les cours <br />
            disponibles sur la plateforme
          </h1>
          <p className="mt-6 text-slate-400 text-lg font-medium leading-relaxed">
            Recherchez un cours, consultez le contenu et suivez votre progression.
          </p>
          
          <div className="mt-10 relative max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <Input 
              type="text"
              placeholder="Rechercher un cours (React, Node, UI Design...)"
              className="pl-14 h-16 bg-white/10 border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:bg-white focus:text-slate-900 transition-all text-lg border-2"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-indigo-600/20 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filters & Results */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Tous les cours</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">
              {total} cours trouvés
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-2 font-black text-slate-700 h-12">
            <Filter className="mr-2 w-4 h-4" />
            Filtrer par catégorie
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-105 bg-slate-100 rounded-4xl animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-4xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium">Aucun cours trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="p-0 group border-none shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 rounded-4xl overflow-hidden flex flex-col">
                {/* Course Image / Header */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
                    <Badge variant="primary" className="bg-white/20 backdrop-blur-md text-white border-white/20 rounded-lg px-3 py-1 font-bold text-[10px] uppercase">
                      {course.category || 'DÉVELOPPEMENT'}
                    </Badge>
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white text-[10px] font-black">{course.rating || '4.9'}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-indigo-600/10 backdrop-blur-[2px]">
                    <Button 
                      className="rounded-full w-14 h-14 p-0 bg-white shadow-xl hover:scale-110 transition-transform"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </Button>
                  </div>
                </div>

                {/* Course Content */}
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {course.teacher.firstName} {course.teacher.lastName}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold">{course.duration || '12h'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold">24 modules</span>
                      </div>
                    </div>
                    <div className="text-xl font-black text-indigo-600">
                      {course.price === 0 ? 'Gratuit' : `${course.price.toLocaleString('fr-FR')} FCFA`}
                    </div>
                  </div>

                  <Button 
                    className="mt-8 w-full rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    Voir le cours
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              className="rounded-xl border-2"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>

            <div className="flex items-center gap-2">
              {pagesToShow[0] !== 1 && (
                <>
                  <Button variant="outline" className="rounded-xl border-2 w-12" onClick={() => setPage(1)}>
                    1
                  </Button>
                  <span className="text-slate-400 font-black">…</span>
                </>
              )}

              {pagesToShow.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'primary' : 'outline'}
                  className={p === page ? "rounded-xl w-12" : "rounded-xl border-2 w-12"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}

              {pagesToShow[pagesToShow.length - 1] !== totalPages && (
                <>
                  <span className="text-slate-400 font-black">…</span>
                  <Button variant="outline" className="rounded-xl border-2 w-12" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              className="rounded-xl border-2"
              disabled={!canNext}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
