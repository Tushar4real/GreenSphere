import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiUser, FiMail, FiKey, FiBook, FiSend, FiCheck } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './TeacherRequestBar.css';

const TeacherRequestBar = ({ user, onRequestSubmitted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    teacherCode: '',
    email: user?.email || '',
    name: user?.name || '',
    fieldOfStudy: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Send request to backend with proper data structure
      const response = await apiService.post('/roles/request-teacher', {
        subject: formData.fieldOfStudy,
        teacherCode: formData.teacherCode,
        teacherEmail: formData.email
      });

      setMessage('🎉 Teacher request submitted successfully! Admin will review your request shortly.');
      setFormData({ ...formData, teacherCode: '', fieldOfStudy: '' });
      
      // Auto-collapse after success
      setTimeout(() => {
        setIsExpanded(false);
        setMessage('');
      }, 3000);
      
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit teacher request';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (user?.role === 'teacher' || user?.role === 'admin') {
    return null;
  }

  return (
    <div className={`teacher-request-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="request-bar-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="request-bar-content">
          <div className="request-icon">
            🎓
          </div>
          <div className="request-info">
            <span className="request-text">Become a Teacher</span>
            <span className="request-subtitle">Join our educator community and create impactful lessons</span>
          </div>
        </div>
        <div className="expand-icon">
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {isExpanded && (
        <div className="request-form-container">
          <div className="form-header">
            <h3>🎓 Request Teacher Access</h3>
            <p>Join our community of educators and help shape the future of environmental education!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="teacher-request-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="teacherCode">
                  <FiKey /> Teacher Verification Code
                </label>
                <input
                  type="text"
                  id="teacherCode"
                  name="teacherCode"
                  value={formData.teacherCode}
                  onChange={handleChange}
                  placeholder="Enter: TEACH2024"
                  required
                />
                <small>Contact admin for verification code</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="fieldOfStudy">
                  <FiBook /> Subject Area
                </label>
                <select
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your expertise</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Geography">Geography</option>
                  <option value="Earth Science">Earth Science</option>
                  <option value="Sustainability Studies">Sustainability Studies</option>
                  <option value="Climate Change">Climate Change</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail /> Professional Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@school.edu"
                  required
                />
                <small>Use your institutional email address</small>
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes('🎉') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend /> Request Access
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherRequestBar;