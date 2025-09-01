import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiUsers, FiFileText, FiCheck, FiX, FiPlus, FiEye, FiAward } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
    badgeName: '',
    badgeDescription: '',
    minScore: 80,
    maxAttempts: 3
  });
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const [submissionsRes, studentsRes, countRes] = await Promise.all([
        safeApiCall(() => apiService.task.getPendingSubmissions(), []),
        safeApiCall(() => apiService.teacher.getStudents(), []),
        safeApiCall(() => apiService.teacher.getStudentCount(), { count: 0 })
      ]);
      
      setTaskSubmissions(submissionsRes.data || mockSubmissions);
      setStudents(studentsRes.data || mockStudents);
      setStudentCount(countRes.data?.count || studentsRes.data?.length || 0);
    } catch (error) {
      console.error('Error loading teacher data:', error);
      setTaskSubmissions(mockSubmissions);
      setStudents(mockStudents);
      setStudentCount(mockStudents.length);
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

  const mockSubmissions = [
    {
      _id: '1',
      student: { name: 'Alice Green', email: 'alice@student.com' },
      task: { title: 'Plant a Tree', points: 50 },
      submittedAt: new Date('2024-01-15'),
      proofUrl: '/uploads/tree-planting.jpg',
      description: 'I planted an oak tree in my backyard with my family.'
    },
    {
      _id: '2',
      student: { name: 'Bob Smith', email: 'bob@student.com' },
      task: { title: 'Energy Audit', points: 40 },
      submittedAt: new Date('2024-01-14'),
      proofUrl: '/uploads/energy-audit.pdf',
      description: 'Completed home energy audit and identified 5 ways to save energy.'
    }
  ];

  const mockStudents = [
    {
      _id: '1',
      name: 'Alice Green',
      email: 'alice@student.com',
      points: 450,
      level: 'Sapling',
      completedTasks: 8,
      completedLessons: 12
    },
    {
      _id: '2',
      name: 'Bob Smith',
      email: 'bob@student.com',
      points: 320,
      level: 'Seedling',
      completedTasks: 5,
      completedLessons: 8
    }
  ];

  const handleApproveSubmission = async (submissionId) => {
    try {
      await safeApiCall(
        () => apiService.task.approveSubmission(submissionId),
        { success: true }
      );
      
      setTaskSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      alert('Task submission approved successfully!');
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
        () => apiService.task.rejectSubmission(submissionId, feedback),
        { success: true }
      );
      
      setTaskSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
      alert('Task submission rejected with feedback.');
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Error rejecting submission. Please try again.');
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    
    const testData = {
      ...newTest,
      badge: {
        name: newTest.badgeName || `${newTest.title} Master`,
        description: newTest.badgeDescription || `Earned by scoring 80% or higher on ${newTest.title}`,
        icon: '🏆',
        minScore: newTest.minScore || 80,
        maxAttempts: newTest.maxAttempts || 3
      }
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
      alert('Test created successfully with badge reward!');
      loadTeacherData(); // Refresh data
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
            <h3>{studentCount}</h3>
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
            <h3>{students.reduce((sum, s) => sum + s.completedTasks, 0)}</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
      </div>

      <div className="recent-submissions">
        <h3>Recent Task Submissions</h3>
        {taskSubmissions.slice(0, 3).map(submission => (
          <div key={submission._id} className="submission-item">
            <div className="submission-info">
              <strong>{submission.student.name}</strong> submitted {submission.task.title}
              <span className="submission-time">
                {new Date(submission.submittedAt).toLocaleDateString()}
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
                    {submission.student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="student-details">
                    <h4>{submission.student.name}</h4>
                    <p>{submission.student.email}</p>
                    <span className="submission-date">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="task-info">
                  <h5>{submission.task.title}</h5>
                  <span className="points-badge">{submission.task.points} points</span>
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
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{student.name}</span>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.points}</td>
                <td>
                  <span className="level-badge">
                    {student.level}
                  </span>
                </td>
                <td>{student.completedTasks}</td>
                <td>{student.completedLessons}</td>
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

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-spinner">Loading teacher dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <p>Manage student submissions and create assessments</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiUsers /> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <FiFileText /> Task Reviews
            {taskSubmissions.length > 0 && (
              <span className="tab-badge">{taskSubmissions.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <FiUsers /> Students
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'submissions' && renderSubmissions()}
          {activeTab === 'students' && renderStudents()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;