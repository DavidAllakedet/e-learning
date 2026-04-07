// d:\PROJETS\COURS REACT\e-l\my-react-app\src\App.tsx
// d:\PROJETS\COURS REACT\e-l\my-react-app\src\App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
          <Link to="/" className="text-xl font-bold text-indigo-400">E-LEARN</Link>
          <div className="space-x-6 flex items-center">
            <Link to="/" className="hover:text-indigo-300">Accueil</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-300">Dashboard</Link>
                <button onClick={handleLogout} className="bg-slate-800 px-4 py-1.5 rounded text-sm hover:bg-slate-700 transition">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-300">Connexion</Link>
                <Link to="/register" className="bg-indigo-600 px-4 py-2 rounded font-bold shadow-md hover:bg-indigo-700 transition">S'inscrire</Link>
              </>
            )}
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-5xl font-extrabold text-slate-800">Apprenez n'importe où, n'importe quand</h1>
                <p className="text-xl text-slate-600 mt-6 max-w-2xl mx-auto">Rejoignez des milliers d'étudiants et développez vos compétences avec nos cours en ligne.</p>
                <Link to="/register" className="mt-10 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">Commencer l'aventure</Link>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;