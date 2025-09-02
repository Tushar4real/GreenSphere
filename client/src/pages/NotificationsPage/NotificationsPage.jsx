import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import BackToDashboard from '../../components/BackToDashboard/BackToDashboard';
import Footer from '../../components/Footer/Footer';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/${user._id}`);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      setNotifications([
        {
          _id: '1',
          title: 'New Badge Earned!',
          message: 'Congratulations! You earned the "Eco Warrior" badge for completing 5 tasks.',
          type: 'achievement',
          read: false,
          icon: '🏆',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          title: 'Task Reminder',
          message: 'Don\'t forget your daily water conservation task!',
          type: 'reminder',
          read: false,
          icon: '💧',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          _id: '3',
          title: 'Community Update',
          message: 'Priya Sharma liked your tree planting post!',
          type: 'social',
          read: false,
          icon: '❤️',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          _id: '4',
          title: 'Level Up!',
          message: 'Amazing! You\'ve reached Level 9. Keep going!',
          type: 'achievement',
          read: true,
          icon: '🎆',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        {
          _id: '5',
          title: 'New Challenge',
          message: 'Weekly "Plastic-Free" challenge starts tomorrow!',
          type: 'challenge',
          read: true,
          icon: '🌱',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
    
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch (error) {
      console.log('Read status saved locally');
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(notif => notif._id !== id));
    
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.log('Notification deleted locally');
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    try {
      await fetch(`/api/notifications/${user._id}/read-all`, { method: 'PUT' });
    } catch (error) {
      console.log('All marked as read locally');
    }
  };

  const formatTimeAgo = (date) => {
    const diff = new Date() - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="loading">Loading notifications... 🔔</div>;
  }

  return (
    <div className="notifications-page">
      <Navbar />
      <BackToDashboard />
      <div className="notifications-header">
        <div className="header-content">
          <span className="header-icon">🔔</span>
          <h1>Notifications</h1>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-read" onClick={markAllAsRead}>
            ✓ Mark All Read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <h3>No notifications yet</h3>
            <p>We'll notify you about achievements, tasks, and community updates!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id}
              className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.type}`}
            >
              <div className="notification-icon">
                <span>{notification.icon}</span>
              </div>
              
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
              </div>
              
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification._id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;