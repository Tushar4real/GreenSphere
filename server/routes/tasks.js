const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;
const requireRole = authMiddleware.requireRole;
const upload = require('../utils/fileUpload');

const router = express.Router();

router.get('/', auth, taskController.getAllTasks);
router.post('/submit', auth, requireRole(['student']), upload.single('proof'), taskController.submitTask);
router.get('/pending', auth, requireRole(['teacher', 'admin']), taskController.getPendingSubmissions);
router.put('/review/:submissionId', auth, requireRole(['teacher', 'admin']), taskController.reviewSubmission);
router.post('/special', auth, requireRole(['teacher']), taskController.createSpecialTask);
router.post('/assign', auth, requireRole(['teacher']), taskController.assignTask);

module.exports = router;