import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiSun, FiMoon, FiMapPin, FiBookOpen } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, verifyOTP } = useAuth();
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
    setSuccess('');

    // Validate input
    if (!formData.name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    console.log('🚀 Submitting registration:', { 
      email: formData.email, 
      name: formData.name, 
      role: formData.role 
    });

    const result = await register({
      email: formData.email.trim(),
      name: formData.name.trim(),
      password: formData.password,
      role: formData.role
    });
    
    if (result.success) {
      setSuccess(result.message || 'Verification code sent to your email!');
      setShowOtpForm(true);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    console.log('🔐 Verifying OTP:', { email: formData.email, otp: otp.substring(0, 2) + '****' });

    const result = await verifyOTP(formData.email.trim(), otp, formData.role);

    if (result.success) {
      setSuccess(result.message || 'Registration completed successfully!');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration completed! Please login with your credentials.',
            email: formData.email 
          }
        });
      }, 2000);
    } else {
      setError(result.error || 'OTP verification failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <button className="theme-toggle-register" onClick={toggleTheme}>
        {isDark ? <FiSun /> : <FiMoon />}
      </button>
      
      <div className="register-content">
        <div className="register-header">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1>GreenSphere</h1>
          </div>
          <p className="tagline">Join the Environmental Revolution</p>
        </div>

        {!showOtpForm ? (
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  id="email"
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
              <label className="form-label" htmlFor="role">Role</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <select
                  name="role"
                  id="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher (Requires Approval)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
              className="btn btn-primary register-btn"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="register-footer">
              <p>
                Already have an account? 
                <Link to="/login" className="login-link">Sign In</Link>
              </p>
            </div>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleOtpSubmit}>
            <h2>Verify OTP</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <p>Enter the OTP sent to <strong>{formData.email}</strong></p>
            <p><small>📧 Check your email inbox (and spam folder) for the 6-digit verification code</small></p>
            
            <div className="email-info">
              <p><small>💡 <strong>Tip:</strong> The email may take a few minutes to arrive</small></p>
              <p><small>🔄 Didn't receive the email? Check your spam folder or try registering again</small></p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="otp">OTP</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className="form-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowOtpForm(false)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary register-btn"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="register-background">
        <div className="floating-element element-1">🌿</div>
        <div className="floating-element element-2">🌱</div>
        <div className="floating-element element-3">🍃</div>
        <div className="floating-element element-4">🌳</div>
        <div className="floating-element element-5">♻️</div>
        <div className="floating-element element-6">🌍</div>
      </div>
    </div>
  );
};

export default Register;