import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseCatalog from './pages/CourseCatalog';
import QuizPage from './pages/QuizPage';
import AssignmentPage from './pages/AssignmentPage';
import AdminEnrollments from './pages/AdminEnrollments';
import ProfilePage from './pages/ProfilePage';
import StudentProgress from './pages/StudentProgress';
import CourseEditor from './pages/CourseEditor';
import CourseView from './pages/CourseView';

// Simple Auth Guard
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard & App Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Shared Routes */}
          <Route path="dashboard" element={
            user?.role === 'TEACHER' ? <TeacherDashboard /> : <Dashboard />
          } />
          <Route path="catalog" element={<CourseCatalog />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="courses/:id" element={<CourseView />} />
          <Route path="courses/edit/:id" element={
            <ProtectedRoute role="TEACHER">
              <CourseEditor />
            </ProtectedRoute>
          } />
          
          {/* Specific Routes */}
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="assignments/:id" element={<AssignmentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<ProfilePage />} />
          <Route path="progress" element={<StudentProgress />} />
          
          {/* Admin Routes */}
          <Route path="admin/enrollments" element={
            <ProtectedRoute role="ADMIN">
              <AdminEnrollments />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
