const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { auth, requireRole } = require('../middlewares/auth');

// Lesson routes
router.post('/lessons', auth, requireRole(['admin', 'teacher']), contentController.createLesson);
router.get('/lessons', auth, requireRole(['admin', 'teacher']), contentController.getAllLessons);
router.put('/lessons/:id', auth, requireRole(['admin', 'teacher']), contentController.updateLesson);
router.delete('/lessons/:id', auth, requireRole(['admin']), contentController.deleteLesson);

// Quiz routes
router.post('/quizzes', auth, requireRole(['admin', 'teacher']), contentController.createQuiz);
router.get('/quizzes', auth, requireRole(['admin', 'teacher']), contentController.getAllQuizzes);
router.put('/quizzes/:id', auth, requireRole(['admin', 'teacher']), contentController.updateQuiz);
router.delete('/quizzes/:id', auth, requireRole(['admin']), contentController.deleteQuiz);

module.exports = router;