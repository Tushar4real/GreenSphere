import React, { useState } from 'react';
import { FiPlay, FiAward, FiCheck, FiX } from 'react-icons/fi';
import './QuizCard.css';

const QuizCard = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const handleComplete = () => {
    const score = calculateScore();
    const passed = score >= 3;
    const points = passed ? quiz.points : Math.floor(quiz.points * 0.3);
    
    onComplete({
      quizId: quiz.id,
      score,
      total: quiz.questions.length,
      passed,
      points
    });
  };

  if (!isStarted) {
    return (
      <div className="quiz-card">
        <div className="quiz-header">
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <div className="quiz-info">
            <span>🏆 {quiz.points} points</span>
            <span>❓ {quiz.questions.length} questions</span>
            <span>✅ Pass: 3/5 correct</span>
          </div>
        </div>
        <button className="start-quiz-btn" onClick={handleStart}>
          <FiPlay /> Start Quiz
        </button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 3;
    
    return (
      <div className="quiz-results">
        <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
          {passed ? <FiCheck /> : <FiX />}
          <h3>{passed ? 'Quiz Passed!' : 'Quiz Failed'}</h3>
          <p>Score: {score}/{quiz.questions.length}</p>
          <div className="points-earned">
            <FiAward />
            {passed ? quiz.points : Math.floor(quiz.points * 0.3)} points earned
          </div>
        </div>
        <button className="complete-btn" onClick={handleComplete}>
          Continue
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  
  return (
    <div className="quiz-active">
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <span>{currentQuestion + 1}/{quiz.questions.length}</span>
      </div>
      
      <div className="question-container">
        <h3>{question.question}</h3>
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;