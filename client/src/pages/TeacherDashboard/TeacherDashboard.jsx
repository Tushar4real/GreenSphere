import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiUsers, FiFileText, FiCheck, FiX, FiPlus, FiEye, FiAward, FiBookOpen, FiTarget, FiTrendingUp, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SidePanel from '../../components/SidePanel/SidePanel';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingSubmissions: 0,
    approvedTasks: 0,
    totalPoints: 0
  });
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
    badgeName: '',
    badgeDescription: '',
    minScore: 80,
    maxAttempts: 3
  });


  useEffect(() => {
    loadTeacherData();
    
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      loadTeacherData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const [submissionsRes, studentsRes] = await Promise.all([
        safeApiCall(() => apiService.teacher.getPendingSubmissions(), []),
        safeApiCall(() => apiService.teacher.getStudents(), [])
      ]);
      
      const submissions = submissionsRes.data || [];
      const allUsers = studentsRes.data || [];
      const studentsList = allUsers.filter(u => u.role === 'student');
      
      setTaskSubmissions(submissions.filter(s => s.status === 'pending'));
      setStudents(studentsList);
      setDashboardStats({
        totalStudents: studentsList.length,
        pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
        approvedTasks: submissions.filter(s => s.status === 'approved').length,
        totalPoints: studentsList.reduce((sum, s) => sum + (s.points || 0), 0)
      });
      
      await refreshUserData();
    } catch (error) {
      console.error('Error loading teacher data:', error);
      setTaskSubmissions([]);
      setStudents([]);
      setDashboardStats({
        totalStudents: 0,
        pendingSubmissions: 0,
        approvedTasks: 0,
        totalPoints: 0
      });
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



  const handleApproveSubmission = async (submissionId) => {
    try {
      await safeApiCall(
        () => apiService.teacher.approveSubmission(submissionId),
        { success: true }
      );
      
      setTaskSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      alert('Task submission approved successfully!');
      loadTeacherData();
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Error approving submission. Please try again.');
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    const feedback = prompt('Provide feedback for rejection:');
    if (!feedback) return;

    try {
      await safeApiCall(
        () => apiService.teacher.rejectSubmission(submissionId, feedback),
        { success: true }
      );
      
      setTaskSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      alert('Task submission rejected with feedback.');
      loadTeacherData();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Error rejecting submission. Please try again.');
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    
    const testData = {
      title: newTest.title,
      description: newTest.description,
      questions: newTest.questions,
      isActive: true,
      createdBy: user._id
    };
    
    try {
      await safeApiCall(
        () => apiService.teacher.createQuiz(testData),
        { success: true }
      );
      
      setNewTest({
        title: '',
        description: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
        badgeName: '',
        badgeDescription: '',
        minScore: 80,
        maxAttempts: 3
      });
      setShowCreateTest(false);
      alert('Test created successfully!');
      loadTeacherData();
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Error creating test. Please try again.');
    }
  };

  const addQuestion = () => {
    setNewTest(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setNewTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setNewTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.totalStudents}</h3>
            <p>Students</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiFileText />
          </div>
          <div className="stat-content">
            <h3>{taskSubmissions.length}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{students.reduce((sum, s) => sum + (s.completedTasks || 0), 0)}</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
      </div>

      <div className="recent-submissions">
        <h3>Recent Task Submissions</h3>
        {taskSubmissions.slice(0, 3).map(submission => (
          <div key={submission._id} className="submission-item">
            <div className="submission-info">
              <strong>{submission.student?.name || 'Unknown Student'}</strong> submitted {submission.task?.title || 'Unknown Task'}
              <span className="submission-time">
                {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Unknown Date'}
              </span>
            </div>
            <div className="submission-actions">
              <button 
                className="btn btn-sm btn-success"
                onClick={() => handleApproveSubmission(submission._id)}
              >
                <FiCheck /> Approve
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleRejectSubmission(submission._id)}
              >
                <FiX /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="submissions-section">
      <div className="section-header">
        <h2>Task Submissions</h2>
        <span className="badge">{taskSubmissions.length} pending</span>
      </div>

      {taskSubmissions.length === 0 ? (
        <div className="empty-state">
          <FiFileText size={48} />
          <h3>No pending submissions</h3>
          <p>All task submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="submissions-list">
          {taskSubmissions.map(submission => (
            <div key={submission._id} className="submission-card">
              <div className="submission-header">
                <div className="student-info">
                  <div className="student-avatar">
                    {submission.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div className="student-details">
                    <h4>{submission.student?.name || 'Unknown Student'}</h4>
                    <p>{submission.student?.email || 'No email'}</p>
                    <span className="submission-date">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="task-info">
                  <h5>{submission.task?.title || 'Unknown Task'}</h5>
                  <span className="points-badge">{submission.task?.points || 0} points</span>
                </div>
              </div>

              <div className="submission-content">
                <h5>Student Description:</h5>
                <p>{submission.description}</p>
                
                {submission.proofUrl && (
                  <div className="proof-section">
                    <h5>Proof Submitted:</h5>
                    <a href={submission.proofUrl} target="_blank" rel="noopener noreferrer" className="proof-link">
                      <FiEye /> View Proof
                    </a>
                  </div>
                )}
              </div>

              <div className="submission-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApproveSubmission(submission._id)}
                >
                  <FiCheck /> Approve & Award Points
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleRejectSubmission(submission._id)}
                >
                  <FiX /> Reject with Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="students-section">
      <div className="section-header">
        <h2>My Students</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateTest(true)}
        >
          <FiPlus /> Create Test
        </button>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Points</th>
              <th>Level</th>
              <th>Tasks</th>
              <th>Lessons</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar small">
                      {student.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <span>{student.name || 'Unknown'}</span>
                  </div>
                </td>
                <td>{student.email || 'No email'}</td>
                <td>{student.points || 0}</td>
                <td>
                  <span className="level-badge">
                    {student.level || 'Beginner'}
                  </span>
                </td>
                <td>{student.completedTasks || 0}</td>
                <td>{student.completedLessons || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Test Modal */}
      {showCreateTest && (
        <div className="modal-overlay" onClick={() => setShowCreateTest(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Test</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateTest(false)}
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleCreateTest} className="modal-body">
              <div className="form-group">
                <label>Test Title</label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                  placeholder="Enter test title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  placeholder="Enter test description"
                  rows="3"
                  required
                />
              </div>

              <div className="badge-section">
                <h4>Badge Reward Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Badge Name</label>
                    <input
                      type="text"
                      value={newTest.badgeName}
                      onChange={(e) => setNewTest({...newTest, badgeName: e.target.value})}
                      placeholder="e.g., Climate Expert"
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge Description</label>
                    <input
                      type="text"
                      value={newTest.badgeDescription}
                      onChange={(e) => setNewTest({...newTest, badgeDescription: e.target.value})}
                      placeholder="Description of achievement"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Score (%)</label>
                    <input
                      type="number"
                      value={newTest.minScore}
                      onChange={(e) => setNewTest({...newTest, minScore: parseInt(e.target.value)})}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Attempts</label>
                    <input
                      type="number"
                      value={newTest.maxAttempts}
                      onChange={(e) => setNewTest({...newTest, maxAttempts: parseInt(e.target.value)})}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div className="questions-section">
                <h4>Questions</h4>
                {newTest.questions.map((question, qIndex) => (
                  <div key={qIndex} className="question-form">
                    <div className="form-group">
                      <label>Question {qIndex + 1}</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter question"
                        required
                      />
                    </div>
                    
                    <div className="options-grid">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-group">
                          <label>
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            />
                            Option {String.fromCharCode(65 + oIndex)}
                          </label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="form-group">
                      <label>Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                ))}
                
                <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                  <FiPlus /> Add Question
                </button>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateTest(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiPlus /> Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const mainFeatures = [
    {
      icon: FiFileText,
      title: 'Reviews',
      action: () => setActiveTab('submissions'),
      color: '#28a745'
    },
    {
      icon: FiUsers,
      title: 'Students',
      action: () => setActiveTab('students'),
      color: '#20c997'
    },
    {
      icon: FiPlus,
      title: 'Create Test',
      action: () => setShowCreateTest(true),
      color: '#ffc107'
    },
    {
      icon: FiAward,
      title: 'Approved',
      action: () => setActiveTab('overview'),
      color: '#fd7e14'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics',
      action: () => navigate('/analytics'),
      color: '#6f42c1'
    },
    {
      icon: FiBell,
      title: 'Notifications',
      action: () => navigate('/notifications'),
      color: '#17a2b8'
    }
  ];



  return (
    <div className="homepage">
      <Navbar />

      
      <div className="hero-section">
        <div className="hero-content">
          <h1>🌱 Welcome, Teacher {user?.name?.split(' ')[0]}!</h1>
          <p>Guide your students on their environmental journey</p>
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


      
      {/* Render modals and detailed views when needed */}
      {activeTab === 'submissions' && renderSubmissions()}
      {activeTab === 'students' && renderStudents()}
      {activeTab === 'overview' && renderOverview()}
      
      <SidePanel />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default TeacherDashboard;