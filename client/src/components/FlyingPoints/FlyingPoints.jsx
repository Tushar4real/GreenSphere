import React, { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import './FlyingPoints.css';

const FlyingPoints = ({ points, startPosition, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="flying-points"
      style={{
        left: startPosition?.x || '50%',
        top: startPosition?.y || '50%'
      }}
    >
      <div className="points-container">
        <FiAward className="flying-icon" />
        <span className="flying-text">+{points}</span>
      </div>
    </div>
  );
};

export default FlyingPoints;