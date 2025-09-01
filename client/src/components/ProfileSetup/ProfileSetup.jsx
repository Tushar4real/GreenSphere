import React, { useState } from 'react';
import { FiMapPin, FiBookOpen } from 'react-icons/fi';
import './ProfileSetup.css';

const ProfileSetup = ({ onComplete, onSkip }) => {
  const [profileData, setProfileData] = useState({
    role: 'student',
    school: '',
    grade: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onComplete(profileData);
    setLoading(false);
  };

  return (
    <div className="profile-setup-overlay">
      <div className="profile-setup-modal">
        <div className="profile-setup-header">
          <h2>Complete Your Profile</h2>
          <p>Help us personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="form-group">
            <label className="form-label">I am a</label>
            <select
              name="role"
              className="form-input"
              value={profileData.role}
              onChange={(e) => setProfileData({...profileData, role: e.target.value})}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">School</label>
            <div className="input-wrapper">
              <FiMapPin className="input-icon" />
              <input
                type="text"
                name="school"
                className="form-input"
                placeholder="Enter your school name"
                value={profileData.school}
                onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                required
              />
            </div>
          </div>

          {profileData.role === 'student' && (
            <div className="form-group">
              <label className="form-label">Grade</label>
              <div className="input-wrapper">
                <FiBookOpen className="input-icon" />
                <input
                  type="text"
                  name="grade"
                  className="form-input"
                  placeholder="Enter your grade (e.g., 10th, 12th)"
                  value={profileData.grade}
                  onChange={(e) => setProfileData({...profileData, grade: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onSkip}
            >
              Skip for now
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;