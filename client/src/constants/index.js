// Application Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Badge Types
export const BADGE_TYPES = {
  LESSON_COMPLETE: 'lesson_complete',
  QUIZ_MASTER: 'quiz_master',
  ECO_WARRIOR: 'eco_warrior',
  COMMUNITY_LEADER: 'community_leader'
};

// Points System
export const POINTS = {
  LESSON_COMPLETE: 100,
  QUIZ_CORRECT: 10,
  TASK_COMPLETE: 50,
  COMMUNITY_POST: 25
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#28A745',
  SECONDARY: '#20C997',
  WARNING: '#FFC107',
  DARK: '#1a1a1a'
};