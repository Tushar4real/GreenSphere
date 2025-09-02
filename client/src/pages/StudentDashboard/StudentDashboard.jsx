import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiBookOpen, FiAward, FiUsers, FiTrendingUp, FiTarget, FiSettings, FiBell } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import TeacherRequestBar from '../../components/TeacherRequestBar/TeacherRequestBar';
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

  const mainFeatures = [
    {
      icon: FiBookOpen,
      title: 'Learn',
      description: 'Interactive lessons',
      path: '/lessons',
      color: '#28a745',
      priority: 'high'
    },
    {
      icon: FiTarget,
      title: 'Tasks',
      description: 'Real-world activities',
      path: '/real-world-tasks',
      color: '#20c997',
      priority: 'high'
    },
    {
      icon: FiTrendingUp,
      title: 'Leaderboard',
      description: 'See rankings',
      path: '/leaderboard',
      color: '#6f42c1',
      priority: 'normal'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Connect with others',
      path: '/community',
      color: '#fd7e14',
      priority: 'normal'
    },
    {
      icon: FiBell,
      title: 'News',
      description: 'Latest updates',
      path: '/news',
      color: '#17a2b8',
      priority: 'normal'
    },
    {
      icon: FiAward,
      title: 'Badges',
      description: 'Earn rewards',
      path: '/badges',
      color: '#ffc107',
      priority: 'normal'
    }
  ];

  useEffect(() => {
    loadDashboardData();
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

  if (loading) {
    return (
      <div className="homepage">
        <Navbar />
        <div className="loading-spinner">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Navbar />

      
      <div className="hero-section">
        <div className="hero-content">
          <h1>🌱 Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p>Continue your environmental journey</p>
          <div className="user-stats">
            <div className="stat" onClick={() => navigate('/badges')}>
              <span className="stat-number">{user?.points || 0}</span>
              <span className="stat-label">🎆 Points</span>
            </div>
            <div className="stat" onClick={() => navigate('/leaderboard')}>
              <span className="stat-number">{user?.level || 'Beginner'}</span>
              <span className="stat-label">🌿 Level</span>
            </div>
            <div className="stat" onClick={() => navigate('/community')}>
              <span className="stat-number">{user?.streakDays || 0}</span>
              <span className="stat-label">🔥 Streak</span>
            </div>
          </div>
          
          <div className="level-progress">
            <div className="progress-bar-container">
              <div className="progress-label">Progress to next level</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${Math.min(100, ((user?.points || 0) % 100))}%`}}></div>
              </div>
              <div className="progress-text">{(user?.points || 0) % 100}/100 XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-features-grid">
        {mainFeatures.map((feature, index) => (
          <div 
            key={index}
            className={`main-feature-card ${feature.priority === 'high' ? 'priority-high' : ''}`}
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
            <p>{feature.description}</p>
            {feature.priority === 'high' && (
              <div className="priority-badge">Priority</div>
            )}
            <div className="main-feature-badge">
              {feature.title === 'Learn' && '📚'}
              {feature.title === 'Tasks' && '🎯'}
              {feature.title === 'Badges' && '🏆'}
              {feature.title === 'Community' && '🌍'}
              {feature.title === 'Leaderboard' && '🏅'}
              {feature.title === 'News' && '📰'}
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>🚀 Ready to Save the Planet?</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/lessons')}
          >
            📚 Continue Learning
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/real-world-tasks')}
          >
            🎯 Take Action
          </button>
        </div>
        
        <div className="motivational-text">
          <p>🌍 Every small action makes a big difference! 🌱</p>
        </div>
      </div>
      
      <SidePanel />
      <ScrollToTop />
      <TeacherRequestBar user={user} onRequestSubmitted={refreshUserData} />
      <Footer />
    </div>
  );
};

export default StudentDashboard;