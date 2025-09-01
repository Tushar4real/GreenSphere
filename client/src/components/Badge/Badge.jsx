import React from 'react';
import { FiAward, FiStar, FiTrendingUp, FiTarget } from 'react-icons/fi';
import './Badge.css';

const Badge = ({ badge, earned = false, showAnimation = false }) => {
  const getIcon = (category) => {
    switch (category) {
      case 'task': return <FiTarget />;
      case 'quiz': return <FiStar />;
      case 'streak': return <FiTrendingUp />;
      default: return <FiAward />;
    }
  };

  const getRarityClass = (rarity) => {
    return `badge-${rarity}`;
  };

  return (
    <div className={`badge-container ${earned ? 'earned' : 'locked'} ${showAnimation ? 'animate' : ''}`}>
      <div className={`badge ${getRarityClass(badge.rarity)}`}>
        <div className="badge-icon" style={{ color: badge.color }}>
          {getIcon(badge.category)}
        </div>
        
        <div className="badge-info">
          <h4 className="badge-name">{badge.name}</h4>
          <p className="badge-description">{badge.description}</p>
          
          {badge.criteria && (
            <div className="badge-criteria">
              <small>{badge.criteria.description}</small>
            </div>
          )}
        </div>
        
        <div className={`badge-rarity ${badge.rarity}`}>
          {badge.rarity}
        </div>
      </div>
      
      {!earned && <div className="badge-overlay">🔒</div>}
      {showAnimation && <div className="badge-glow"></div>}
    </div>
  );
};

export default Badge;