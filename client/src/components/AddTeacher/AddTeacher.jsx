import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiPlus } from 'react-icons/fi';
import './AddTeacher.css';

const AddTeacher = ({ onTeacherAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/roles/add-teacher`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Teacher added successfully!');
        setFormData({ name: '', email: '', password: '' });
        if (onTeacherAdded) onTeacherAdded(data.user);
      } else {
        setError(data.error || 'Failed to add teacher');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher">
      <div className="add-teacher-header">
        <h3><FiPlus /> Add Teacher Manually</h3>
      </div>

      <form onSubmit={handleSubmit} className="add-teacher-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter teacher's full name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter teacher's email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Temporary Password</label>
          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create temporary password"
              minLength="8"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Teacher...' : 'Add Teacher'}
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;