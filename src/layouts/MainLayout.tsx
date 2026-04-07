import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  Search,
  User as UserIcon,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

interface User {
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group font-bold',
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    )}
  >
    <Icon className={cn('w-5 h-5', active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600')} />
    <span>{label}</span>
  </Link>
);

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: user?.role === 'TEACHER' ? 'Mes Cours' : 'Apprentissage' },
    { to: '/catalog', icon: GraduationCap, label: 'Catalogue' },
    { to: '/progress', icon: TrendingUp, label: 'Progression' },
    { to: '/settings', icon: Settings, label: 'Profil' },
  ];

  const adminItems = user?.role === 'ADMIN' ? [
    { to: '/admin/enrollments', icon: ShieldCheck, label: 'Inscriptions' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static',
          !isSidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center space-x-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">E-LEARN</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarLink 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
              />
            ))}
            
            {adminItems.length > 0 && (
              <div className="pt-8 pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Administration</p>
                {adminItems.map((item) => (
                  <SidebarLink 
                    key={item.to}
                    {...item}
                    active={location.pathname === item.to}
                  />
                ))}
              </div>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-50">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group font-bold"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-4 text-slate-500 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher un cours, un enseignant..." 
                className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-px bg-slate-100 mx-2"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-indigo-500/20 transition-all">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-indigo-500" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}
    </div>
  );
};

export default MainLayout;
