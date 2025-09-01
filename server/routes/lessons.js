const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;

// Get all lessons
router.get('/', auth, lessonController.getAllLessons);

// Get specific lesson
router.get('/:id', auth, lessonController.getLessonById);

// Complete lesson
router.post('/:id/complete', auth, lessonController.completeLesson);

// Submit quiz answer for a specific slide
router.post('/:lessonId/quiz/:slideIndex', auth, lessonController.submitQuizAnswer);

module.exports = router;