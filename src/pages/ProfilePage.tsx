import { useEffect, useRef, useState } from 'react';
import { User as UserIcon, Mail, Shield, Camera, Bell, Lock, Globe, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Loader2, BookOpen, Eye, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string | null;
  university?: string | null;
  className?: string | null;
  interests?: string | null;
  institution?: string | null;
  specialty?: string | null;
  bio?: string | null;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
};

type TeacherCourseRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED';
  _count?: { enrollments: number; modules?: number };
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [className, setClassName] = useState('');
  const [interests, setInterests] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourseRow[]>([]);
  const [teacherCoursesLoading, setTeacherCoursesLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setUniversity(res.data.university || '');
        setClassName(res.data.className || '');
        setInterests(res.data.interests || '');
        setInstitution(res.data.institution || '');
        setSpecialty(res.data.specialty || '');
        setBio(res.data.bio || '');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'TEACHER') return;
    setTeacherCoursesLoading(true);
    api.get('/courses/teacher/my')
      .then(res => setTeacherCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setTeacherCoursesLoading(false));
  }, [user]);

  if (!user) return null;
  if (loading || !profile) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profil Public', icon: UserIcon },
    ...(user.role === 'TEACHER' ? [{ id: 'courses', label: 'Cours proposés', icon: BookOpen }] : []),
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload: {
        firstName: string;
        lastName: string;
        university?: string;
        className?: string;
        interests?: string;
        institution?: string;
        specialty?: string;
        bio?: string;
      } = {
        firstName,
        lastName,
        university: user.role === 'STUDENT' ? university : undefined,
        className: user.role === 'STUDENT' ? className : undefined,
        interests: user.role === 'STUDENT' ? interests : undefined,
        institution: user.role === 'TEACHER' ? institution : undefined,
        specialty: user.role === 'TEACHER' ? specialty : undefined,
        bio: user.role === 'TEACHER' ? bio : undefined,
      };
      const res = await api.put('/users/profile', payload);
      setProfile(prev => prev ? { ...prev, ...payload } : prev);
      updateUser({ ...user, firstName: res.data.user.firstName, lastName: res.data.user.lastName, avatar: res.data.user.avatar });
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return;
    setIsSaving(true);
    try {
      await api.put('/users/profile', { password: newPassword });
      setNewPassword('');
      alert('Mot de passe mis à jour');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = async (file: File | null) => {
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => prev ? { ...prev, avatar: res.data.user.avatar } : prev);
      updateUser({ ...user, avatar: res.data.user.avatar });
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'upload de l\'avatar');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setNotifLoading(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header with Background */}
      <div className="relative h-48 bg-indigo-600 rounded-5xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-indigo-500" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top" />
        
        {/* User Quick Info */}
        <div className="absolute -bottom-16 left-12 flex items-end space-x-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-5xl bg-white p-1.5 shadow-2xl shadow-indigo-200">
              {profile.avatar ? (
                <img
                  src={`${import.meta.env.VITE_UPLOADS_URL}${profile.avatar}`}
                  className="w-full h-full rounded-4xl object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-4xl bg-slate-100 flex items-center justify-center font-black text-slate-300 text-4xl group-hover:bg-slate-200 transition-colors">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handlePickAvatar}
              className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-60"
              disabled={isUploadingAvatar}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleAvatarSelected(e.target.files?.[0] || null)}
            />
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-3 py-1 font-bold text-xs">
                {user.role === 'STUDENT' ? 'Étudiant' : user.role === 'TEACHER' ? 'Enseignant' : 'Administrateur'}
              </Badge>
              <span className="text-indigo-100/80 text-sm font-bold flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Paris, France
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <Card className="p-4 border-none shadow-xl shadow-slate-200/40">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 font-bold text-sm ${
                    activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === tab.id ? 'block' : 'hidden md:block'}`} />
                </button>
              ))}
            </nav>
          </Card>

          <Card className="p-8 bg-slate-900 border-none text-white relative overflow-hidden">
            <div className="relative z-10">
              <Shield className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-black">Besoin d'aide ?</h4>
              <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">Notre équipe support est disponible 24/7 pour vous accompagner.</p>
              <Button variant="outline" className="mt-6 w-full border-white/10 text-white hover:bg-white/5 h-10 text-xs">
                Contacter le support
              </Button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <CardTitle className="text-2xl font-black text-slate-900">Informations Personnelles</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Mettez à jour vos informations publiques et privées.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Prénom" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-xl bg-slate-50 border-none"
                    />
                    <Input 
                      label="Nom" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-xl bg-slate-50 border-none"
                    />
                    <Input 
                      label="Email professionnel" 
                      value={user.email}
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                      className="rounded-xl bg-slate-50 border-none opacity-80"
                    />
                  </div>

                  {user.role === 'STUDENT' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input
                        label="Université"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="rounded-xl bg-slate-50 border-none"
                      />
                      <Input
                        label="Classe"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="rounded-xl bg-slate-50 border-none"
                      />
                      <Input
                        label="Domaines d'intérêt"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="rounded-xl bg-slate-50 border-none md:col-span-2"
                      />
                    </div>
                  ) : user.role === 'TEACHER' ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                          label="Établissement"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="rounded-xl bg-slate-50 border-none"
                        />
                        <Input
                          label="Spécialité"
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="rounded-xl bg-slate-50 border-none"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full min-h-37.5 p-5 rounded-4xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 font-medium transition-all"
                          placeholder="Décrivez votre expérience..."
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-4 flex justify-end space-x-4">
                    <Button type="button" variant="ghost" className="rounded-xl font-black text-slate-500" onClick={() => {
                      setFirstName(profile.firstName || '');
                      setLastName(profile.lastName || '');
                      setUniversity(profile.university || '');
                      setClassName(profile.className || '');
                      setInterests(profile.interests || '');
                      setInstitution(profile.institution || '');
                      setSpecialty(profile.specialty || '');
                      setBio(profile.bio || '');
                    }}>Annuler</Button>
                    <Button type="submit" className="rounded-xl px-10 h-12 shadow-lg shadow-indigo-100" isLoading={isSaving}>
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <CardTitle className="text-2xl font-black text-slate-900">Mot de passe & Sécurité</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Gérez votre mot de passe et vos paramètres de sécurité.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <form className="space-y-6 max-w-md" onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
                  <Input 
                    label="Nouveau mot de passe" 
                    type="password"
                    className="rounded-xl bg-slate-50 border-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button type="submit" className="w-full rounded-xl h-12 shadow-lg shadow-indigo-100" isLoading={isSaving}>
                    Mettre à jour le mot de passe
                  </Button>
                </form>

                <div className="pt-10 border-t border-slate-50">
                  <h4 className="text-lg font-black text-slate-900 mb-6">Double Authentification (2FA)</h4>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Lock className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Activer la 2FA</p>
                        <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl bg-white border-2 text-indigo-600 font-black h-10 px-6">Activer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-0 border-none shadow-xl shadow-slate-200/40 overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <CardTitle className="text-2xl font-black text-slate-900">Notifications</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Historique des alertes et événements (devoirs, notes, contenus).</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" className="rounded-xl border-2" onClick={fetchNotifications}>
                    Rafraîchir
                  </Button>
                  <Badge variant="outline" className="rounded-lg">
                    {notifications.filter(n => !n.read).length} non lue(s)
                  </Badge>
                </div>

                {notifLoading ? (
                  <div className="h-40 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center space-y-3 text-center">
                    <Bell className="w-10 h-10 text-slate-200" />
                    <p className="text-slate-500 font-medium">Aucune notification.</p>
                    <Button variant="ghost" className="text-indigo-600 font-black" onClick={fetchNotifications}>
                      Charger
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 rounded-3xl border border-slate-100 overflow-hidden bg-white">
                    {notifications.map(n => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => !n.read && markNotificationRead(n.id)}
                        className={cn(
                          'w-full text-left p-5 hover:bg-slate-50 transition-colors flex items-start space-x-4',
                          !n.read && 'bg-indigo-50/30'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                          n.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' :
                          n.type === 'WARNING' ? 'bg-amber-50 text-amber-500' :
                          n.type === 'ERROR' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
                        )}>
                          {n.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-black text-slate-900 truncate">{n.title}</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600 font-medium mt-1 line-clamp-2">{n.message}</p>
                          {!n.read && <p className="mt-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Nouvelle</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'courses' && user.role === 'TEACHER' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Cours proposés</h2>
                  <p className="text-slate-500 font-medium">Aperçu de vos cours et accès rapide à l’éditeur.</p>
                </div>
                <Button className="rounded-2xl h-12 px-6" onClick={() => navigate('/teacher/courses/new')}>
                  Proposer un cours
                </Button>
              </div>

              {teacherCoursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-105 bg-slate-100 rounded-4xl animate-pulse" />
                  ))}
                </div>
              ) : teacherCourses.length === 0 ? (
                <Card className="p-10 border-none shadow-xl shadow-slate-200/40 text-center">
                  <p className="text-slate-500 font-medium">Vous n’avez pas encore proposé de cours.</p>
                  <Button className="mt-6 rounded-2xl h-12 px-8" onClick={() => navigate('/teacher/courses/new')}>
                    Proposer un cours
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teacherCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="p-0 group border-none shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 rounded-4xl overflow-hidden flex flex-col"
                    >
                      <div className="relative h-52 bg-slate-100 overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
                          <Badge
                            variant="primary"
                            className="bg-white/20 backdrop-blur-md text-white border-white/20 rounded-lg px-3 py-1 font-bold text-[10px] uppercase"
                          >
                            DÉVELOPPEMENT
                          </Badge>
                          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-white text-[10px] font-black">4.9</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-indigo-600/10 backdrop-blur-[2px]">
                          <Button 
                            className="rounded-full w-14 h-14 p-0 bg-white shadow-xl hover:scale-110 transition-transform"
                            onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                          >
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-slate-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                          {course.title}
                        </h3>
                        <p className="mt-3 text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1.5 text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-bold">—</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-400">
                              <BookOpen className="w-4 h-4" />
                              <span className="text-xs font-bold">{course._count?.modules || 0} modules</span>
                            </div>
                          </div>
                          <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'warning'} className="rounded-lg">
                            {course.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </div>

                        <Button 
                          className="mt-8 w-full rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all"
                          onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                        >
                          Voir le cours
                          <Eye className="ml-2 w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
