const express = require('express');
const router = express.Router();
const realWorldTaskController = require('../controllers/realWorldTaskController');
const { auth } = require('../middlewares/auth');

// Get all tasks
router.get('/', auth, realWorldTaskController.getAllTasks);

// Submit task with proof
router.post('/submit', auth, realWorldTaskController.uploadMiddleware, realWorldTaskController.submitTask);

// Get all submissions (for teachers/admins)
router.get('/submissions', auth, realWorldTaskController.getSubmissions);

// Get user's submissions
router.get('/my-submissions', auth, realWorldTaskController.getUserSubmissions);

// Review submission (approve/reject)
router.patch('/submissions/:submissionId/review', auth, realWorldTaskController.reviewSubmission);

module.exports = router;