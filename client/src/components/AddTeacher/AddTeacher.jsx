import React, { useState } from 'react';
import { FiUser, FiMail, FiKey, FiBook, FiX, FiUserPlus } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './AddTeacher.css';

const AddTeacher = ({ onClose, onTeacherAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fieldOfStudy: '',
    school: 'GreenSphere Academy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const teacherData = {
        ...formData,
        role: 'teacher',
        cognitoId: 'teacher-' + Date.now(),
        isActive: true,
        points: 0,
        level: 'Educator'
      };
      
      await apiService.post('/users', teacherData);
      
      if (onTeacherAdded) {
        onTeacherAdded();
      }
      
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8) + '123!';
    setFormData({ ...formData, password });
  };

  return (
    <div className="modal-overlay">
      <div className="add-teacher-modal">
        <div className="modal-header">
          <h3><FiUserPlus /> Add New Teacher</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-teacher-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Teacher's full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="teacher@school.edu"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <FiKey /> Password
              </label>
              <div className="password-input">
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
                <button 
                  type="button" 
                  className="generate-btn"
                  onClick={generatePassword}
                >
                  Generate
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fieldOfStudy">
                <FiBook /> Field of Study
              </label>
              <select
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                required
              >
                <option value="">Select field</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Geography">Geography</option>
                <option value="Earth Science">Earth Science</option>
                <option value="Sustainability Studies">Sustainability Studies</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="school">School/Institution</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="School or institution name"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Teacher'}
            </button>
          </div>
        </form>

        <div className="teacher-codes-info">
          <h4>Valid Teacher Codes:</h4>
          <div className="codes-grid">
            <div className="code-item">
              <strong>TEACH2024</strong> - General Teaching
            </div>
            <div className="code-item">
              <strong>ENVIRO123</strong> - Environmental Science
            </div>
            <div className="code-item">
              <strong>BIO2024</strong> - Biology
            </div>
            <div className="code-item">
              <strong>CHEM2024</strong> - Chemistry
            </div>
            <div className="code-item">
              <strong>GEO2024</strong> - Geography
            </div>
            <div className="code-item">
              <strong>SUSTAIN2024</strong> - Sustainability Studies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;