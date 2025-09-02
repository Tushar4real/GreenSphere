import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

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
import ProfileSetup from './components/ProfileSetup/ProfileSetup';

// Global Styles
import './App.css';
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
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === 'student' && <StudentDashboard />}
          {user?.role === 'teacher' && <TeacherDashboard />}
          {user?.role === 'admin' && <AdminDashboard />}
          {!user?.role && <HomePage />}
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
  );
}

export default App;