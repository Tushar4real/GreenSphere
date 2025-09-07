import React, { useState, useEffect } from 'react';
import { FiAward, FiTrendingUp, FiTarget, FiZap } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './GamificationDashboard.css';

const GamificationDashboard = ({ user }) => {
  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const [progressRes, badgesRes] = await Promise.all([
        apiService.get('/gamification/progress').catch(() => ({ data: null })),
        apiService.get('/gamification/badges').catch(() => ({ data: [] }))
      ]);
      
      setProgress(progressRes.data);
      setBadges(badgesRes.data || []);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      setProgress(null);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !progress) return <div className="loading">Loading progress...</div>;

  const { user: userProgress, progress: levelProgress, impact } = progress || {};
  const earnedBadges = badges.filter(b => b.isEarned);

  if (!userProgress || !levelProgress || !impact) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="gamification-dashboard">
      <div className="level-section">
        <div className="level-display">
          <div className="level-icon">
            {userProgress.levelNumber >= 6 ? '🌍' : 
             userProgress.levelNumber >= 4 ? '🌳' : 
             userProgress.levelNumber >= 2 ? '🌱' : '🌰'}
          </div>
          <div className="level-info">
            <h3>{userProgress.level}</h3>
            <p>Level {userProgress.levelNumber}</p>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${levelProgress.progressToNext}%` }}
          />
          <span>{Math.round(levelProgress.progressToNext)}% to next level</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiZap />
          <div>
            <h4>{userProgress.points}</h4>
            <p>Points</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiTarget />
          <div>
            <h4>{userProgress.ecoPoints}</h4>
            <p>Eco Points</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiTrendingUp />
          <div>
            <h4>{userProgress.streakDays}</h4>
            <p>Streak</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FiAward />
          <div>
            <h4>{earnedBadges.length}</h4>
            <p>Badges</p>
          </div>
        </div>
      </div>

      <div className="impact-section">
        <h3>🌍 Environmental Impact</h3>
        <div className="impact-grid">
          <div className="impact-item">
            <span>🌳</span>
            <div>
              <strong>{impact.treesPlanted}</strong>
              <p>Trees Planted</p>
            </div>
          </div>
          <div className="impact-item">
            <span>♻️</span>
            <div>
              <strong>{impact.wasteCollected}kg</strong>
              <p>Waste Collected</p>
            </div>
          </div>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div className="badges-section">
          <h3>🏆 Recent Badges</h3>
          <div className="badges-grid">
            {earnedBadges.slice(0, 4).map(badge => (
              <div key={badge._id} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <h4>{badge.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;