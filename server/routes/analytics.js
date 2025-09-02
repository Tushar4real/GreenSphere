const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, requireRole } = require('../middlewares/auth');

// Get dashboard statistics
router.get('/dashboard-stats', auth, requireRole(['admin']), analyticsController.getDashboardStats);

// Get recent activity
router.get('/recent-activity', auth, requireRole(['admin']), analyticsController.getRecentActivity);

// Get system health
router.get('/system-health', auth, requireRole(['admin']), analyticsController.getSystemHealth);

// Get system logs
router.get('/system-logs', auth, requireRole(['admin']), analyticsController.getSystemLogs);

module.exports = router;