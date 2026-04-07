// d:\PROJETS\COURS REACT\e-l\my-react-app\src\pages\Dashboard.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
}

const Dashboard = () => {
  const [user] = useState<User | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data)).catch(err => console.error(err));
  }, []);

  if (!user) return <div className="text-center py-20">Veuillez vous connecter.</div>;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Heureux de vous revoir, {user.firstName} !</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {courses.map((course) => (
            <div key={course.id} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
              <h3 className="font-bold text-lg text-slate-800">{course.title}</h3>
              <p className="text-slate-600 text-sm mt-2 line-clamp-2">{course.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-bold">{course.price} €</span>
                <button className="bg-white border border-indigo-600 text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition">Détails</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;