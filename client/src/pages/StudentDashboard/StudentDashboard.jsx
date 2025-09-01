import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import TeacherRequestNotification from '../../components/TeacherRequestNotification/TeacherRequestNotification';
import { FiBook, FiTarget, FiAward, FiTrendingUp, FiPlay, FiCheckCircle, FiX } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import { triggerPointsAnimation } from '../../utils/pointsAnimation';

// Safe API call wrapper to prevent runtime errors
const safeApiCall = async (apiCall, fallback) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using fallback:', error.message);
    return { data: fallback };
  }
};
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [dashboardData, setDashboardData] = useState({
    stats: { completedLessons: 0, completedTasks: 0 },
    lessons: [],
    tasks: [],
    badges: [],
    leaderboard: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, tasksRes, badgesRes, leaderboardRes] = await Promise.all([
        safeApiCall(() => apiService.lesson.getLessons(), mockLessons),
        safeApiCall(() => apiService.task.getTasks(), mockTasks),
        safeApiCall(() => apiService.badge.getUserBadges(), mockBadges),
        safeApiCall(() => apiService.leaderboard.getSchoolLeaderboard(), mockLeaderboard)
      ]);
      
      setDashboardData({
        stats: {
          completedLessons: lessonsRes.data.filter(l => l.completed).length,
          completedTasks: tasksRes.data.filter(t => t.completed).length
        },
        lessons: lessonsRes.data.slice(0, 3),
        tasks: tasksRes.data.slice(0, 3),
        badges: badgesRes.data.slice(0, 3),
        leaderboard: leaderboardRes.data.slice(0, 3)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data
      setDashboardData({
        stats: { completedLessons: 5, completedTasks: 3 },
        lessons: mockLessons,
        tasks: mockTasks,
        badges: mockBadges,
        leaderboard: mockLeaderboard
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const mockLessons = [
    { _id: 1, title: 'Climate Change Basics', category: 'Environment', description: 'Learn about climate change', estimatedTime: 15 },
    { _id: 2, title: 'Renewable Energy', category: 'Energy', description: 'Explore renewable energy sources', estimatedTime: 20 },
    { _id: 3, title: 'Water Conservation', category: 'Conservation', description: 'Save water, save the planet', estimatedTime: 10 }
  ];
  
  const mockTasks = [
    { _id: 1, title: 'Plant a Tree', description: 'Plant a tree in your area', points: 50, difficulty: 'easy' },
    { _id: 2, title: 'Reduce Plastic Use', description: 'Use less plastic for a week', points: 30, difficulty: 'medium' },
    { _id: 3, title: 'Energy Audit', description: 'Audit your home energy use', points: 40, difficulty: 'hard' }
  ];
  
  const mockBadges = [
    { _id: 1, name: 'Eco Warrior', description: 'Complete 10 tasks', rarity: 'legendary' },
    { _id: 2, name: 'Tree Hugger', description: 'Plant 5 trees', rarity: 'rare' },
    { _id: 3, name: 'Water Saver', description: 'Save 100L of water', rarity: 'epic' }
  ];
  
  const mockLeaderboard = [
    { _id: 1, name: 'Alice Green', level: 'Tree', points: 850 },
    { _id: 2, name: 'Bob Earth', level: 'Sapling', points: 720 },
    { _id: 3, name: 'Carol Nature', level: 'Seedling', points: 650 }
  ];
  const { stats, lessons, tasks, badges, leaderboard } = dashboardData;

  const handleTaskComplete = (task) => {
    setModalContent({
      title: 'Complete Task',
      mainText: `Ready to complete "${task.title}"?`,
      subText: `${task.description}\n\nReward: +${task.points} points\nDifficulty: ${task.difficulty}`,
      action: () => {
        // Trigger points animation
        triggerPointsAnimation(task.points);
        alert(`🎉 Task completed! You earned ${task.points} points!`);
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  const handleLessonStart = (lesson) => {
    setModalContent({
      title: 'Start Lesson',
      content: `Starting "${lesson.title}" - ${lesson.description}. Estimated time: ${lesson.estimatedTime} minutes.`,
      action: () => {
        alert(`📚 Starting lesson: ${lesson.title}`);
        setShowModal(false);
      }
    });
    setShowModal(true);
  };



  const handleTopicClick = (topicName, points) => {
    setModalContent({
      title: 'Start Topic',
      mainText: `Ready to learn about "${topicName}"?`,
      subText: `This topic covers essential concepts and practical knowledge.\n\nReward: +${points} points\nEstimated time: 10-15 minutes`,
      action: () => {
        // Trigger points animation
        triggerPointsAnimation(points);
        alert(`🎉 Topic completed! You earned ${points} points!`);
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  const handleTestBadgeClick = (testName, score, teacher) => {
    const points = score >= 90 ? 50 : score >= 80 ? 30 : 20;
    setModalContent({
      title: `🏆 ${testName} Badge`,
      mainText: `Great job on the ${testName}!`,
      subText: `Score: ${score}%\nTeacher: ${teacher}\nPoints Earned: +${points}\n\nKeep taking tests to earn more badges and climb the leaderboard!`,
      action: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const handleViewAll = (section) => {
    let content = '';
    let items = [];
    
    switch(section) {
      case 'Lessons':
        items = allLessons;
        content = items.map(lesson => 
          `📚 ${lesson.title}\n   ${lesson.description} (${lesson.estimatedTime} min)\n`
        ).join('\n');
        break;
      case 'Tasks':
        items = allTasks;
        content = items.map(task => 
          `🎯 ${task.title} (+${task.points} pts)\n   ${task.description} [${task.difficulty}]\n`
        ).join('\n');
        break;
      case 'Badges':
        items = allBadges;
        content = items.map(badge => 
          `🏆 ${badge.name} (${badge.rarity})\n   ${badge.description}\n`
        ).join('\n');
        break;
      default:
        content = `Here you would see all available ${section.toLowerCase()}. This feature will be fully implemented soon!`;
    }
    
    setModalContent({
      title: `All ${section} (${items.length} available)`,
      mainText: `Browse all ${section.toLowerCase()} in GreenSphere:`,
      subText: content,
      action: () => setShowModal(false)
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading-spinner">Loading Dashboard...</div>;
  }

  return (
    <div className="student-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}! 🌱</h1>
          <p>Ready to make a difference today?</p>
        </div>

        {/* Quick Stats Banner */}
        <div className="quick-stats-banner">
          <div className="user-greeting">
            <h2>Hi {user.name}! 👋</h2>
            <p>Ready to make a difference today?</p>
          </div>
          <div className="quick-progress">
            <div className="progress-circle">
              <span>{stats.completedLessons || 0}/6</span>
              <small>Lessons</small>
            </div>
            <div className="progress-circle">
              <span>{stats.completedTasks || 0}/8</span>
              <small>Tasks</small>
            </div>
            <div className="progress-circle">
              <FiAward className="progress-icon" />
              <span>{user.points}</span>
              <small>Points</small>
            </div>
            <div className="progress-circle impact">
              <span className="impact-icon">🌍</span>
              <span>{user.impactPoints || 0}</span>
              <small>Impact</small>
            </div>
            <div className="progress-circle">
              <FiTrendingUp className="progress-icon" />
              <span>{user.level}</span>
              <small>Level</small>
            </div>
          </div>
        </div>



        {/* Progress Chart */}
        <div className="progress-chart">
          <h3>📈 Your Progress</h3>
          <div className="progress-metrics">
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label">Lessons Completed</span>
                <span className="metric-value">5/6</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${83 >= 80 ? 'good' : 83 >= 35 ? 'average' : 'poor'}`} style={{width: '83%'}}></div>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label">Average Test Score</span>
                <span className="metric-value">92%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${92 >= 80 ? 'good' : 92 >= 35 ? 'average' : 'poor'}`} style={{width: '92%'}}></div>
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label">Overall Progress</span>
                <span className="metric-value">88%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${88 >= 80 ? 'good' : 88 >= 35 ? 'average' : 'poor'}`} style={{width: '88%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="quick-nav">
          <div className="nav-card" onClick={() => window.location.href = '/lessons'}>
            <div className="nav-icon">📚</div>
            <div className="nav-content">
              <h3>Lessons</h3>
              <p>Interactive environmental lessons</p>
              <span className="nav-count">6 available</span>
            </div>
          </div>
          
          <div className="nav-card" onClick={() => window.location.href = '/tests'}>
            <div className="nav-icon">📝</div>
            <div className="nav-content">
              <h3>Tests</h3>
              <p>Teacher-assigned tests and quizzes</p>
              <span className="nav-count">2 pending</span>
            </div>
          </div>
          
          <div className="nav-card" onClick={() => window.location.href = '/real-world-tasks'}>
            <div className="nav-icon">🌍</div>
            <div className="nav-content">
              <h3>Real World Tasks</h3>
              <p>Complete environmental tasks for badges</p>
              <span className="nav-count">Earn badges</span>
            </div>
          </div>
          
          <div className="nav-card" onClick={() => window.location.href = '/competitions'}>
            <div className="nav-icon">🏆</div>
            <div className="nav-content">
              <h3>School Competitions</h3>
              <p>Compete with other schools</p>
              <span className="nav-count">Join now</span>
            </div>
          </div>
        </div>



        <div className="featured-content">

          {/* Minimal Info Bar */}
          <div className="info-bar">
            <div className="badges-mini">
              <span className="mini-label">Badges:</span>
              <span className="mini-badges">🌡️95% ⚡88% 💧92%</span>
            </div>
            <div className="activity-mini">
              <span className="mini-label">Recent:</span>
              <span className="mini-text">🎉 Climate Basics • 🏆 Quiz Master • 🌱 Tree planted</span>
            </div>
          </div>
        </div>


      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {modalContent.mainText && <p className="modal-main-text">{modalContent.mainText}</p>}
              {modalContent.subText && <p className="modal-sub-text">{modalContent.subText}</p>}
              {modalContent.content && <p>{modalContent.content}</p>}
            </div>
            <div className="modal-footer">
              {modalContent.mainText && modalContent.subText ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={modalContent.action}
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <TeacherRequestNotification />
      
      <footer className="page-footer">
        <p>🌍 GreenSphere - Making environmental education engaging and impactful</p>
      </footer>
    </div>
  );
};

export default StudentDashboard;