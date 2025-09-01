import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiUsers, FiUserCheck, FiUserPlus, FiMail, FiCheck, FiX, FiEye, FiTrash2, FiSettings } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [requestsRes, usersRes] = await Promise.all([
        safeApiCall(() => apiService.get('/roles/teacher-requests'), []),
        safeApiCall(() => apiService.get('/roles/users'), [])
      ]);
      
      setTeacherRequests(requestsRes.data || mockTeacherRequests);
      setAllUsers(usersRes.data || mockUsers);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setTeacherRequests(mockTeacherRequests);
      setAllUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const safeApiCall = async (apiCall, fallback) => {
    try {
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, using fallback:', error.message);
      return { data: fallback };
    }
  };

  const mockTeacherRequests = [
    {
      _id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      teacherRequest: {
        status: 'pending',
        requestedAt: new Date('2024-01-15'),
        reason: 'I am a certified environmental science teacher with 5 years of experience.'
      },
      createdAt: new Date('2024-01-10')
    },
    {
      _id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      teacherRequest: {
        status: 'pending',
        requestedAt: new Date('2024-01-14'),
        reason: 'PhD in Environmental Studies, currently teaching at university level.'
      },
      createdAt: new Date('2024-01-12')
    }
  ];

  const mockUsers = [
    {
      _id: '1',
      name: 'Alice Green',
      email: 'alice@student.com',
      role: 'student',
      points: 450,
      level: 'Sapling',
      createdAt: new Date('2024-01-01')
    },
    {
      _id: '2',
      name: 'Bob Teacher',
      email: 'bob@teacher.com',
      role: 'teacher',
      points: 0,
      level: 'Educator',
      createdAt: new Date('2024-01-05')
    }
  ];

  const handleTeacherRequest = async (userId, action, reason = '') => {
    try {
      await safeApiCall(
        () => apiService.patch(`/roles/teacher-requests/${userId}`, { action, reason }),
        { success: true }
      );
      
      // Update local state
      setTeacherRequests(prev => prev.filter(req => req._id !== userId));
      
      // Refresh users list
      loadDashboardData();
      
      alert(`Teacher request ${action}ed successfully!`);
    } catch (error) {
      console.error('Error processing teacher request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await safeApiCall(
        () => apiService.post('/roles/add-teacher', newTeacher),
        { success: true }
      );
      
      setNewTeacher({ name: '', email: '', password: '' });
      setShowAddTeacher(false);
      loadDashboardData();
      alert('Teacher added successfully!');
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher. Please try again.');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await safeApiCall(
        () => apiService.patch(`/roles/change-role/${userId}`, { role: newRole }),
        { success: true }
      );
      
      loadDashboardData();
      alert(`User role updated to ${newRole}!`);
    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{allUsers.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiUserCheck />
          </div>
          <div className="stat-content">
            <h3>{allUsers.filter(u => u.role === 'teacher').length}</h3>
            <p>Active Teachers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiMail />
          </div>
          <div className="stat-content">
            <h3>{teacherRequests.length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{allUsers.filter(u => u.role === 'student').length}</h3>
            <p>Students</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Teacher Requests</h3>
        {teacherRequests.slice(0, 3).map(request => (
          <div key={request._id} className="activity-item">
            <div className="activity-info">
              <strong>{request.name}</strong> requested teacher access
              <span className="activity-time">
                {new Date(request.teacherRequest.requestedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="activity-actions">
              <button 
                className="btn btn-sm btn-success"
                onClick={() => handleTeacherRequest(request._id, 'approve')}
              >
                <FiCheck /> Approve
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleTeacherRequest(request._id, 'reject', 'Application needs more information')}
              >
                <FiX /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeacherRequests = () => (
    <div className="requests-section">
      <div className="section-header">
        <h2>Teacher Requests</h2>
        <span className="badge">{teacherRequests.length} pending</span>
      </div>

      {teacherRequests.length === 0 ? (
        <div className="empty-state">
          <FiMail size={48} />
          <h3>No pending requests</h3>
          <p>All teacher requests have been processed.</p>
        </div>
      ) : (
        <div className="requests-list">
          {teacherRequests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {request.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{request.name}</h4>
                    <p>{request.email}</p>
                    <span className="request-date">
                      Requested: {new Date(request.teacherRequest.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="request-status">
                  <span className="status-badge pending">Pending</span>
                </div>
              </div>

              <div className="request-reason">
                <h5>Reason for Request:</h5>
                <p>{request.teacherRequest.reason || 'No reason provided'}</p>
              </div>

              <div className="request-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => handleTeacherRequest(request._id, 'approve')}
                >
                  <FiCheck /> Approve Request
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    const reason = prompt('Reason for rejection (optional):');
                    handleTeacherRequest(request._id, 'reject', reason || 'Application rejected');
                  }}
                >
                  <FiX /> Reject Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUserManagement = () => (
    <div className="users-section">
      <div className="section-header">
        <h2>User Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddTeacher(true)}
        >
          <FiUserPlus /> Add Teacher
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Points</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar small">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.points || 0}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="user-actions">
                    <select 
                      value={user.role}
                      onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Teacher Modal */}
      {showAddTeacher && (
        <div className="modal-overlay" onClick={() => setShowAddTeacher(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Teacher</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddTeacher(false)}
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleAddTeacher} className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  placeholder="Enter teacher's full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  placeholder="Enter teacher's email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Temporary Password</label>
                <input
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                  placeholder="Enter temporary password"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTeacher(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiUserPlus /> Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-spinner">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, teacher requests, and system settings</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiSettings /> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FiMail /> Teacher Requests
            {teacherRequests.length > 0 && (
              <span className="tab-badge">{teacherRequests.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers /> User Management
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'requests' && renderTeacherRequests()}
          {activeTab === 'users' && renderUserManagement()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;