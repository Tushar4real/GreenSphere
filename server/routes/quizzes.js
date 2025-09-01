const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;

const router = express.Router();

router.get('/', auth, quizController.getAllQuizzes);
router.get('/:id', auth, quizController.getQuizById);
router.post('/:id/submit', auth, quizController.submitQuiz);

module.exports = router;