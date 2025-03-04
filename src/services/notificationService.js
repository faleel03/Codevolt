import api, { mockApiCall } from './api';

// Mock notifications data with unique IDs
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1001',
    type: 'slot_available',
    title: 'Slot Available',
    message: 'A charging slot is now available at Downtown Charging Hub for your requested time.',
    createdAt: '2025-03-03T09:30:00Z',
    read: false
  },
  {
    id: 'notif-1002',
    type: 'booking_reminder',
    title: 'Booking Reminder',
    message: 'Your charging session is scheduled for tomorrow at 2:00 PM.',
    createdAt: '2025-03-02T14:15:00Z',
    read: true
  },
  {
    id: 'notif-1003',
    type: 'payment_success',
    title: 'Payment Successful',
    message: 'Your payment for the last charging session has been processed successfully.',
    createdAt: '2025-03-01T18:45:00Z',
    read: false
  },
  {
    id: 'notif-1004',
    type: 'system_update',
    title: 'System Update',
    message: 'Our app has been updated with new features. Check them out!',
    createdAt: '2025-02-28T12:00:00Z',
    read: true
  },
  {
    id: 'notif-1005',
    type: 'waitlist_update',
    title: 'Waitlist Update',
    message: 'You have moved up in the waitlist for Westside EV Station.',
    createdAt: '2025-02-27T16:20:00Z',
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
