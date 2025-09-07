import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Progress.css';

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="progress-page">
      <Navbar />
      
      <div className="progress-content">
        <div className="progress-header">
          <h1>🌱 Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p>Continue your environmental journey</p>
        </div>

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

      <Footer />
    </div>
  );
};

export default Progress;