import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiHome } from 'react-icons/fi';
import apiService from '../../services/apiService';
import { triggerPointsAnimation } from '../../utils/pointsAnimation';
// Fallback for when apiService is not available
const safeApiCall = async (apiCall, fallback) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using fallback:', error.message);
    return { data: fallback };
  }
};
import './LessonPage.css';

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const response = await safeApiCall(
        () => apiService.lesson.getLesson(id),
        mockLesson
      );
      setLesson(response.data);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setLesson(mockLesson);
    } finally {
      setLoading(false);
    }
  };

  // Mock lesson data fallback
  const mockLesson = {
    id: parseInt(id),
    title: 'Climate Change Basics',
    description: 'Understanding the fundamentals of climate change and its impact on our planet',
    category: 'Environment',
    difficulty: 'beginner',
    estimatedTime: 15,
    slides: [
      {
        id: 1,
        title: 'What is Climate Change?',
        content: `Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver of climate change since the 1800s.

Key factors include:
• Burning fossil fuels (coal, oil, gas)
• Deforestation and land use changes
• Industrial processes and agriculture
• Transportation emissions

These activities release greenhouse gases like CO2, methane, and nitrous oxide into the atmosphere, trapping heat and warming the planet.`,
        hasQuiz: true,
        quiz: {
          question: 'What is the main driver of climate change since the 1800s?',
          options: [
            'Natural climate variations',
            'Human activities',
            'Solar radiation changes',
            'Ocean currents'
          ],
          correctAnswer: 1,
          points: 10,
          explanation: 'Human activities, particularly burning fossil fuels, have been the primary driver of climate change since the industrial revolution.'
        }
      },
      {
        id: 2,
        title: 'Effects of Climate Change',
        content: `Climate change impacts every aspect of our planet and society:

🌡️ **Temperature Changes:**
• Global average temperature has risen by 1.1°C since 1880
• More frequent and intense heatwaves
• Changing seasonal patterns

🌊 **Environmental Effects:**
• Rising sea levels (20cm since 1900)
• Melting ice caps and glaciers
• Ocean acidification
• Extreme weather events

🌱 **Ecosystem Impact:**
• Species migration and extinction
• Coral bleaching
• Forest fires and droughts
• Agricultural disruption`,
        hasQuiz: true,
        quiz: {
          question: 'By how much has the global average temperature risen since 1880?',
          options: [
            '0.5°C',
            '1.1°C',
            '2.0°C',
            '3.5°C'
          ],
          correctAnswer: 1,
          points: 15,
          explanation: 'The global average temperature has increased by approximately 1.1°C (2°F) since 1880, with most warming occurring in the past 40 years.'
        }
      },
      {
        id: 3,
        title: 'Taking Action',
        content: `Everyone can contribute to fighting climate change:

🏠 **At Home:**
• Use energy-efficient appliances
• Reduce, reuse, recycle
• Choose renewable energy
• Improve home insulation

🚗 **Transportation:**
• Walk, bike, or use public transport
• Consider electric vehicles
• Combine trips and carpool
• Work from home when possible

🌱 **Lifestyle Changes:**
• Eat more plant-based meals
• Buy local and seasonal food
• Reduce water consumption
• Support sustainable businesses

🗳️ **Community Action:**
• Vote for climate-conscious leaders
• Join environmental organizations
• Educate others about climate change
• Participate in local green initiatives`,
        hasQuiz: false
      }
    ],
    totalPoints: 25
  };

  const currentSlideData = lesson?.slides?.[currentSlide];
  const isLastSlide = currentSlide === (lesson?.slides?.length || 1) - 1;
  const canProceed = !currentSlideData?.hasQuiz || quizAnswered;

  const handleAnswerSelect = (answerIndex) => {
    if (quizAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleQuizSubmit = async () => {
    if (selectedAnswer === null || !currentSlideData?.quiz) return;
    
    try {
      const response = await safeApiCall(
        () => apiService.lesson.submitQuizAnswer(id, currentSlide, {
          answer: selectedAnswer,
          timeSpent: 30 // Could track actual time
        }),
        {
          correct: selectedAnswer === currentSlideData.quiz.correctAnswer,
          pointsEarned: selectedAnswer === currentSlideData.quiz.correctAnswer ? currentSlideData.quiz.points : 0,
          explanation: currentSlideData.quiz.explanation
        }
      );
      
      const result = response.data;
      setShowQuizResult(true);
      setQuizAnswered(true);
      
      if (result.correct) {
        setTotalPoints(prev => prev + result.pointsEarned);
        
        // Trigger flying points animation
        setTimeout(() => {
          const quizSection = document.querySelector('.quiz-section');
          triggerPointsAnimation(result.pointsEarned, quizSection);
        }, 500);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Fallback to local logic
      const isCorrect = selectedAnswer === currentSlideData.quiz.correctAnswer;
      setShowQuizResult(true);
      setQuizAnswered(true);
      
      if (isCorrect) {
        const points = currentSlideData.quiz.points || 0;
        setTotalPoints(prev => prev + points);
        
        setTimeout(() => {
          const quizSection = document.querySelector('.quiz-section');
          triggerPointsAnimation(points, quizSection);
        }, 500);
      }
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < (lesson?.slides?.length || 1) - 1) {
      setCurrentSlide(prev => prev + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setQuizAnswered(false);
    } else {
      // Lesson completed
      setLessonCompleted(true);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setQuizAnswered(false);
    }
  };

  const handleLessonComplete = async () => {
    try {
      const slideProgress = lesson?.slides?.map((slide, index) => ({
        slideIndex: index,
        completed: index <= currentSlide,
        quizScore: index < currentSlide ? 100 : (index === currentSlide && quizAnswered ? (selectedAnswer === currentSlideData?.quiz?.correctAnswer ? 100 : 0) : 0),
        timeSpent: 60 // Could track actual time per slide
      })) || [];
      
      const response = await safeApiCall(
        () => apiService.lesson.completeLesson(id, { 
          points: totalPoints,
          slideProgress,
          timeSpent: lesson?.estimatedTime || 15
        }),
        { 
          success: true,
          pointsEarned: totalPoints,
          newLevel: 'Sapling',
          currentStreak: 8
        }
      );
      
      const result = response.data;
      
      // Trigger final points animation for lesson completion
      if (result.pointsEarned > 0) {
        const completionButton = document.querySelector('.btn.btn-primary');
        triggerPointsAnimation(result.pointsEarned, completionButton);
      }
      
      alert(`🎉 Lesson completed! You earned ${result.pointsEarned} points!${result.newLevel ? ` New level: ${result.newLevel}!` : ''}`);
      
      // Refresh user data to update points and stats
      await refreshUserData();
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert(`🎉 Lesson completed! You earned ${totalPoints} points!`);
    }
    
    setTimeout(() => {
      navigate('/lessons');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="lesson-page">
        <Navbar />
        <div className="lesson-container">
          <div className="loading-spinner">Loading lesson...</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-page">
        <Navbar />
        <div className="lesson-container">
          <div className="error-message">Lesson not found</div>
        </div>
      </div>
    );
  }

  if (lessonCompleted) {
    return (
      <div className="lesson-page">
        <Navbar />
        <div className="lesson-container">
          <div className="completion-screen">
            <div className="completion-content">
              <div className="completion-icon">🎉</div>
              <h1>Lesson Completed!</h1>
              <h2>{lesson.title}</h2>
              <div className="completion-stats">
                <div className="stat">
                  <span className="stat-value">{totalPoints}</span>
                  <span className="stat-label">Points Earned</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{lesson?.slides?.length || 0}</span>
                  <span className="stat-label">Slides Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{lesson?.estimatedTime || 0}</span>
                  <span className="stat-label">Minutes</span>
                </div>
              </div>
              <div className="completion-actions">
                <button className="btn btn-primary" onClick={handleLessonComplete}>
                  <FiHome /> Back to Lessons
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <Navbar />
      
      <div className="lesson-container">
        {/* Lesson Header */}
        <div className="lesson-header">
          <button className="back-btn" onClick={() => navigate('/lessons')}>
            <FiArrowLeft /> Back to Lessons
          </button>
          <div className="lesson-info">
            <h1>{lesson?.title || 'Loading...'}</h1>
            <div className="lesson-meta">
              <span className="category">{lesson?.category || 'General'}</span>
              <span className="difficulty">{lesson?.difficulty || 'beginner'}</span>
              <span className="time">⏱️ {lesson?.estimatedTime || 0} min</span>
            </div>
          </div>
          <div className="lesson-progress">
            <span>{currentSlide + 1} / {lesson?.slides?.length || 1}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentSlide + 1) / (lesson?.slides?.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <div className="slide-container">
          <div className="slide-content">
            <h2>{currentSlideData?.title || 'Loading...'}</h2>
            <div className="slide-text">
              {currentSlideData?.content?.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              )) || <p>Loading content...</p>}
            </div>

            {/* Quiz Section */}
            {currentSlideData?.hasQuiz && (
              <div className="quiz-section">
                <h3>📝 Quick Quiz</h3>
                <div className="quiz-question">
                  <p>{currentSlideData?.quiz?.question || 'Loading question...'}</p>
                  <div className="quiz-options">
                    {currentSlideData?.quiz?.options?.map((option, index) => (
                      <button
                        key={index}
                        className={`quiz-option ${
                          selectedAnswer === index ? 'selected' : ''
                        } ${
                          showQuizResult && index === currentSlideData?.quiz?.correctAnswer ? 'correct' : ''
                        } ${
                          showQuizResult && selectedAnswer === index && index !== currentSlideData?.quiz?.correctAnswer ? 'incorrect' : ''
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={quizAnswered}
                      >
                        {option}
                        {showQuizResult && index === currentSlideData?.quiz?.correctAnswer && <FiCheck />}
                        {showQuizResult && selectedAnswer === index && index !== currentSlideData?.quiz?.correctAnswer && <FiX />}
                      </button>
                    )) || <p>Loading options...</p>}
                  </div>
                  
                  {!quizAnswered && (
                    <button 
                      className="quiz-submit"
                      onClick={handleQuizSubmit}
                      disabled={selectedAnswer === null}
                    >
                      Submit Answer (+{currentSlideData?.quiz?.points || 0} pts)
                    </button>
                  )}

                  {showQuizResult && (
                    <div className="quiz-result">
                      <div className={`result-message ${selectedAnswer === currentSlideData.quiz.correctAnswer ? 'correct' : 'incorrect'}`}>
                        {selectedAnswer === currentSlideData.quiz.correctAnswer ? (
                          <>
                            <FiCheck /> Correct! +{currentSlideData?.quiz?.points || 0} points
                          </>
                        ) : (
                          <>
                            <FiX /> Incorrect. +0 points
                          </>
                        )}
                      </div>
                      <p className="explanation">{currentSlideData?.quiz?.explanation || 'Great job!'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="lesson-navigation">
          <button 
            className="nav-btn prev"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
          >
            <FiArrowLeft /> Previous
          </button>
          
          <div className="slide-indicators">
            {lesson?.slides?.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
              ></div>
            )) || <div className="indicator active"></div>}
          </div>

          <button 
            className="nav-btn next"
            onClick={handleNextSlide}
            disabled={!canProceed}
          >
            {isLastSlide ? 'Complete Lesson' : 'Next'} <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;