const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, icon } = req.body;

    const notification = new Notification({
      user: userId,
      title,
      message,
      type: type || 'general',
      icon: icon || '🔔',
      read: false
    });

    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send achievement notification
const sendAchievementNotification = async (userId, achievement) => {
  try {
    const notification = new Notification({
      user: userId,
      title: 'New Achievement!',
      message: `Congratulations! You earned the "${achievement.name}" badge.`,
      type: 'achievement',
      icon: '🏆',
      read: false
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error sending achievement notification:', error);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendAchievementNotification
};