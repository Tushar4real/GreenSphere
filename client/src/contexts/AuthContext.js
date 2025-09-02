import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('API_URL:', API_URL);
      console.log('Making login request to:', `${API_URL}/auth/login`);
      console.log('Request data:', { email, password: '***' });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response format');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('Token stored:', newToken.substring(0, 20) + '...');
      console.log('User set in context:', userData);
      console.log('=== LOGIN SUCCESS ===');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🚀 Starting registration process...');
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration initiated:', response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const verifyOTP = async (email, otp, role) => {
    try {
      console.log('🔐 Verifying OTP...');
      const response = await api.post('/auth/verify-signup-otp', { email, otp, role });
      console.log('✅ OTP verified:', response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('❌ OTP verification failed:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'OTP verification failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      setUser(response.data.user);
      setShowProfileSetup(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed' 
      };
    }
  };
  
  const refreshUserData = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    verifyOTP,
    logout,
    updateUser,
    loading,
    showProfileSetup,
    setShowProfileSetup,
    updateProfile,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};