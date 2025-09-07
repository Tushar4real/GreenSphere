import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiBookOpen, FiAward, FiUsers, FiTrendingUp, FiTarget, FiSettings, FiBell, FiHelpCircle } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import TeacherRequestBar from '../../components/TeacherRequestBar/TeacherRequestBar';
import GamificationDashboard from '../../components/GamificationDashboard/GamificationDashboard';
import QuizCard from '../../components/QuizCard/QuizCard';
import { environmentalQuizzes } from '../../data/quizData';
import apiService from '../../services/apiService';
import '../HomePage/HomePage.css';

const StudentDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    recentLessons: [],
    availableTasks: [],
    leaderboard: [],
    badges: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.points || 0);

  const mainFeatures = [
    {
      icon: FiBookOpen,
      title: 'Learn',
      path: '/lessons',
      color: '#28a745'
    },
    {
      icon: FiTarget,
      title: 'Tasks',
      path: '/real-world-tasks',
      color: '#20c997'
    },
    {
      icon: FiTrendingUp,
      title: 'Leaderboard',
      path: '/leaderboard',
      color: '#6f42c1'
    },
    {
      icon: FiUsers,
      title: 'Community',
      path: '/community',
      color: '#fd7e14'
    },
    {
      icon: FiBell,
      title: 'News',
      path: '/news',
      color: '#17a2b8'
    },
    {
      icon: FiAward,
      title: 'Badges',
      path: '/badges',
      color: '#ffc107'
    },

  ];

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, tasksRes, leaderboardRes, badgesRes] = await Promise.all([
        apiService.lesson.getLessons().catch(() => ({ data: [] })),
        apiService.realWorldTask.getTasks().catch(() => ({ data: [] })),
        apiService.leaderboard.getSchoolLeaderboard().catch(() => ({ data: [] })),
        apiService.badge.getUserBadges().catch(() => ({ data: [] }))
      ]);
      
      setDashboardData({
        recentLessons: lessonsRes.data?.slice(0, 3) || [],
        availableTasks: tasksRes.data?.slice(0, 3) || [],
        leaderboard: leaderboardRes.data?.slice(0, 5) || [],
        badges: badgesRes.data || [],
        notifications: []
      });
      
      await refreshUserData();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (result) => {
    setCompletedQuizzes([...completedQuizzes, result.quizId]);
    setUserPoints(userPoints + result.points);
    setSelectedQuiz(null);
    
    // Show success message
    alert(`Quiz completed! You earned ${result.points} points. ${result.passed ? 'Congratulations!' : 'Try again to get full points!'}`);
  };





  return (
    <div className="homepage">
      <Navbar />

      
      <div className="hero-section">
        <div className="hero-content">
          <h1>🌱 Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p>Continue your environmental journey</p>
        </div>
      </div>

      <div className="main-features-grid">
        {mainFeatures.map((feature, index) => (
          <div 
            key={index}
            className="main-feature-card"
            onClick={() => navigate(feature.path)}
            style={{ 
              '--feature-color': feature.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="main-feature-icon">
              <feature.icon />
            </div>
            <h3>{feature.title}</h3>
          </div>
        ))}
      </div>

      {/* Gamification Dashboard */}
      <div className="dashboard-section">
        <GamificationDashboard user={user} />
      </div>



      <SidePanel />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default StudentDashboard;