import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { FiBook, FiPlay, FiClock, FiAward, FiArrowLeft } from 'react-icons/fi';
import './Lessons.css';

const Lessons = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const lessons = [
    { 
      _id: 1, 
      title: 'Climate Change Basics', 
      category: 'Environment', 
      description: 'Learn about climate change causes and effects', 
      estimatedTime: 15,
      points: 50,
      difficulty: 'Beginner',
      completed: true
    },
    { 
      _id: 2, 
      title: 'Renewable Energy Sources', 
      category: 'Energy', 
      description: 'Explore solar, wind, and other renewable energy', 
      estimatedTime: 20,
      points: 60,
      difficulty: 'Intermediate',
      completed: false
    },
    { 
      _id: 3, 
      title: 'Water Conservation', 
      category: 'Conservation', 
      description: 'Learn water saving techniques and importance', 
      estimatedTime: 10,
      points: 40,
      difficulty: 'Beginner',
      completed: true
    },
    { 
      _id: 4, 
      title: 'Biodiversity & Ecosystems', 
      category: 'Environment', 
      description: 'Understanding ecosystem balance and biodiversity', 
      estimatedTime: 25,
      points: 70,
      difficulty: 'Advanced',
      completed: false
    },
    { 
      _id: 5, 
      title: 'Sustainable Agriculture', 
      category: 'Agriculture', 
      description: 'Eco-friendly farming practices and techniques', 
      estimatedTime: 18,
      points: 55,
      difficulty: 'Intermediate',
      completed: false
    },
    { 
      _id: 6, 
      title: 'Ocean Conservation', 
      category: 'Marine', 
      description: 'Protecting marine life and ocean ecosystems', 
      estimatedTime: 22,
      points: 65,
      difficulty: 'Intermediate',
      completed: false
    }
  ];

  const categories = ['all', 'Environment', 'Energy', 'Conservation', 'Agriculture', 'Marine'];
  
  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const handleStartLesson = (lesson) => {
    alert(`Starting lesson: ${lesson.title}`);
  };

  return (
    <div className="lessons-page">
      <Navbar />
      
      <div className="lessons-container">
        <div className="lessons-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1>📚 Environmental Lessons</h1>
          <p>Expand your knowledge with interactive lessons</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Lessons' : category}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="lessons-grid">
          {filteredLessons.map(lesson => (
            <div key={lesson._id} className={`lesson-card ${lesson.completed ? 'completed' : ''}`}>
              <div className="lesson-header">
                <div className="lesson-category">{lesson.category}</div>
                {lesson.completed && <div className="completed-badge">✓</div>}
              </div>
              
              <div className="lesson-content">
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                
                <div className="lesson-meta">
                  <div className="meta-item">
                    <FiClock />
                    <span>{lesson.estimatedTime} min</span>
                  </div>
                  <div className="meta-item">
                    <FiAward />
                    <span>{lesson.points} pts</span>
                  </div>
                  <div className="difficulty-badge">{lesson.difficulty}</div>
                </div>
              </div>
              
              <div className="lesson-footer">
                <button 
                  className="start-lesson-btn"
                  onClick={() => handleStartLesson(lesson)}
                >
                  <FiPlay />
                  {lesson.completed ? 'Review' : 'Start Lesson'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;