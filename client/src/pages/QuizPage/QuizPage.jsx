import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiArrowLeft, FiArrowRight, FiClock, FiCheck, FiX, FiHome, FiAward } from 'react-icons/fi';
import apiService from '../../services/apiService';
import { triggerPointsAnimation } from '../../utils/pointsAnimation';
import './QuizPage.css';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizCompleted]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await apiService.quiz.getQuiz(id);
      setQuiz(response.data || mockQuiz);
      setTimeLeft(response.data?.timeLimit || 300);
    } catch (error) {
      console.error('Error loading quiz:', error);
      setQuiz(mockQuiz);
      setTimeLeft(300);
    } finally {
      setLoading(false);
    }
  };

  const mockQuiz = {
    id: parseInt(id),
    title: 'Environmental Awareness Quiz',
    description: 'Test your knowledge about environmental issues and solutions',
    timeLimit: 300,
    questions: [
      {
        question: 'Which gas is primarily responsible for global warming?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 1,
        points: 10,
        explanation: 'Carbon dioxide is the primary greenhouse gas responsible for global warming.'
      },
      {
        question: 'What percentage of Earth\'s water is freshwater?',
        options: ['2.5%', '10%', '25%', '50%'],
        correctAnswer: 0,
        points: 15,
        explanation: 'Only about 2.5% of Earth\'s water is freshwater, and most of that is frozen in ice caps.'
      },
      {
        question: 'Which renewable energy source is most widely used globally?',
        options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
        correctAnswer: 2,
        points: 10,
        explanation: 'Hydroelectric power is currently the most widely used renewable energy source globally.'
      }
    ],
    totalPoints: 35
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (quizCompleted) return;
    
    setQuizCompleted(true);
    
    try {
      const response = await apiService.quiz.submitQuiz(id, {
        answers: Object.values(answers),
        timeSpent: quiz.timeLimit - timeLeft
      });
      
      setResults(response.data);
      
      // Trigger points animation
      if (response.data.totalPoints > 0) {
        setTimeout(() => {
          triggerPointsAnimation(response.data.totalPoints);
        }, 1000);
      }
      
      // Refresh user data
      await refreshUserData();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Calculate results locally as fallback
      calculateLocalResults();
    }
  };

  const calculateLocalResults = () => {
    let totalPoints = 0;
    let correctAnswers = 0;
    const questionResults = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }
      
      questionResults.push({
        questionIndex: index,
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
        pointsEarned: isCorrect ? question.points : 0,
        explanation: question.explanation
      });
    });

    const percentage = Math.round((totalPoints / quiz.totalPoints) * 100);
    
    setResults({
      totalPoints,
      maxPoints: quiz.totalPoints,
      percentage,
      results: questionResults,
      correctAnswers,
      totalQuestions: quiz.questions.length
    });

    // Trigger points animation
    if (totalPoints > 0) {
      setTimeout(() => {
        triggerPointsAnimation(totalPoints);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-container">
          <div className="loading-spinner">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-container">
          <div className="error-message">Quiz not found</div>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-container">
          <div className="quiz-results">
            <div className="results-header">
              <div className="results-icon">
                {results.percentage >= 80 ? '🎉' : results.percentage >= 60 ? '👍' : '📚'}
              </div>
              <h1>Quiz Completed!</h1>
              <h2>{quiz.title}</h2>
            </div>
            
            <div className="results-summary">
              <div className="result-stat">
                <span className="stat-value">{results.totalPoints}</span>
                <span className="stat-label">Points Earned</span>
              </div>
              <div className="result-stat">
                <span className="stat-value">{results.percentage}%</span>
                <span className="stat-label">Score</span>
              </div>
              <div className="result-stat">
                <span className="stat-value">{results.correctAnswers}/{results.totalQuestions}</span>
                <span className="stat-label">Correct</span>
              </div>
            </div>

            {results.badgeEarned && (
              <div className="badge-earned">
                <div className="badge-icon">{results.badgeEarned.icon}</div>
                <div className="badge-info">
                  <h3>🎉 Badge Earned!</h3>
                  <p className="badge-name">{results.badgeEarned.name}</p>
                  <p className="badge-desc">{results.badgeEarned.description}</p>
                  <p className="badge-score">Earned with {results.badgeEarned.score}% on attempt #{results.badgeEarned.attempt}</p>
                </div>
              </div>
            )}

            <div className="results-breakdown">
              <h3>Question Breakdown</h3>
              {results.results.map((result, index) => (
                <div key={index} className={`question-result ${result.correct ? 'correct' : 'incorrect'}`}>
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-icon ${result.correct ? 'correct' : 'incorrect'}`}>
                      {result.correct ? <FiCheck /> : <FiX />}
                    </span>
                    <span className="points">+{result.pointsEarned} pts</span>
                  </div>
                  <p className="question-text">{quiz.questions[index].question}</p>
                  <div className="answer-comparison">
                    <div className="user-answer">
                      <strong>Your answer:</strong> {quiz.questions[index].options[result.userAnswer] || 'Not answered'}
                    </div>
                    {!result.correct && (
                      <div className="correct-answer">
                        <strong>Correct answer:</strong> {quiz.questions[index].options[result.correctAnswer]}
                      </div>
                    )}
                  </div>
                  <p className="explanation">{result.explanation}</p>
                </div>
              ))}
            </div>

            <div className="results-actions">
              <button className="btn btn-primary" onClick={() => navigate('/tests')}>
                <FiHome /> Back to Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-container">
          <div className="quiz-intro">
            <button className="back-btn" onClick={() => navigate('/tests')}>
              <FiArrowLeft /> Back to Tests
            </button>
            
            <div className="quiz-info">
              <h1>{quiz.title}</h1>
              <p className="quiz-description">{quiz.description}</p>
              
              <div className="quiz-details">
                <div className="detail-item">
                  <FiClock />
                  <span>Time Limit: {formatTime(quiz.timeLimit)}</span>
                </div>
                <div className="detail-item">
                  <FiCheck />
                  <span>Questions: {quiz.questions.length}</span>
                </div>
                <div className="detail-item">
                  <FiAward />
                  <span>Total Points: {quiz.totalPoints}</span>
                </div>
              </div>

              <div className="quiz-instructions">
                <h3>Instructions:</h3>
                <ul>
                  <li>You have {formatTime(quiz.timeLimit)} to complete this quiz</li>
                  <li>Each question has only one correct answer</li>
                  <li>You can navigate between questions freely</li>
                  <li>Submit before time runs out to save your answers</li>
                </ul>
              </div>

              <button className="btn btn-primary btn-large" onClick={handleStartQuiz}>
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <Navbar />
      
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <div className="timer">
                <FiClock />
                <span className={timeLeft < 60 ? 'time-warning' : ''}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="question-container">
          <div className="question-content">
            <h2>{currentQ.question}</h2>
            
            <div className="answer-options">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  className={`answer-option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {answers[currentQuestion] === index && <FiCheck className="selected-icon" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            className="nav-btn prev"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <FiArrowLeft /> Previous
          </button>

          <div className="question-indicators">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentQuestion ? 'active' : ''} ${answers[index] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              className="nav-btn submit"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length === 0}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="nav-btn next"
              onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            >
              Next <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;