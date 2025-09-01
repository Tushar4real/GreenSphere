const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middlewares/auth');

// Student requests teacher role
router.post('/request-teacher', auth, roleController.requestTeacherRole);

// Admin gets all teacher requests
router.get('/teacher-requests', auth, roleController.getTeacherRequests);

// Admin approves/rejects teacher request
router.patch('/teacher-requests/:userId', auth, roleController.approveTeacherRequest);

// Admin manually adds teacher
router.post('/add-teacher', auth, roleController.addTeacher);

// Admin gets all users
router.get('/users', auth, roleController.getAllUsers);

// Admin changes user role
router.patch('/change-role/:userId', auth, roleController.changeUserRole);

module.exports = router;