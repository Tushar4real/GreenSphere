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
  getStats: () => api.get('/users/stats'),
  getUsers: () => api.get('/users'),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  awardBonusPoints: (id, data) => api.post(`/users/${id}/bonus-points`, data)
};

// Lesson Services
export const lessonService = {
  getLessons: () => api.get('/lessons'),
  getLesson: (id) => api.get(`/lessons/${id}`),
  completeLesson: (id, data) => api.post(`/lessons/${id}/complete`, data),
  submitQuizAnswer: (lessonId, slideIndex, data) => api.post(`/lessons/${lessonId}/quiz/${slideIndex}`, data),
  saveSlideProgress: (lessonId, data) => api.post(`/lessons/${lessonId}/progress`, data)
};

// Quiz Services
export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  submitQuiz: (id, data) => api.post(`/quizzes/${id}/submit`, data)
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

// Competition Services
export const competitionService = {
  getCompetitions: () => api.get('/competitions'),
  createCompetition: (data) => api.post('/competitions', data),
  updateCompetition: (id, data) => api.put(`/competitions/${id}`, data),
  deleteCompetition: (id) => api.delete(`/competitions/${id}`)
};

// Admin Services
export const adminService = {
  getTeacherRequests: () => api.get('/roles/teacher-requests'),
  approveTeacherRequest: (userId, data) => api.patch(`/roles/teacher-requests/${userId}`, data),
  addTeacher: (data) => api.post('/roles/add-teacher', data),
  getAllUsers: () => api.get('/roles/users'),
  changeUserRole: (userId, data) => api.patch(`/roles/change-role/${userId}`, data)
};

// Teacher Services
export const teacherService = {
  getPendingSubmissions: () => api.get('/tasks/pending'),
  approveSubmission: (id) => api.put(`/tasks/review/${id}`, { status: 'approved' }),
  rejectSubmission: (id, feedback) => api.put(`/tasks/review/${id}`, { status: 'rejected', feedback }),
  getStudents: () => api.get('/teacher/students'),
  getStudentCount: () => api.get('/teacher/students/count'),
  createQuiz: (data) => api.post('/teacher/quiz', data),
  getQuizzes: () => api.get('/teacher/quizzes'),
  getRealWorldSubmissions: () => api.get('/real-world-tasks/submissions'),
  reviewRealWorldSubmission: (id, data) => api.patch(`/real-world-tasks/submissions/${id}/review`, data)
};

// Real World Tasks Services
export const realWorldTaskService = {
  getTasks: () => api.get('/real-world-tasks'),
  submitTask: (formData) => api.post('/real-world-tasks/submit', formData),
  getMySubmissions: () => api.get('/real-world-tasks/my-submissions'),
  getSubmissions: () => api.get('/real-world-tasks/submissions')
};

export default {
  auth: authService,
  user: userService,
  lesson: lessonService,
  quiz: quizService,
  task: taskService,
  badge: badgeService,
  leaderboard: leaderboardService,
  competition: competitionService,
  admin: adminService,
  teacher: teacherService,
  realWorldTask: realWorldTaskService,
  // Direct API access for custom calls
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url)
};