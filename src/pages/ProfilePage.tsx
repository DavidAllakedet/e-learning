import { useState } from 'react';
import { User as UserIcon, Mail, Shield, Camera, Bell, Lock, Globe, CreditCard, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

const ProfilePage = () => {
  const [user] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profil Public', icon: UserIcon },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
  ];

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
              <div className="w-full h-full rounded-4xl bg-slate-100 flex items-center justify-center font-black text-slate-300 text-4xl group-hover:bg-slate-200 transition-colors">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
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
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Prénom" 
                      defaultValue={user.firstName}
                      className="rounded-xl bg-slate-50 border-none"
                    />
                    <Input 
                      label="Nom" 
                      defaultValue={user.lastName}
                      className="rounded-xl bg-slate-50 border-none"
                    />
                    <Input 
                      label="Email professionnel" 
                      defaultValue={user.email}
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                      className="rounded-xl bg-slate-50 border-none"
                    />
                    <Input 
                      label="Téléphone" 
                      placeholder="+33 6 12 34 56 78"
                      className="rounded-xl bg-slate-50 border-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Biographie</label>
                    <textarea 
                      className="w-full min-h-37.5 p-5 rounded-4xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 font-medium transition-all"
                      placeholder="Parlez-nous de votre parcours..."
                    />
                  </div>

                  <div className="pt-4 flex justify-end space-x-4">
                    <Button variant="ghost" className="rounded-xl font-black text-slate-500">Annuler</Button>
                    <Button className="rounded-xl px-10 h-12 shadow-lg shadow-indigo-100">Enregistrer les modifications</Button>
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
                <form className="space-y-6 max-w-md">
                  <Input 
                    label="Mot de passe actuel" 
                    type="password"
                    className="rounded-xl bg-slate-50 border-none"
                  />
                  <Input 
                    label="Nouveau mot de passe" 
                    type="password"
                    className="rounded-xl bg-slate-50 border-none"
                  />
                  <Input 
                    label="Confirmer le nouveau mot de passe" 
                    type="password"
                    className="rounded-xl bg-slate-50 border-none"
                  />
                  <Button className="w-full rounded-xl h-12 shadow-lg shadow-indigo-100">Mettre à jour le mot de passe</Button>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
