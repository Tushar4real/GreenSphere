import React, { createContext, useContext, useState, useEffect } from 'react';
import { cognitoAuth } from '../services/cognitoAuth';
import api from '../services/api';

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
  const [token, setToken] = useState(localStorage.getItem('cognitoToken'));
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        // Try to fetch user data
        try {
          const response = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, message: response.data.message || 'Registration initiated!' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const verifyOTP = async (email, otp, role) => {
    try {
      const response = await api.post('/auth/verify-signup-otp', { email, otp, role });
      return { success: true, message: response.data.message || 'Registration completed successfully!' };
    } catch (error) {
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
      const response = await api.get('/auth/verify');
      setUser(response.data.user);
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