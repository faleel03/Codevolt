import { io } from 'socket.io-client';

let socket;

/**
 * Connects to the WebSocket server and sets up event handlers
 * @returns {Object} The socket instance
 */
export const connectWebSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  // For development, we'll mock the socket behavior
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Create a mock socket object with event handling
    const mockSocket = {
      listeners: {},
      on: function(event, callback) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
      },
      emit: function(event, data) {
        if (this.listeners[event]) {
          this.listeners[event].forEach(callback => callback(data));
        }
        return this;
      },
      disconnect: function() {
        console.log('Mock socket disconnected');
        return this;
      },
      connected: true
    };
    
    socket = mockSocket;
    
    // Simulate some events for development testing
    setupMockSocketEvents(mockSocket);
    
    return socket;
  }

  // Connect to the real WebSocket server in production
  socket = io('https://api.evcharging.example', {
    auth: {
      token: localStorage.getItem('authToken')
    }
  });

  // Set up error handling
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('WebSocket disconnected:', reason);
  });

  return socket;
};

/**
 * Disconnects from the WebSocket server
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Sets up mock events for development testing
 * @param {Object} mockSocket - The mock socket object
 */
const setupMockSocketEvents = (mockSocket) => {
  // Update the notification ID generation
  let notificationCounter = 1;
  
  setInterval(() => {
    if (Math.random() > 0.7) {
      const notification = {
        id: `notif-${notificationCounter++}`, // Use counter instead of timestamp
        type: Math.random() > 0.5 ? 'slot_available' : 'booking_reminder',
        title: Math.random() > 0.5 ? 
          'Slot Available!' : 
          'Upcoming Reservation Reminder',
        message: Math.random() > 0.5 ? 
          'A slot you were waiting for is now available!' : 
          'Your reservation starts in 30 minutes.',
        createdAt: new Date().toISOString(),
        read: false
      };
      
      mockSocket.emit('newNotification', notification);
    }
  }, 20000);
  
  // Simulate slot availability updates
  setInterval(() => {
    const slotUpdates = [
      { id: 's1-1', type: 'L2', time: '14:00-16:00', available: Math.random() > 0.5 },
      { id: 's1-3', type: 'L3', time: '15:00-16:00', available: Math.random() > 0.5 }
    ];
    
    mockSocket.emit('slotUpdate', slotUpdates);
  }, 10000); // Every 10 seconds

  // Simulate new notifications
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance of new notification
      const notification = {
        id: `notif-${Date.now()}`,
        type: Math.random() > 0.5 ? 'slot_available' : 'booking_reminder',
        title: Math.random() > 0.5 ? 
          'Slot Available!' : 
          'Upcoming Reservation Reminder',
        message: Math.random() > 0.5 ? 
          'A slot you were waiting for is now available!' : 
          'Your reservation starts in 30 minutes.',
        createdAt: new Date().toISOString(),
        read: false
      };
      
      mockSocket.emit('newNotification', notification);
    }
  }, 20000); // Every 20 seconds
};
