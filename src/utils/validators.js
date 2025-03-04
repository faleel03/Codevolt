/**
 * Utility functions for data validation
 */

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates state of charge (SoC) input
 * @param {number} soc - State of charge percentage
 * @returns {boolean} True if the SoC is valid
 */
export const isValidSoC = (soc) => {
  return soc !== undefined && soc !== null && !isNaN(soc) && soc >= 0 && soc <= 100;
};

/**
 * Validates an estimated range
 * @param {number} range - Range in kilometers
 * @returns {boolean} True if the range is valid
 */
export const isValidRange = (range) => {
  return range !== undefined && range !== null && !isNaN(range) && range > 0;
};

/**
 * Validates a date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if the date is valid
 */
export const isValidDate = (dateString) => {
  // Check if the date is in the correct format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  // Check if the date is valid
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (isNaN(timestamp)) {
    return false;
  }
  
  // Check if the date parts match the input
  return (
    date.toISOString().split('T')[0] === dateString
  );
};

/**
 * Validates a time string
 * @param {string} timeString - Time in HH:MM format
 * @returns {boolean} True if the time is valid
 */
export const isValidTime = (timeString) => {
  // Check if the time is in the correct format
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(timeString);
};

/**
 * Validates a booking form
 * @param {Object} formData - Booking form data
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateBookingForm = (formData) => {
  const errors = {};
  
  // Required fields
  if (!formData.stationId) {
    errors.stationId = 'Station is required';
  }
  
  if (!formData.date) {
    errors.date = 'Date is required';
  } else if (!isValidDate(formData.date)) {
    errors.date = 'Invalid date format';
  }
  
  if (!formData.startTime) {
    errors.startTime = 'Start time is required';
  } else if (!isValidTime(formData.startTime)) {
    errors.startTime = 'Invalid time format';
  }
  
  if (!isValidSoC(formData.soc)) {
    errors.soc = 'State of Charge must be between 0 and 100%';
  }
  
  if (!isValidRange(formData.estimatedRange)) {
    errors.estimatedRange = 'Range must be a positive number';
  }
  
  if (!formData.batteryCapacity) {
    errors.batteryCapacity = 'Battery capacity is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateUserRegistration = (userData) => {
  const errors = {};
  
  // Check name
  if (!userData.name || userData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Check email
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Check password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Check password confirmation
  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
