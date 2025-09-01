import api from './api';

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me')
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUsers: () => api.get('/users'),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Lesson Services
export const lessonService = {
  getLessons: () => api.get('/lessons'),
  getLesson: (id) => api.get(`/lessons/${id}`),
  completeLesson: (id, data) => api.post(`/lessons/${id}/complete`, data)
};

// Quiz Services
export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  submitQuiz: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers })
};

// Task Services
export const taskService = {
  getTasks: () => api.get('/tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  submitTask: (id, formData) => api.post(`/tasks/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getPendingSubmissions: () => api.get('/tasks/submissions/pending'),
  approveSubmission: (id) => api.put(`/tasks/submissions/${id}/approve`),
  rejectSubmission: (id, feedback) => api.put(`/tasks/submissions/${id}/reject`, { feedback })
};

// Badge Services
export const badgeService = {
  getBadges: () => api.get('/badges'),
  getUserBadges: () => api.get('/badges/user'),
  createBadge: (data) => api.post('/badges', data),
  updateBadge: (id, data) => api.put(`/badges/${id}`, data),
  deleteBadge: (id) => api.delete(`/badges/${id}`)
};

// Leaderboard Services
export const leaderboardService = {
  getLeaderboard: () => api.get('/leaderboard'),
  getSchoolLeaderboard: () => api.get('/leaderboard/school')
};

export default {
  auth: authService,
  user: userService,
  lesson: lessonService,
  quiz: quizService,
  task: taskService,
  badge: badgeService,
  leaderboard: leaderboardService
};