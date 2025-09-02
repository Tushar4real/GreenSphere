import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackToDashboard.css';

const BackToDashboard = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="back-to-dashboard"
      onClick={() => navigate('/home')}
      title="Back to Dashboard"
    >
      🏠 Dashboard
    </button>
  );
};

export default BackToDashboard;