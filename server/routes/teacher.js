const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { auth } = require('../middlewares/auth');

// Get student count
router.get('/students/count', auth, teacherController.getStudentCount);

// Get all students
router.get('/students', auth, teacherController.getStudents);

// Create quiz
router.post('/quiz', auth, teacherController.createQuiz);

// Get teacher's quizzes
router.get('/quizzes', auth, teacherController.getTeacherQuizzes);

// Request teacher role
router.post('/request-role', auth, teacherController.requestTeacherRole);

// Get teacher requests (admin only)
router.get('/requests', auth, teacherController.getTeacherRequests);

module.exports = router;