import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiSend, FiX } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import './TeacherRequestNotification.css';

const TeacherRequestNotification = () => {
  const { user, refreshUserData } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    subject: '',
    teacherCode: '',
    teacherEmail: ''
  });
  const [loading, setLoading] = useState(false);

  // Only show for students who haven't requested teacher role
  if (user.role !== 'student' || user.teacherRequest?.status === 'pending' || user.teacherRequest?.status === 'approved') {
    return null;
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.post('/roles/request-teacher', requestData);
      await refreshUserData();
      setShowRequestForm(false);
      alert('Teacher request submitted successfully! Admin will review your request.');
    } catch (error) {
      console.error('Error submitting teacher request:', error);
      const errorMessage = error.response?.data?.error || 'Error submitting request. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showRequestForm) {
    return (
      <div className="teacher-request-modal">
        <div className="modal-overlay" onClick={() => setShowRequestForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Teacher Role</h3>
              <button className="modal-close" onClick={() => setShowRequestForm(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="request-form">
              <div className="form-group">
                <label>Teacher Code</label>
                <input
                  type="text"
                  value={requestData.teacherCode}
                  onChange={(e) => setRequestData({...requestData, teacherCode: e.target.value})}
                  placeholder="Enter teacher verification code"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Teacher Email</label>
                <input
                  type="email"
                  value={requestData.teacherEmail}
                  onChange={(e) => setRequestData({...requestData, teacherEmail: e.target.value})}
                  placeholder="Enter your professional/school email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Subject Area</label>
                <select
                  value={requestData.subject}
                  onChange={(e) => setRequestData({...requestData, subject: e.target.value})}
                  required
                >
                  <option value="">Select subject area</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Climate Change">Climate Change</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Conservation">Conservation</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiSend /> {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-request-notification">
      <div className="notification-content">
        <div className="notification-icon">
          <FiUser />
        </div>
        <div className="notification-text">
          <h4>Want to become a teacher?</h4>
          <p>Request teacher access to create tests and manage students</p>
        </div>
        <button 
          className="request-btn"
          onClick={() => setShowRequestForm(true)}
        >
          Request Access
        </button>
      </div>
    </div>
  );
};

export default TeacherRequestNotification;