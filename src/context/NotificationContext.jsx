import React, { createContext, useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '../services/notificationService';
import { connectWebSocket } from '../services/websocketService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    const socket = connectWebSocket();
    
    socket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(count => count + 1);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
      
      // Calculate unread count
      const unread = notificationsData.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      
      return notificationsData;
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      // Update notification in state
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      
      // Update unread count
      setUnreadCount(count => Math.max(0, count - 1));
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      return { success: false, error: err.message };
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just update our state
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      return { success: false, error: err.message };
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
