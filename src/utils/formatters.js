/**
 * Utility functions for formatting data
 */

/**
 * Formats a date string to a more readable format
 * @param {string} dateString - ISO date string or YYYY-MM-DD format
 * @param {Object} options - Display options for the formatter
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const { 
    includeDay = true, 
    includeYear = true, 
    shortMonth = false 
  } = options;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  const dateOptions = {
    month: shortMonth ? 'short' : 'long',
  };
  
  if (includeDay) {
    dateOptions.day = 'numeric';
  }
  
  if (includeYear) {
    dateOptions.year = 'numeric';
  }
  
  if (includeDay && !shortMonth) {
    dateOptions.weekday = 'long';
  }
  
  return date.toLocaleDateString(undefined, dateOptions);
};

/**
 * Formats a time string to a more readable format
 * @param {string} timeString - Time in HH:MM format
 * @param {Object} options - Display options for the formatter
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString, options = {}) => {
  if (!timeString) return '';
  
  const { use24Hour = false } = options;
  
  // Handle full ISO strings by extracting time
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24Hour
    });
  }
  
  // Handle simple HH:MM format
  const [hours, minutes] = timeString.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return timeString; // Return original if invalid
  }
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  });
};

/**
 * Formats a date and time together
 * @param {string} dateString - Date string
 * @param {string} timeString - Time string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString, { shortMonth: true });
  const formattedTime = formatTime(timeString);
  
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Formats a price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = 'USD') => {
  if (price === undefined || price === null || isNaN(price)) {
    return '';
  }
  
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Formats a number with commas and decimal places
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 2) => {
  if (number === undefined || number === null || isNaN(number)) {
    return '';
  }
  
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '';
  }
  
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Formats a distance in kilometers
 * @param {number} distance - Distance in kilometers
 * @param {boolean} includeUnit - Whether to include the unit (default: true)
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance, includeUnit = true) => {
  if (distance === undefined || distance === null || isNaN(distance)) {
    return '';
  }
  
  const formattedDistance = formatNumber(distance, 1);
  return includeUnit ? `${formattedDistance} km` : formattedDistance;
};

/**
 * Formats a phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // If not standard format, return with basic formatting
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

/**
 * Formats time ago (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time ago
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString, { shortMonth: true });
  }
};
