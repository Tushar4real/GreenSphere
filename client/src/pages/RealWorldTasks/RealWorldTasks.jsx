import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiUpload, FiCamera, FiAward, FiArrowLeft, FiCheck, FiClock, FiX, FiShare2 } from 'react-icons/fi';
import apiService from '../../services/apiService';
import { triggerPointsAnimation } from '../../utils/pointsAnimation';
import './RealWorldTasks.css';

const RealWorldTasks = () => {
  const { user, refreshUserData } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState({
    description: '',
    files: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, submissionsRes] = await Promise.all([
        apiService.realWorldTask.getTasks(),
        apiService.realWorldTask.getMySubmissions()
      ]);
      
      setTasks(tasksRes.data || []);
      setSubmissions(submissionsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionData(prev => ({ ...prev, files }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    
    if (!submissionData.files.length) {
      alert('Please upload at least one proof file (photo or video)');
      return;
    }
    
    const formData = new FormData();
    formData.append('taskId', selectedTask._id);
    formData.append('description', submissionData.description);
    
    submissionData.files.forEach(file => {
      formData.append('proofFiles', file);
    });
    
    try {
      await apiService.realWorldTask.submitTask(formData);
      
      alert('Task submitted successfully! Wait for teacher approval.');
      setShowSubmissionForm(false);
      setSubmissionData({ description: '', files: [] });
      loadData();
    } catch (error) {
      alert('Error submitting task: ' + (error.response?.data?.error || error.message));
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const shareTask = async (submission) => {
    try {
      const shareData = {
        title: `I completed: ${submission.task.title}`,
        text: `Just earned ${submission.pointsAwarded} points and the ${submission.task.badge.name} badge on GreenSphere! 🌱`,
        url: window.location.origin
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(text);
        alert('Achievement copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="real-world-tasks-page">
        <Navbar />
        <div className="tasks-container">
          <div className="loading-spinner">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="real-world-tasks-page">
      <Navbar />
      
      <div className="tasks-container">
        <div className="tasks-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1>🌍 Real World Tasks</h1>
          <p>Complete environmental tasks and earn exclusive badges</p>
        </div>

        <div className="tasks-tabs">
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Available Tasks
          </button>
          <button 
            className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            My Submissions ({submissions.length})
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className={`task-card ${task.difficulty}`}>
                <div className="task-header">
                  <div className="task-badge-preview">
                    <span className="badge-icon">{task.badge.icon}</span>
                    <span className="badge-name">{task.badge.name}</span>
                  </div>
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
                  >
                    {task.difficulty.toUpperCase()}
                  </div>
                </div>
                
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  
                  <div className="task-requirements">
                    <h4>Requirements:</h4>
                    <ul>
                      {task.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="task-reward">
                    <FiAward /> {task.points} Impact Points + Badge
                  </div>
                </div>
                
                <div className="task-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowSubmissionForm(true);
                    }}
                  >
                    <FiUpload /> Submit Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="submissions-list">
            {submissions.length === 0 ? (
              <div className="empty-state">
                <FiCamera size={48} />
                <h3>No Submissions Yet</h3>
                <p>Complete real-world tasks to earn badges and points!</p>
              </div>
            ) : (
              submissions.map(submission => (
                <div key={submission._id} className="submission-card">
                  <div className="submission-header">
                    <div className="task-info">
                      <h3>{submission.task.title}</h3>
                      <span className="task-category">{submission.task.category}</span>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(submission.status) }}
                    >
                      {submission.status === 'pending' && <FiClock />}
                      {submission.status === 'approved' && <FiCheck />}
                      {submission.status === 'rejected' && <FiX />}
                      {submission.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="submission-content">
                    <p><strong>Description:</strong> {submission.description}</p>
                    <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                    
                    {submission.status === 'approved' && (
                      <div className="reward-earned">
                        <FiAward /> Earned: {submission.pointsAwarded} Impact Points + {submission.task.badge.name} badge
                        <button 
                          className="btn-share"
                          onClick={() => shareTask(submission)}
                        >
                          <FiShare2 /> Share
                        </button>
                      </div>
                    )}
                    
                    {submission.feedback && (
                      <div className="feedback">
                        <strong>Feedback:</strong> {submission.feedback}
                      </div>
                    )}
                  </div>
                  
                  <div className="proof-files">
                    <strong>Proof Files:</strong>
                    <div className="files-grid">
                      {submission.proofFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          {file.mimetype.startsWith('image/') ? (
                            <img 
                              src={`/uploads/task-proofs/${file.filename}`} 
                              alt="Proof" 
                              className="proof-image"
                            />
                          ) : (
                            <video 
                              src={`/uploads/task-proofs/${file.filename}`} 
                              controls 
                              className="proof-video"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Submission Form Modal */}
        {showSubmissionForm && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowSubmissionForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit: {selectedTask.title}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmitTask} className="submission-form">
                <div className="badge-preview">
                  <span className="badge-icon-large">{selectedTask.badge.icon}</span>
                  <div className="badge-info">
                    <h4>{selectedTask.badge.name}</h4>
                    <p>{selectedTask.badge.description}</p>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description of your work:</label>
                  <textarea
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you did, where, when, and any challenges faced..."
                    required
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label>Upload Proof (Photos/Videos):</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    required
                  />
                  <small>Upload photos or videos as proof of your work (max 5 files, 10MB each)</small>
                  {submissionData.files.length > 0 && (
                    <div className="file-preview">
                      <p>Selected files: {submissionData.files.length}</p>
                      <ul>
                        {submissionData.files.map((file, index) => (
                          <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSubmissionForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiUpload /> Submit Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealWorldTasks;