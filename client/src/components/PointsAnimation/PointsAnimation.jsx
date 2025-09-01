import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './PointsAnimation.css';

const PointsAnimation = ({ points, show, onComplete }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={100}
        colors={['#28A745', '#20C997', '#FFC107', '#FD7E14']}
      />
      
      <div className="points-animation-overlay">
        <div className="points-animation">
          <div className="points-burst">
            +{points}
          </div>
          <div className="points-text">
            Points Earned!
          </div>
        </div>
      </div>
    </>
  );
};

export default PointsAnimation;