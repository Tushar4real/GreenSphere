const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  createNotification, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');

// Get user notifications
router.get('/:userId', getNotifications);

// Create notification
router.post('/', createNotification);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/:userId/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;