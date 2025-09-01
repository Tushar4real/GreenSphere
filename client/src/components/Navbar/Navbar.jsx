import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiAward, FiSettings, FiSave, FiX } from 'react-icons/fi';
import FlyingPoints from '../FlyingPoints/FlyingPoints';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Listen for point animations
  useEffect(() => {
    const handlePointsEarned = (event) => {
      const { points, position } = event.detail;
      const id = Date.now() + Math.random();
      setFlyingPoints(prev => [...prev, { id, points, position }]);
    };

    window.addEventListener('pointsEarned', handlePointsEarned);
    return () => window.removeEventListener('pointsEarned', handlePointsEarned);
  }, []);

  const removeFlyingPoints = (id) => {
    setFlyingPoints(prev => prev.filter(fp => fp.id !== id));
  };
  
  const handleSaveProfile = async () => {
    const result = await updateProfile(editForm);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🌱 GreenSphere</h2>
      </div>
      
      <div className="navbar-content">
        {user && (
          <div className="user-info">
            <div className="streak-display">
              <span className="streak-icon">🔥</span>
              <span className="streak-text">{user.streakDays || 7}</span>
            </div>
            <div className="points-display" id="navbar-points">
              <FiAward className="points-icon" />
              <span className="points-text">{user.points || 450}</span>
            </div>
            <div className="beginner-badge" onClick={() => setShowBadgeModal(true)}>
              <span className="badge-icon">🌱</span>
            </div>
          </div>
        )}
        
        <div className="navbar-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          
          {user && (
            <>
              <button 
                className="profile-btn"
                onClick={() => setShowProfile(true)}
                title="Profile"
              >
                <FiUser />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3>Profile</h3>
              <button 
                className="profile-close"
                onClick={() => setShowProfile(false)}
              >
                ×
              </button>
            </div>
            
            <div className="profile-content">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-item">
                  <label>Name</label>
                  <span>{user.name}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>

                <div className="info-item">
                  <label>Level</label>
                  <span className="level-badge">{user.level}</span>
                </div>
                <div className="info-item">
                  <label>Total Points</label>
                  <span className="points-badge">{user.points || 450}</span>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <span>January 2024</span>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{user.totalLessonsCompleted || 5}</span>
                  <span className="stat-label">Lessons Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.totalTasksCompleted || 3}</span>
                  <span className="stat-label">Tasks Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.badges?.length || 2}</span>
                  <span className="stat-label">Badges Earned</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className="btn-edit-profile"
                  onClick={() => {
                    setEditForm({
                      name: user?.name || '',
                      email: user?.email || ''
                    });
                    setIsEditing(true);
                  }}
                >
                  <FiSettings /> Edit Profile
                </button>
                <button 
                  className="btn-logout"
                  onClick={logout}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="profile-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3>Edit Profile</h3>
              <button 
                className="profile-close"
                onClick={() => setIsEditing(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="edit-profile-content">
              <div className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                

              </div>
              
              <div className="edit-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-save"
                  onClick={handleSaveProfile}
                >
                  <FiSave /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Badge Modal */}
      {showBadgeModal && (
        <div className="profile-modal-overlay" onClick={() => setShowBadgeModal(false)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="badge-modal-content">
              <div className="badge-display">
                <span className="badge-icon-large">🌱</span>
                <h3>Eco Starter</h3>
                <p>Earn badges make the environment clean</p>
              </div>
              <button 
                className="badge-action-btn"
                onClick={() => {
                  setShowBadgeModal(false);
                  navigate('/real-world-tasks');
                }}
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Flying Points Animations */}
      {flyingPoints.map(fp => (
        <FlyingPoints
          key={fp.id}
          points={fp.points}
          startPosition={fp.position}
          onComplete={() => removeFlyingPoints(fp.id)}
        />
      ))}
    </nav>
  );
};

export default Navbar;