import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { FiFileText, FiPlay, FiClock, FiAward, FiUser, FiArrowLeft } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './Tests.css';

const Tests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const response = await apiService.quiz.getQuizzes();
      const quizzes = response.data || [];
      
      const formattedTests = quizzes.map(quiz => ({
        _id: quiz._id,
        title: quiz.title,
        teacher: quiz.teacher?.name || 'Teacher',
        subject: quiz.category || 'Environmental Science',
        duration: Math.floor(quiz.timeLimit / 60),
        questions: quiz.questions?.length || 0,
        points: quiz.totalPoints,
        status: quiz.completed ? 'completed' : 'available',
        score: quiz.bestScore,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        badge: quiz.badge
      }));
      
      setTests(formattedTests);
    } catch (error) {
      console.error('Error loading tests:', error);
      setTests(mockTests);
    } finally {
      setLoading(false);
    }
  };

  const mockTests = [
    {
      _id: 1,
      title: 'Climate Change Quiz',
      teacher: 'Ms. Johnson',
      subject: 'Environmental Science',
      duration: 30,
      questions: 15,
      points: 100,
      status: 'completed',
      score: 95,
      dueDate: '2024-01-15'
    },
    {
      _id: 2,
      title: 'Renewable Energy Test',
      teacher: 'Mr. Smith',
      subject: 'Energy Studies',
      duration: 45,
      questions: 20,
      points: 150,
      status: 'available',
      dueDate: '2024-01-20'
    },
    {
      _id: 3,
      title: 'Water Conservation Assessment',
      teacher: 'Ms. Davis',
      subject: 'Conservation',
      duration: 25,
      questions: 12,
      points: 80,
      status: 'completed',
      score: 88,
      dueDate: '2024-01-10'
    },
    {
      _id: 4,
      title: 'Biodiversity Quiz',
      teacher: 'Dr. Wilson',
      subject: 'Biology',
      duration: 35,
      questions: 18,
      points: 120,
      status: 'available',
      dueDate: '2024-01-25'
    },
    {
      _id: 5,
      title: 'Sustainable Agriculture Test',
      teacher: 'Prof. Brown',
      subject: 'Agriculture',
      duration: 40,
      questions: 16,
      points: 110,
      status: 'upcoming',
      dueDate: '2024-01-30'
    }
  ];

  if (loading) {
    return (
      <div className="tests-page">
        <Navbar />
        <div className="tests-container">
          <div className="loading-spinner">Loading tests...</div>
        </div>
      </div>
    );
  }

  const statusOptions = ['all', 'available', 'completed', 'upcoming'];
  
  const filteredTests = selectedStatus === 'all' 
    ? tests 
    : tests.filter(test => test.status === selectedStatus);

  const handleStartTest = (test) => {
    if (test.status === 'available') {
      navigate(`/quiz/${test._id}`);
    } else if (test.status === 'completed') {
      navigate(`/quiz/${test._id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#28a745';
      case 'completed': return '#007bff';
      case 'upcoming': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="tests-page">
      <Navbar />
      
      <div className="tests-container">
        <div className="tests-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1>📝 Teacher Tests</h1>
          <p>Complete tests assigned by your teachers to earn badges</p>
        </div>

        {/* Status Filter */}
        <div className="status-filter">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'all' ? 'All Tests' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Organized Tests */}
        {selectedStatus === 'all' ? (
          <>
            {/* Completed Tests */}
            <div className="test-section">
              <h2 className="section-title">✅ Completed Tests</h2>
              <div className="tests-grid">
                {tests.filter(test => test.status === 'completed').map(test => (
                  <div key={test._id} className={`test-card ${test.status}`}>
                    <div className="test-header">
                      <div className="test-subject">{test.subject}</div>
                      <div className="test-score-badge">{test.score}%</div>
                    </div>
                    
                    <div className="test-content">
                      <h3>{test.title}</h3>
                      
                      <div className="teacher-info">
                        <FiUser />
                        <span>By {test.teacher}</span>
                      </div>
                      
                      <div className="test-meta">
                        <div className="meta-item">
                          <FiClock />
                          <span>{test.duration} min</span>
                        </div>
                        <div className="meta-item">
                          <FiFileText />
                          <span>{test.questions} questions</span>
                        </div>
                        <div className="meta-item">
                          <FiAward />
                          <span>{test.points} pts</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-footer">
                      <button 
                        className="test-action-btn completed"
                        onClick={() => handleStartTest(test)}
                      >
                        <FiPlay /> Review Results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Tests */}
            <div className="test-section">
              <h2 className="section-title">📝 Available Tests</h2>
              <div className="tests-grid">
                {tests.filter(test => test.status === 'available').map(test => (
                  <div key={test._id} className={`test-card ${test.status}`}>
                    <div className="test-header">
                      <div className="test-subject">{test.subject}</div>
                      <div className="test-status available">Available</div>
                    </div>
                    
                    <div className="test-content">
                      <h3>{test.title}</h3>
                      
                      <div className="teacher-info">
                        <FiUser />
                        <span>By {test.teacher}</span>
                      </div>
                      
                      <div className="test-meta">
                        <div className="meta-item">
                          <FiClock />
                          <span>{test.duration} min</span>
                        </div>
                        <div className="meta-item">
                          <FiFileText />
                          <span>{test.questions} questions</span>
                        </div>
                        <div className="meta-item">
                          <FiAward />
                          <span>{test.points} pts</span>
                        </div>
                      </div>

                      {test.badge && (
                        <div className="badge-info">
                          {test.badge.icon} {test.badge.name} - {test.badge.minScore}%+ score
                        </div>
                      )}
                      
                      <div className="due-date">
                        Due: {new Date(test.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="test-footer">
                      <button 
                        className="test-action-btn available"
                        onClick={() => handleStartTest(test)}
                      >
                        <FiPlay /> Start Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tests */}
            {tests.filter(test => test.status === 'upcoming').length > 0 && (
              <div className="test-section">
                <h2 className="section-title">⏳ Upcoming Tests</h2>
                <div className="tests-grid">
                  {tests.filter(test => test.status === 'upcoming').map(test => (
                    <div key={test._id} className={`test-card ${test.status}`}>
                      <div className="test-header">
                        <div className="test-subject">{test.subject}</div>
                        <div className="test-status upcoming">Upcoming</div>
                      </div>
                      
                      <div className="test-content">
                        <h3>{test.title}</h3>
                        
                        <div className="teacher-info">
                          <FiUser />
                          <span>By {test.teacher}</span>
                        </div>
                        
                        <div className="test-meta">
                          <div className="meta-item">
                            <FiClock />
                            <span>{test.duration} min</span>
                          </div>
                          <div className="meta-item">
                            <FiFileText />
                            <span>{test.questions} questions</span>
                          </div>
                          <div className="meta-item">
                            <FiAward />
                            <span>{test.points} pts</span>
                          </div>
                        </div>

                        <div className="due-date">
                          Due: {new Date(test.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="test-footer">
                        <button 
                          className="test-action-btn upcoming"
                          disabled
                        >
                          <FiPlay /> Coming Soon
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="tests-grid">
            {filteredTests.map(test => (
              <div key={test._id} className={`test-card ${test.status}`}>
                <div className="test-header">
                  <div className="test-subject">{test.subject}</div>
                  <div 
                    className="test-status"
                    style={{ backgroundColor: getStatusColor(test.status) }}
                  >
                    {test.status}
                  </div>
                </div>
                
                <div className="test-content">
                  <h3>{test.title}</h3>
                  
                  <div className="teacher-info">
                    <FiUser />
                    <span>By {test.teacher}</span>
                  </div>
                  
                  <div className="test-meta">
                    <div className="meta-item">
                      <FiClock />
                      <span>{test.duration} min</span>
                    </div>
                    <div className="meta-item">
                      <FiFileText />
                      <span>{test.questions} questions</span>
                    </div>
                    <div className="meta-item">
                      <FiAward />
                      <span>{test.points} pts</span>
                    </div>
                  </div>

                  {test.status === 'completed' && (
                    <div className="test-score">
                      Score: {test.score}%
                    </div>
                  )}

                  <div className="due-date">
                    Due: {new Date(test.dueDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="test-footer">
                  <button 
                    className={`test-action-btn ${test.status}`}
                    onClick={() => handleStartTest(test)}
                    disabled={test.status === 'upcoming'}
                  >
                    <FiPlay />
                    {test.status === 'available' && 'Start Test'}
                    {test.status === 'completed' && 'Review Results'}
                    {test.status === 'upcoming' && 'Coming Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;