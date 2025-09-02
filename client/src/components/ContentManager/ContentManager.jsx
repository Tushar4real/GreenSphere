import React, { useState } from 'react';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import './ContentManager.css';

const ContentManager = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    points: 10,
    slides: type === 'lesson' ? [{ type: 'text', content: '', title: '' }] : [],
    questions: type === 'quiz' ? [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 5 }] : []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, { type: 'text', content: '', title: '' }]
    }));
  };

  const updateSlide = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === index ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const removeSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { 
        question: '', 
        options: ['', '', '', ''], 
        correctAnswer: 0, 
        points: 5 
      }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (qIndex, optIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === qIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optIndex ? value : opt)
        } : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="content-manager-overlay">
      <div className="content-manager-modal">
        <div className="modal-header">
          <h2>Create {type === 'lesson' ? 'Lesson' : 'Quiz'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={`Enter ${type} title`}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="climate-change">Climate Change</option>
                  <option value="renewable-energy">Renewable Energy</option>
                  <option value="waste-management">Waste Management</option>
                  <option value="biodiversity">Biodiversity</option>
                  <option value="water-conservation">Water Conservation</option>
                  <option value="sustainable-living">Sustainable Living</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Points</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={`Enter ${type} description`}
                rows="3"
              />
            </div>
          </div>

          {type === 'lesson' && (
            <div className="form-section">
              <div className="section-header">
                <h3>Lesson Slides</h3>
                <button className="btn-add" onClick={addSlide}>
                  <FiPlus /> Add Slide
                </button>
              </div>
              
              {formData.slides.map((slide, index) => (
                <div key={index} className="slide-editor">
                  <div className="slide-header">
                    <h4>Slide {index + 1}</h4>
                    <button 
                      className="btn-remove"
                      onClick={() => removeSlide(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label>Slide Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlide(index, 'title', e.target.value)}
                      placeholder="Enter slide title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={slide.content}
                      onChange={(e) => updateSlide(index, 'content', e.target.value)}
                      placeholder="Enter slide content"
                      rows="4"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'quiz' && (
            <div className="form-section">
              <div className="section-header">
                <h3>Quiz Questions</h3>
                <button className="btn-add" onClick={addQuestion}>
                  <FiPlus /> Add Question
                </button>
              </div>
              
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-editor">
                  <div className="question-header">
                    <h4>Question {qIndex + 1}</h4>
                    <button 
                      className="btn-remove"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <FiX />
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label>Question</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question"
                      rows="2"
                    />
                  </div>
                  
                  <div className="options-grid">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="option-group">
                        <label>
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                          />
                          Option {optIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateQuestionOption(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
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
                      max="20"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <FiSave /> Save {type === 'lesson' ? 'Lesson' : 'Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;