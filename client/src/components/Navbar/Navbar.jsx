import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiAward, FiSettings, FiSave, FiX, FiMenu, FiGlobe, FiStar, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineFire, HiOutlineAcademicCap, HiOutlineMail, HiOutlineOfficeBuilding } from 'react-icons/hi';
import FlyingPoints from '../FlyingPoints/FlyingPoints';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Listen for point animations and scroll
  useEffect(() => {
    const handlePointsEarned = (event) => {
      const { points, position } = event.detail;
      const id = Date.now() + Math.random();
      setFlyingPoints(prev => [...prev, { id, points, position }]);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('pointsEarned', handlePointsEarned);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('pointsEarned', handlePointsEarned);
      window.removeEventListener('scroll', handleScroll);
    };
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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand" onClick={() => navigate('/home')}>
        <FiGlobe className="brand-icon" />
        <h2>GreenSphere</h2>
      </div>
      
      <div className="navbar-content">
        <div className="navbar-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          
          <button 
            className="menu-toggle"
            onClick={() => setShowMenu(!showMenu)}
            title="Menu"
          >
            <FiMenu />
          </button>
          
          {user?.role === 'admin' && (
            <button 
              className="admin-btn"
              onClick={() => navigate('/admin-dashboard')}
              title="Admin Dashboard"
            >
              <FiSettings />
            </button>
          )}
          
          {user && (
            <button 
              className="profile-btn"
              onClick={() => setShowProfile(true)}
              title="Profile"
            >
              <FiUser />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMenu && (
        <div className="mobile-menu">
          <div className="menu-item" onClick={() => { navigate('/home'); setShowMenu(false); }}>
            <FiGlobe className="menu-icon" /> Home
          </div>
          <div className="menu-item" onClick={() => { navigate('/lessons'); setShowMenu(false); }}>
            <HiOutlineAcademicCap className="menu-icon" /> Learn
          </div>
          <div className="menu-item" onClick={() => { navigate('/real-world-tasks'); setShowMenu(false); }}>
            <FiStar className="menu-icon" /> Tasks
          </div>
          <div className="menu-item" onClick={() => { navigate('/community'); setShowMenu(false); }}>
            <FiUser className="menu-icon" /> Community
          </div>
          <div className="menu-item" onClick={() => { navigate('/badges'); setShowMenu(false); }}>
            <FiAward className="menu-icon" /> Badges
          </div>
          <div className="menu-item" onClick={() => { navigate('/leaderboard'); setShowMenu(false); }}>
            <FiTrendingUp className="menu-icon" /> Leaderboard
          </div>
          <div className="menu-item" onClick={() => { navigate('/news'); setShowMenu(false); }}>
            <FiSettings className="menu-icon" /> News
          </div>
          {user?.role === 'admin' && (
            <div className="menu-item admin-menu" onClick={() => { navigate('/admin-dashboard'); setShowMenu(false); }}>
              <FiSettings className="menu-icon" /> Admin Panel
            </div>
          )}
        </div>
      )}
      
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
                  <FiUser className="avatar-icon" />
                  <div className="avatar-letter">{user.name.charAt(0).toUpperCase()}</div>
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-item">
                  <label><FiUser className="info-icon" />Name</label>
                  <span>{user?.name || 'User'}</span>
                </div>
                <div className="info-item">
                  <label><HiOutlineMail className="info-icon" />Email</label>
                  <span>{user?.email || 'user@example.com'}</span>
                </div>
                <div className="info-item">
                  <label><FiAward className="info-icon" />Role</label>
                  <span className="role-badge">{user?.role || 'student'}</span>
                </div>
                <div className="info-item">
                  <label><HiOutlineOfficeBuilding className="info-icon" />School</label>
                  <span>{user?.school || 'GreenSphere Academy'}</span>
                </div>
                <div className="info-item">
                  <label><HiOutlineSparkles className="info-icon" />Level</label>
                  <span className="level-badge">{user?.level || 'Seedling'}</span>
                </div>
                <div className="info-item">
                  <label><FiStar className="info-icon" />Total Points</label>
                  <span className="points-badge">{user?.points || 0}</span>
                </div>
                <div className="info-item">
                  <label><HiOutlineFire className="info-icon" />Streak Days</label>
                  <span className="streak-badge">{user?.streakDays || 0} days</span>
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
                <HiOutlineSparkles className="badge-icon-large" />
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