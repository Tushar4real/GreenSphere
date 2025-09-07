import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import HomePage from './pages/HomePage/HomePage';
import LessonPage from './pages/LessonPage/LessonPage';
import QuizPage from './pages/QuizPage/QuizPage';
import Lessons from './pages/Lessons/Lessons';
import Tests from './pages/Tests/Tests';
import Competitions from './pages/Competitions/Competitions';
import RealWorldTasks from './pages/RealWorldTasks/RealWorldTasks';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import News from './pages/News/News';
import Badges from './pages/Badges/Badges';
import Progress from './pages/Progress/Progress';
import ProfileSetup from './components/ProfileSetup/ProfileSetup';
import About from './pages/About/About';
import Help from './pages/Help/Help';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';

// Global Styles
import './App.css';
import './styles/design-system.css';
import './styles/theme-utils.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin' || user?.email === 'tchandravadiya01@gmail.com') {
    return <AdminDashboard />;
  }
  if (user?.role === 'teacher') {
    return <TeacherDashboard />;
  }
  if (user?.role === 'student') {
    return <StudentDashboard />;
  }
  return <HomePage />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/student-dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/teacher-dashboard" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/lesson/:id" element={
        <ProtectedRoute allowedRoles={['student']}>
          <LessonPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quiz/:id" element={
        <ProtectedRoute allowedRoles={['student']}>
          <QuizPage />
        </ProtectedRoute>
      } />
      
      <Route path="/lessons" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Lessons />
        </ProtectedRoute>
      } />
      
      <Route path="/tests" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Tests />
        </ProtectedRoute>
      } />
      
      <Route path="/competitions" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Competitions />
        </ProtectedRoute>
      } />
      
      <Route path="/real-world-tasks" element={
        <ProtectedRoute allowedRoles={['student']}>
          <RealWorldTasks />
        </ProtectedRoute>
      } />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/community" element={
        <ProtectedRoute>
          <CommunityPage />
        </ProtectedRoute>
      } />
      
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      
      <Route path="/news" element={
        <ProtectedRoute>
          <News />
        </ProtectedRoute>
      } />
      
      <Route path="/badges" element={
        <ProtectedRoute>
          <Badges />
        </ProtectedRoute>
      } />
      
      <Route path="/progress" element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      } />
      
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
};

const ProfileSetupModal = () => {
  const { showProfileSetup, setShowProfileSetup, updateProfile } = useAuth();

  const handleComplete = async (profileData) => {
    await updateProfile(profileData);
  };

  const handleSkip = () => {
    setShowProfileSetup(false);
  };

  if (!showProfileSetup) return null;

  return (
    <ProfileSetup 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <div className="App">
              <AppRoutes />
              <ProfileSetupModal />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;