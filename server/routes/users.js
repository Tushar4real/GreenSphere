const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const auth = authMiddleware.auth;

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, userController.updateProfile);

// Get user stats
router.get('/stats', auth, userController.getStats);

// Get all users (admin only)
router.get('/', auth, userController.getAllUsers);

// Toggle user status (admin only)
router.put('/:id/toggle-status', auth, userController.toggleUserStatus);

// Get class students (teacher only)
router.get('/class/:className', auth, userController.getClassStudents);

// Award bonus points (teacher/admin only)
router.post('/:id/bonus-points', auth, userController.awardBonusPoints);

module.exports = router;