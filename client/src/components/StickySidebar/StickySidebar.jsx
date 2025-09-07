import React, { useState, useEffect } from 'react';
import { FiBell, FiTrendingUp, FiBookOpen, FiTarget } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { environmentalNews } from '../../data/newsData';
import apiService from '../../services/apiService';
import './StickySidebar.css';

const StickySidebar = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications] = useState([
    { id: 1, text: "New quiz available: Climate Change Basics", time: "2 min ago" },
    { id: 2, text: "You earned 50 points from Water Conservation task!", time: "1 hour ago" },
    { id: 3, text: "Weekly challenge starts tomorrow", time: "3 hours ago" }
  ]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await apiService.leaderboard.getSchoolLeaderboard().catch(() => ({ data: [] }));
      setLeaderboard(res.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const userProgress = {
    level: user?.level || 'Seedling',
    points: user?.points || 0,
    ecoPoints: user?.ecoPoints || 0,
    streak: user?.streakDays || 0,
    completedTasks: 12,
    totalTasks: 25
  };

  return (
    <div className="sticky-sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell />
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <FiTrendingUp />
        </button>
        <button 
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <FiBookOpen />
        </button>
        <button 
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <FiTarget />
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'notifications' && (
          <div className="notifications-panel">
            <h4>Notifications</h4>
            {notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                <p>{notif.text}</p>
                <span>{notif.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-panel">
            <h4>Top Students</h4>
            {leaderboard.map((student, index) => (
              <div key={student._id} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{student.name}</span>
                <span className="points">{student.points}pts</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-panel">
            <h4>Latest News</h4>
            {environmentalNews.slice(0, 3).map(news => (
              <div key={news.id} className="news-item">
                <span className="news-icon">{news.image}</span>
                <div>
                  <h5>{news.title}</h5>
                  <p>{news.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-panel">
            <h4>Your Progress</h4>
            <div className="progress-stats">
              <div className="stat">
                <span>Level</span>
                <strong>{userProgress.level}</strong>
              </div>
              <div className="stat">
                <span>Points</span>
                <strong>{userProgress.points}</strong>
              </div>
              <div className="stat">
                <span>Streak</span>
                <strong>{userProgress.streak} days</strong>
              </div>
            </div>
            <div className="progress-bar-container">
              <span>Tasks Progress</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(userProgress.completedTasks / userProgress.totalTasks) * 100}%` }}
                />
              </div>
              <span>{userProgress.completedTasks}/{userProgress.totalTasks}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickySidebar;