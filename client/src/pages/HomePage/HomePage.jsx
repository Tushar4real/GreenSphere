import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiBookOpen, FiAward, FiUsers, FiTrendingUp, FiTarget, FiSettings, FiBell } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const motivationalQuotes = [
    "Every small action creates ripples of change",
    "Be the change you wish to see in the world",
    "The Earth does not belong to us, we belong to Earth",
    "Small steps lead to big environmental victories",
    "Your planet needs you - start today!",
    "Green choices today, brighter tomorrow",
    "Together we can heal our beautiful planet",
    "Nature is not a place to visit, it is home"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const mainFeatures = [
    {
      icon: FiBookOpen,
      title: 'Learn',
      description: 'Interactive lessons',
      path: '/lessons',
      color: '#6f42c1'
    },
    {
      icon: FiAward,
      title: 'Badges',
      description: 'Earn rewards',
      path: '/badges',
      color: '#ffc107'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Connect with others',
      path: '/community',
      color: '#fd7e14'
    },
    {
      icon: FiTarget,
      title: 'Tasks',
      description: 'Real-world activities',
      path: '/real-world-tasks',
      color: '#17a2b8'
    },
    {
      icon: FiUsers,
      title: 'Compete',
      description: 'Join competitions',
      path: '/competitions',
      color: '#28a745'
    },
    {
      icon: FiSettings,
      title: 'Exams',
      description: 'Test knowledge',
      path: '/tests',
      color: '#20c997'
    }
  ];


  
  const handleFeatureHover = (index) => {
    const messages = [
      '📚 Ready to become an eco-expert?',
      '🎯 Time to make a real impact!',
      '🏆 Collect awesome badges!',
      '🌍 Connect with eco-warriors!',
      '🔔 Stay updated with your progress!',
      '🏅 Show your green spirit!',
      '👥 Manage your eco-warriors!',
      '📈 Track your green impact!'
    ];
    console.log(messages[index] || '🌱 Let\'s go green!');
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="floating-elements">
        <div className="floating-emoji" style={{top: '10%', left: '10%', animationDelay: '0s'}}>🌱</div>
        <div className="floating-emoji" style={{top: '20%', right: '15%', animationDelay: '2s'}}>🌍</div>
        <div className="floating-emoji" style={{bottom: '30%', left: '20%', animationDelay: '4s'}}>♻️</div>
        <div className="floating-emoji" style={{bottom: '20%', right: '10%', animationDelay: '6s'}}>🌿</div>
        <div className="floating-emoji" style={{top: '50%', left: '5%', animationDelay: '8s'}}>💧</div>
        <div className="floating-emoji" style={{top: '70%', right: '5%', animationDelay: '10s'}}>☀️</div>
      </div>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Learn, Act, and Save Our Planet</p>
          <div className="user-stats">
            <div className="stat" onClick={() => alert('You have ' + (user?.points || 0) + ' eco-points! Keep learning to earn more!')}>
              <span className="stat-number">{user?.points || 0}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="stat" onClick={() => alert('You are at ' + (user?.level || 'Beginner') + ' level! Complete more tasks to level up!')}>
              <span className="stat-number">{user?.level || 'Beginner'}</span>
              <span className="stat-label">Level</span>
            </div>
            <div className="stat" onClick={() => alert('Amazing! You have a ' + (user?.streakDays || 0) + ' day streak! Keep it up!')}>
              <span className="stat-number">{user?.streakDays || 0}</span>
              <span className="stat-label">Streak</span>
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
            className="main-feature-card"
            onClick={() => {
              const card = document.querySelectorAll('.main-feature-card')[index];
              card.style.transform = 'scale(0.95)';
              setTimeout(() => {
                card.style.transform = '';
                navigate(feature.path);
              }, 150);
            }}
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
            <div className="main-feature-badge">
              {feature.title === 'Learn' && '📚'}
              {feature.title === 'Tasks' && '🎯'}
              {feature.title === 'Badges' && '🏆'}
              {feature.title === 'Community' && '🌍'}
              {feature.title === 'Compete' && '🏅'}
              {feature.title === 'Exams' && '📝'}
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>🚀 Ready to Save the Planet?</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => {
              const btn = event.target;
              btn.innerHTML = '🎉 Let\'s Go!';
              setTimeout(() => {
                btn.innerHTML = '📚 Start Learning';
                navigate('/lessons');
              }, 500);
            }}
          >
            📚 Start Learning
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => {
              const btn = event.target;
              btn.innerHTML = '🌱 Amazing!';
              setTimeout(() => {
                btn.innerHTML = '🎯 Take Action';
                navigate('/real-world-tasks');
              }, 500);
            }}
          >
            🎯 Take Action
          </button>
        </div>
        
        <div className="motivational-text">
          <p key={currentQuote} className="rotating-quote">{motivationalQuotes[currentQuote]}</p>
        </div>
      </div>
      
      <SidePanel />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default HomePage;