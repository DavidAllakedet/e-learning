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
import NotFound from './pages/NotFound';
import NotAuthorized from './pages/NotAuthorized';
import SelectRole from './pages/SelectRole';
import AdminUsers from './pages/AdminUsers';
import StudentCourses from './pages/student/StudentCourses';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentQuizzes from './pages/student/StudentQuizzes';
import TeacherGrading from './pages/teacher/TeacherGrading';
import TeacherStats from './pages/teacher/TeacherStats';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';
import RoleBasedRoute from './guards/RoleBasedRoute';
import { ROLES } from './constants/roles';

const RoleHomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.role === ROLES.TEACHER) return <Navigate to="/teacher/dashboard" replace />;
  if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/403" element={<NotAuthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<RoleHomeRedirect />} />

              <Route path="catalog" element={<CourseCatalog />} />
              <Route path="courses" element={<CourseCatalog />} />
              <Route path="courses/:id" element={<CourseView />} />

              <Route element={<RoleBasedRoute allowedRoles={[ROLES.STUDENT, ROLES.SUPER_ADMIN]} />}>
                <Route path="student/dashboard" element={<Dashboard />} />
                <Route path="student/courses" element={<StudentCourses />} />
                <Route path="student/progress" element={<StudentProgress />} />
                <Route path="student/courses/:id" element={<CourseView />} />
                <Route path="student/quizzes" element={<StudentQuizzes />} />
                <Route path="student/quiz/:id" element={<QuizPage />} />
                <Route path="student/assignments" element={<StudentAssignments />} />
                <Route path="student/assignments/:id" element={<AssignmentPage />} />
                <Route path="student/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={[ROLES.TEACHER, ROLES.SUPER_ADMIN]} />}>
                <Route path="teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="teacher/courses/new" element={<CourseEditor />} />
                <Route path="teacher/courses/:id/edit" element={<CourseEditor />} />
                <Route path="teacher/grading" element={<TeacherGrading />} />
                <Route path="teacher/stats" element={<TeacherStats />} />
                <Route path="teacher/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/enrollments" element={<AdminEnrollments />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/courses" element={<AdminCourses />} />
                <Route path="admin/reports" element={<AdminReports />} />
                <Route path="admin/settings" element={<AdminSettings />} />
              </Route>

              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProfilePage />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
