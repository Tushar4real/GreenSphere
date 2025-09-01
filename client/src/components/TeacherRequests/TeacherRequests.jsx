import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiUser } from 'react-icons/fi';
import './TeacherRequests.css';

const TeacherRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchTeacherRequests();
  }, []);

  const fetchTeacherRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/roles/teacher-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching teacher requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (userId, action, reason = '') => {
    setProcessing(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/roles/teacher-requests/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, reason })
      });

      if (response.ok) {
        setRequests(requests.filter(req => req._id !== userId));
      }
    } catch (error) {
      console.error('Error processing teacher request:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading teacher requests...</div>;
  }

  return (
    <div className="teacher-requests">
      <div className="requests-header">
        <h3><FiClock /> Teacher Requests</h3>
        <span className="requests-count">{requests.length} pending</span>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <FiUser size={48} />
          <p>No pending teacher requests</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-info">
                <h4>{request.name}</h4>
                <p>{request.email}</p>
                <small>Requested: {new Date(request.teacherRequest.requestedAt).toLocaleDateString()}</small>
              </div>
              <div className="request-actions">
                <button
                  className="btn btn-success"
                  onClick={() => handleRequest(request._id, 'approve')}
                  disabled={processing === request._id}
                >
                  <FiCheck /> Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRequest(request._id, 'reject', 'Request denied by admin')}
                  disabled={processing === request._id}
                >
                  <FiX /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherRequests;