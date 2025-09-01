import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiSun, FiMoon, FiUser, FiUsers, FiSettings } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigate based on user's role from backend
      const userRole = result.user?.role || 'student';
      switch (userRole) {
        case 'student':
          navigate('/student');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
    // Auto-submit after setting data
    setTimeout(() => {
      const mockEvent = { preventDefault: () => {} };
      handleSubmit(mockEvent);
    }, 100);
  };

  return (
    <div className="login-container">
      <button className="theme-toggle-login" onClick={toggleTheme}>
        {isDark ? <FiSun /> : <FiMoon />}
      </button>
      
      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1>GreenSphere</h1>
          </div>
          <p className="tagline">Learn, Act, Save the Planet</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          

          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                id="login-email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="login-password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="login-footer">
            <p>
              Don't have an account? 
              <Link to="/register" className="register-link">Sign Up</Link>
            </p>
            
            {/* Quick Login for Demo */}
            <div className="demo-logins">
              <h4>Quick Demo Login:</h4>
              <div className="demo-buttons">
                <button type="button" onClick={() => quickLogin('student@demo.com', 'demo123')}>
                  Student Demo
                </button>
                <button type="button" onClick={() => quickLogin('teacher@demo.com', 'demo123')}>
                  Teacher Demo
                </button>
                <button type="button" onClick={() => quickLogin('admin@demo.com', 'demo123')}>
                  Admin Demo
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="login-background">
        <div className="floating-element element-1">🌿</div>
        <div className="floating-element element-2">🌱</div>
        <div className="floating-element element-3">🍃</div>
        <div className="floating-element element-4">🌳</div>
        <div className="floating-element element-5">♻️</div>
        <div className="floating-element element-6">🌍</div>
        <div className="floating-element element-7">🌸</div>
        <div className="floating-element element-8">🦋</div>
        <div className="floating-element element-9">☀️</div>
        <div className="floating-element element-10">💧</div>
        <div className="floating-element element-11">🌼</div>
        <div className="floating-element element-12">🌲</div>
        <div className="floating-element element-13">🍀</div>
        <div className="floating-element element-14">🌊</div>
        <div className="floating-element element-15">🌈</div>
      </div>
    </div>
  );
};

export default Login;