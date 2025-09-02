import React, { useState, useEffect } from 'react';
import { FaMedal, FaStar, FaLock } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './Badges.css';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const response = await apiService.badge.getUserBadges();
      setBadges(response.data || generateMockBadges());
    } catch (error) {
      console.error('Error loading badges:', error);
      setBadges(generateMockBadges());
    } finally {
      setLoading(false);
    }
  };

  const generateMockBadges = () => {
    const currentDate = new Date();
    return [
      {
        id: 1,
        name: "Eco Warrior",
        description: "Complete 10 environmental tasks",
        icon: "🌱",
        earned: true,
        earnedDate: new Date(currentDate - 5 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 10,
        required: 10
      },
      {
        id: 2,
        name: "Quiz Master",
        description: "Score 90% or higher in 5 quizzes",
        icon: "🧠",
        earned: true,
        earnedDate: new Date(currentDate - 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 5,
        required: 5
      },
      {
        id: 3,
        name: "Tree Hugger",
        description: "Plant or adopt 3 trees",
        icon: "🌳",
        earned: false,
        progress: Math.floor(Math.random() * 3) + 1,
        required: 3
      },
      {
        id: 4,
        name: "Energy Saver",
        description: "Complete 5 energy conservation tasks",
        icon: "⚡",
        earned: false,
        progress: Math.floor(Math.random() * 5) + 1,
        required: 5
      },
      {
        id: 5,
        name: "Water Guardian",
        description: "Complete water conservation challenges",
        icon: "💧",
        earned: Math.random() > 0.5,
        earnedDate: Math.random() > 0.5 ? new Date(currentDate - 3 * 24 * 60 * 60 * 1000).toISOString() : null,
        progress: Math.floor(Math.random() * 4) + 1,
        required: 4
      },
      {
        id: 6,
        name: "Community Leader",
        description: "Help organize 2 community events",
        icon: "👥",
        earned: false,
        progress: Math.floor(Math.random() * 2),
        required: 2
      }
    ];
  };

  const getProgressPercentage = (progress, required) => {
    return Math.min((progress / required) * 100, 100);
  };

  const formatEarnedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="badges-page">
      <Navbar />
      <div className="badges-container">
        <div className="badges-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1><FaMedal /> Your Badges</h1>
          <p>Collect badges by completing eco-friendly activities!</p>
        </div>

        <div className="badges-stats">
          <div className="stat-card">
            <div className="stat-number">{badges.filter(b => b.earned).length}</div>
            <div className="stat-label">Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{badges.length - badges.filter(b => b.earned).length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{badges.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="badges-content">
          {loading ? (
            <div className="loading">Loading your badges...</div>
          ) : (
            <div className="badges-grid">
              {badges.map((badge) => (
                <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">
                    {badge.earned ? (
                      <span className="icon-emoji">{badge.icon}</span>
                    ) : (
                      <FaLock className="lock-icon" />
                    )}
                  </div>
                  <div className="badge-info">
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                    {badge.earned ? (
                      <div className="earned-info">
                        <FaStar className="star" />
                        <span>Earned {formatEarnedDate(badge.earnedDate)}</span>
                      </div>
                    ) : (
                      <div className="progress-info">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage(badge.progress, badge.required)}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {badge.progress}/{badge.required}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Badges;