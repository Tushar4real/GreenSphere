import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import ContentManager from '../../components/ContentManager/ContentManager';
import Analytics from '../../components/Analytics/Analytics';
import BulkUserManager from '../../components/BulkUserManager/BulkUserManager';
import SystemMonitor from '../../components/SystemMonitor/SystemMonitor';
import AddTeacher from '../../components/AddTeacher/AddTeacher';
import { 
  FiUsers, FiBookOpen, FiAward, FiTrendingUp, FiSettings, 
  FiBarChart, FiPieChart, FiActivity, FiCalendar, FiDownload,
  FiPlus, FiEdit, FiTrash2, FiEye, FiUserCheck, FiUserX, FiBell
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalLessons: 0,
    totalTasks: 0,
    totalBadges: 0,
    activeCompetitions: 0,
    pendingRequests: 0
  });
  const [users, setUsers] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContentManager, setShowContentManager] = useState(false);
  const [contentType, setContentType] = useState('lesson');
  const [showBulkUserManager, setShowBulkUserManager] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, lessonsRes, tasksRes, badgesRes] = await Promise.all([
        apiService.admin.getAllUsers().catch(() => ({ data: [] })),
        apiService.lesson.getLessons().catch(() => ({ data: [] })),
        apiService.realWorldTask.getTasks().catch(() => ({ data: [] })),
        apiService.badge.getBadges().catch(() => ({ data: [] }))
      ]);
      
      const usersList = usersRes.data || [];
      const teacherRequests = usersList.filter(u => u.teacherRequest && u.teacherRequest.status === 'pending');
      
      setUsers(usersList);
      setTeacherRequests(teacherRequests);
      
      setStats({
        totalUsers: usersList.length,
        totalTeachers: usersList.filter(u => u.role === 'teacher').length,
        totalStudents: usersList.filter(u => u.role === 'student').length,
        totalLessons: lessonsRes.data?.length || 0,
        totalTasks: tasksRes.data?.length || 0,
        totalBadges: badgesRes.data?.length || 0,
        activeCompetitions: 0,
        pendingRequests: teacherRequests.length
      });
      
      await refreshUserData();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        totalUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalLessons: 0,
        totalTasks: 0,
        totalBadges: 0,
        activeCompetitions: 0,
        pendingRequests: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTeacher = async (userId, approved) => {
    try {
      const updateData = approved ? 
        { role: 'teacher', 'teacherRequest.status': 'approved' } : 
        { 'teacherRequest.status': 'rejected' };
      await apiService.admin.changeUserRole(userId, updateData);
      loadDashboardData();
    } catch (error) {
      console.error('Error processing teacher request:', error);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await apiService.user.updateUser(userId, { role: newRole });
      loadDashboardData();
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const handleCreateContent = (type) => {
    setContentType(type);
    setShowContentManager(true);
  };

  const handleSaveContent = async (contentData) => {
    try {
      if (contentType === 'lesson') {
        await apiService.content.createLesson(contentData);
      } else {
        await apiService.content.createQuiz(contentData);
      }
      
      alert(`${contentType === 'lesson' ? 'Lesson' : 'Quiz'} created successfully!`);
      setShowContentManager(false);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Error creating ${contentType}: ${error.response?.data?.error || error.message}`);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {trend && (
          <div className="stat-trend">
            <FiTrendingUp />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const mainFeatures = [
    {
      icon: FiUsers,
      title: 'Users',
      action: () => setActiveTab('users'),
      color: '#28a745'
    },
    {
      icon: FiBookOpen,
      title: 'Content',
      action: () => setActiveTab('content'),
      color: '#20c997'
    },
    {
      icon: FiUserCheck,
      title: 'Requests',
      action: () => setActiveTab('requests'),
      color: '#ffc107'
    },
    {
      icon: FiBarChart,
      title: 'Analytics',
      action: () => setActiveTab('overview'),
      color: '#fd7e14'
    },
    {
      icon: FiSettings,
      title: 'System',
      action: () => setActiveTab('system'),
      color: '#6f42c1'
    },
    {
      icon: FiAward,
      title: 'Badges',
      action: () => navigate('/badges'),
      color: '#17a2b8'
    }
  ];



  return (
    <div className="homepage">
      <Navbar />

      
      <div className="hero-section">
        <div className="hero-content">
          <h1>🛠️ Admin Control Center</h1>
          <p>Manage your GreenSphere platform</p>
        </div>
      </div>

      <div className="main-features-grid">
        {mainFeatures.map((feature, index) => (
          <div 
            key={index}
            className="main-feature-card"
            onClick={feature.action}
            style={{ 
              '--feature-color': feature.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="main-feature-icon">
              <feature.icon />
            </div>
            <h3>{feature.title}</h3>
          </div>
        ))}
      </div>



      {/* Render detailed views when needed */}
      {activeTab !== 'overview' && (
        <div className="dashboard-container" style={{ marginTop: '1rem' }}>
          <div className="admin-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiBarChart /> Overview
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers /> Users
            </button>
            <button 
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <FiBookOpen /> Content
            </button>
            <button 
              className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <FiUserCheck /> Requests ({teacherRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <FiSettings /> System
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              {/* Stats Grid */}
              <div className="stats-grid">
                <StatCard 
                  icon={FiUsers} 
                  title="Total Users" 
                  value={stats.totalUsers} 
                  color="var(--primary-green)"
                  trend="+12% this month"
                />
                <StatCard 
                  icon={FiUserCheck} 
                  title="Teachers" 
                  value={stats.totalTeachers} 
                  color="var(--secondary-teal)"
                  trend="+5 new"
                />
                <StatCard 
                  icon={FiBookOpen} 
                  title="Active Lessons" 
                  value={stats.totalLessons} 
                  color="var(--accent-yellow)"
                />
                <StatCard 
                  icon={FiAward} 
                  title="Total Badges" 
                  value={stats.totalBadges} 
                  color="var(--accent-orange)"
                />
              </div>

              {/* Analytics Section */}
              <Analytics />
            </div>
          )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>👥 User Management ({users.length} users)</h3>
              <div className="section-actions">
                <button className="btn-secondary" onClick={() => setShowBulkUserManager(true)}>
                  <FiUsers /> Bulk Actions
                </button>
                <button className="btn-primary" onClick={() => setShowAddTeacher(true)}>
                  <FiPlus /> Add Teacher
                </button>
              </div>
            </div>
            
            <div className="users-table">
              <div className="table-header">
                <span>User</span>
                <span>Role</span>
                <span>Points</span>
                <span>Level</span>
                <span>Last Active</span>
                <span>School</span>
                <span>Actions</span>
              </div>
              
              {users.map(user => {
                const lastActivity = new Date(user.lastActivity || user.createdAt);
                const daysSinceActive = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
                const isActive = daysSinceActive <= 7;
                
                return (
                  <div key={user._id} className={`table-row ${isActive ? 'active-user' : ''}`}>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                        {isActive && <div className="active-indicator"></div>}
                      </div>
                      <div>
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="user-role">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                        className="role-select"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div className="user-points">{user.points || 0}</div>
                    
                    <div className="user-level">
                      <span className="level-badge">{user.level || 'Seedling'}</span>
                    </div>
                    
                    <div className="user-activity">
                      {daysSinceActive === 0 ? 'Today' : 
                       daysSinceActive === 1 ? 'Yesterday' :
                       daysSinceActive <= 7 ? `${daysSinceActive}d ago` :
                       `${Math.floor(daysSinceActive / 7)}w ago`}
                    </div>
                    
                    <div className="user-school">{user.school || 'N/A'}</div>
                    
                    <div className="user-actions">
                      <button className="btn-icon" title="View Details">
                        <FiEye />
                      </button>
                      <button className="btn-icon" title="Edit">
                        <FiEdit />
                      </button>
                      <button className="btn-icon danger" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="tab-content">
            <div className="content-management">
              <div className="content-section">
                <h3>Lessons Management</h3>
                <div className="content-actions">
                  <button className="btn-primary" onClick={() => handleCreateContent('lesson')}>
                    <FiPlus /> Create Lesson
                  </button>
                  <button className="btn-secondary">
                    <FiEye /> View All
                  </button>
                </div>
              </div>
              
              <div className="content-section">
                <h3>Quiz Management</h3>
                <div className="content-actions">
                  <button className="btn-primary" onClick={() => handleCreateContent('quiz')}>
                    <FiPlus /> Create Quiz
                  </button>
                  <button className="btn-secondary">
                    <FiEye /> View All
                  </button>
                </div>
              </div>
              
              <div className="content-section">
                <h3>Badge Management</h3>
                <div className="content-actions">
                  <button className="btn-primary">
                    <FiPlus /> Create Badge
                  </button>
                  <button className="btn-secondary">
                    <FiEye /> View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Teacher Role Requests</h3>
              <span className="request-count">{teacherRequests.length} pending</span>
            </div>
            
            {teacherRequests.length === 0 ? (
              <div className="empty-state">
                <FiUserCheck size={48} />
                <h3>No Pending Requests</h3>
                <p>All teacher requests have been processed</p>
              </div>
            ) : (
              <div className="requests-list">
                {teacherRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="request-info">
                      <div className="user-avatar">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{request.name}</h4>
                        <p>{request.email}</p>
                        <p className="request-subject">
                          Subject: {request.teacherRequest?.subject || 'Not specified'}
                        </p>
                        <p className="request-date">
                          Requested: {new Date(request.teacherRequest?.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="request-actions">
                      <button 
                        className="btn-success"
                        onClick={() => handleApproveTeacher(request._id, true)}
                      >
                        <FiUserCheck /> Approve
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleApproveTeacher(request._id, false)}
                      >
                        <FiUserX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="tab-content">
            <SystemMonitor />
          </div>
        )}
        </div>
      )}
      
      {/* Content Manager Modal */}
      {showContentManager && (
        <ContentManager
          type={contentType}
          onClose={() => setShowContentManager(false)}
          onSave={handleSaveContent}
        />
      )}
      
      {/* Bulk User Manager Modal */}
      {showBulkUserManager && (
        <BulkUserManager
          onClose={() => setShowBulkUserManager(false)}
          onBulkAction={(action, data) => {
            console.log('Bulk action:', action, data);
            setShowBulkUserManager(false);
            loadDashboardData();
          }}
        />
      )}
      
      {/* Add Teacher Modal */}
      {showAddTeacher && (
        <AddTeacher
          onClose={() => setShowAddTeacher(false)}
          onTeacherAdded={() => {
            setShowAddTeacher(false);
            loadDashboardData();
          }}
        />
      )}
      
      <SidePanel />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default AdminDashboard;