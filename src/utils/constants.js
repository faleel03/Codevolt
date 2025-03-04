/**
 * Application constants
 */

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
  },
  STATIONS: {
    LIST: '/stations',
    DETAILS: (id) => `/stations/${id}`,
    NEARBY: '/stations/nearby',
    AVAILABILITY: (id, date) => `/stations/${id}/availability?date=${date}`,
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAILS: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}`,
  },
  WAITLIST: {
    LIST: '/waitlist',
    JOIN: '/waitlist',
    LEAVE: (id) => `/waitlist/${id}`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
};

// Time constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  MINUTES_PER_DAY: 1440, // 60 * 24
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LAST_LOCATION: 'lastLocation',
  REMEMBER_ME: 'rememberMe',
};

// Charging types
export const CHARGING_TYPES = {
  L1: {
    id: 'L1',
    name: 'Level 1',
    voltage: '120V',
    description: 'Slow Charging',
    chargingRate: '3-5 miles per hour',
  },
  L2: {
    id: 'L2',
    name: 'Level 2',
    voltage: '240V',
    description: 'Standard Charging',
    chargingRate: '15-30 miles per hour',
  },
  L3: {
    id: 'L3',
    name: 'Level 3',
    voltage: '480V',
    description: 'Fast Charging',
    chargingRate: '100-200 miles per hour',
  },
};

// Booking status values
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  MISSED: 'missed',
};

// Waitlist status values
export const WAITLIST_STATUS = {
  WAITING: 'waiting',
  NOTIFIED: 'notified',
  EXPIRED: 'expired',
  CONVERTED: 'converted', // Converted to booking
};

// Notification types
export const NOTIFICATION_TYPES = {
  SLOT_AVAILABLE: 'slot_available',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_REMINDER: 'booking_reminder',
  WAITLIST_POSITION: 'waitlist_position',
  SYSTEM: 'system',
};

// Priority levels based on SoC (State of Charge)
export const PRIORITY_LEVELS = {
  CRITICAL: { min: 0, max: 10, label: 'Critical' },
  HIGH: { min: 11, max: 20, label: 'High' },
  MEDIUM: { min: 21, max: 40, label: 'Medium' },
  LOW: { min: 41, max: 100, label: 'Low' },
};

// Map constants
export const MAP_CONSTANTS = {
  DEFAULT_CENTER: { lat: 40.7128, lng: -74.0060 }, // New York City
  DEFAULT_ZOOM: 13,
  MARKER_SIZES: {
    DEFAULT: 30,
    SELECTED: 40,
  },
};

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  MAX_DISTANCE: 100, // km
};

// Time slots for booking
export const TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
})();

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please correct the errors in your form.',
  BOOKING_CONFLICT: 'This slot is no longer available. Please select another time slot.',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Default pagination settings
export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  CURRENT_PAGE: 1,
};

// Available vehicle types
export const VEHICLE_TYPES = [
  'Tesla Model 3',
  'Tesla Model Y',
  'Tesla Model S',
  'Tesla Model X',
  'Nissan Leaf',
  'Chevrolet Bolt',
  'Ford Mustang Mach-E',
  'Hyundai Kona Electric',
  'Kia EV6',
  'Volkswagen ID.4',
  'Audi e-tron',
  'BMW i4',
  'Rivian R1T',
  'Lucid Air',
  'Polestar 2',
  'Other',
];
