import api, { mockApiCall } from './api';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'slot_available',
    title: 'Slot Available',
    message: 'A charging slot is now available at Downtown Charging Hub for your requested time.',
    createdAt: '2025-03-03T09:30:00Z',
    read: false
  }
];

/**
 * Get all notifications for the current user
 * @returns {Promise<Array>} Array of notifications
 */
export const getNotifications = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_NOTIFICATIONS);
  }
  
  const response = await api.get('/notifications');
  return response.notifications;
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Find the notification in our mock data
    const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (!notification) {
      return mockApiCall(null, 500, true);
    }
    
    // Mark it as read
    const updatedNotification = { ...notification, read: true };
    return mockApiCall(updatedNotification);
  }
  
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.notification;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success status
 */
export const markAllAsRead = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Mark all notifications as read in our mock data
    MOCK_NOTIFICATIONS.forEach(notification => {
      notification.read = true;
    });
    
    return mockApiCall({ success: true });
  }
  
  const response = await api.post('/notifications/read-all');
  return response;
};

/**
 * Delete a notification
 * @param {string} notificationId - ID of the notification to delete
 * @returns {Promise<Object>} Success status
 */
export const deleteNotification = async (notificationId) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall({ success: true });
  }
  
  const response = await api.delete(`/notifications/${notificationId}`);
  return response;
};
