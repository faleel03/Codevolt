import api, { mockApiCall } from './api';

// Mock data for bookings
const MOCK_BOOKINGS = [
  {
    id: 'booking-1',
    stationId: 'station-1',
    stationName: 'Downtown Charging Hub',
    slotId: 's1-8',
    slotType: 'L3',
    date: '2025-03-04',
    startTime: '14:00',
    endTime: '15:30',
    status: 'confirmed',
    soc: 25,
    estimatedRange: 80,
    batteryCapacity: 'L3',
    createdAt: '2025-03-03T10:15:00Z'
  },
  {
    id: 'booking-2',
    stationId: 'station-3',
    stationName: 'Eastside Supercharger',
    slotId: 's3-2',
    slotType: 'L2',
    date: '2025-03-06',
    startTime: '09:00',
    endTime: '11:00',
    status: 'pending',
    soc: 40,
    estimatedRange: 120,
    batteryCapacity: 'L2',
    createdAt: '2025-03-02T18:30:00Z'
  }
];

// Mock waitlist data
const MOCK_WAITLIST = [
  {
    id: 'waitlist-1',
    stationId: 'station-2',
    stationName: 'Westside EV Station',
    date: '2025-03-04',
    preferredTimeSlot: 'afternoon',
    status: 'waiting',
    position: 2,
    soc: 15,
    estimatedRange: 50,
    batteryCapacity: 'L2',
    createdAt: '2025-03-03T09:20:00Z'
  }
];

// Mock slot availability data
const MOCK_AVAILABILITY = {
  'station-1': {
    '2025-03-04': [
      { id: 's1-1', type: 'L2', time: '08:00-10:00', available: true },
      { id: 's1-1', type: 'L2', time: '10:00-12:00', available: false },
      { id: 's1-1', type: 'L2', time: '12:00-14:00', available: true },
      { id: 's1-1', type: 'L2', time: '14:00-16:00', available: true },
      { id: 's1-2', type: 'L2', time: '08:00-10:00', available: false },
      { id: 's1-2', type: 'L2', time: '10:00-12:00', available: true },
      { id: 's1-2', type: 'L2', time: '12:00-14:00', available: false },
      { id: 's1-2', type: 'L2', time: '14:00-16:00', available: true },
      { id: 's1-3', type: 'L3', time: '08:00-09:00', available: true },
      { id: 's1-3', type: 'L3', time: '09:00-10:00', available: true },
      { id: 's1-3', type: 'L3', time: '10:00-11:00', available: false },
      { id: 's1-3', type: 'L3', time: '11:00-12:00', available: false },
      { id: 's1-3', type: 'L3', time: '12:00-13:00', available: true },
      { id: 's1-3', type: 'L3', time: '13:00-14:00', available: true },
      { id: 's1-3', type: 'L3', time: '14:00-15:00', available: false },
      { id: 's1-3', type: 'L3', time: '15:00-16:00', available: true }
    ]
  }
};

/**
 * Get all charging stations
 * @returns {Promise<Array>} Array of stations
 */
const MOCK_STATIONS = [
  {
    id: 'station-1',
    name: 'Downtown Charging Hub',
    address: '123 Main St, City Center',
    location: { lat: 40.7128, lng: -74.0060 },
    availableSlots: 3,
    totalSlots: 10,
    chargingTypes: ['L2', 'L3'],
    pricePerKwh: 0.25
  }
  // Add more mock stations as needed
];

export const getStations = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_STATIONS);
  }
  
  const response = await api.get('/stations');
  return response.stations;
};

/**
 * Get slot availability for a station and date
 * @param {string} stationId - ID of the station
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of available slots
 */
export const getSlotAvailability = async (stationId, date) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Check if we have mock data for this station and date
    if (MOCK_AVAILABILITY[stationId]?.[date]) {
      return mockApiCall(MOCK_AVAILABILITY[stationId][date]);
    }
    
    // Generate some random availability if we don't have mock data
    const randomSlots = [];
    for (let i = 1; i <= 3; i++) {
      for (let hour = 8; hour < 18; hour += 2) {
        randomSlots.push({
          id: `s${stationId.split('-')[1]}-${i}`,
          type: i <= 2 ? 'L2' : 'L3',
          time: `${hour}:00-${hour+2}:00`,
          available: Math.random() > 0.5
        });
      }
    }
    
    return mockApiCall(randomSlots);
  }
  
  const response = await api.get(`/stations/${stationId}/availability`, {
    params: { date }
  });
  
  return response.slots;
};

/**
 * Book a charging slot
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Booking details
 */
export const bookSlot = async (bookingData) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Create a new booking with a random ID
    const newBooking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    return mockApiCall(newBooking);
  }
  
  const response = await api.post('/bookings', bookingData);
  return response.booking;
};

/**
 * Cancel a booking
 * @param {string} bookingId - ID of the booking to cancel
 * @returns {Promise<void>}
 */
export const cancelBooking = async (bookingId) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall({ success: true });
  }
  
  await api.delete(`/bookings/${bookingId}`);
};

/**
 * Get user's booking history
 * @returns {Promise<Array>} Array of user's bookings
 */
// Add this function to your existing bookingService.js
export const getUserBookings = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_BOOKINGS);
  }
  
  const response = await api.get('/bookings/user');
  return response.bookings;
};

/**
 * Join waitlist for a station
 * @param {Object} waitlistData - Waitlist information
 * @returns {Promise<Object>} Waitlist entry details
 */
export const joinWaitlist = async (waitlistData) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Create a new waitlist entry with a random ID
    const newWaitlistItem = {
      id: `waitlist-${Date.now()}`,
      ...waitlistData,
      position: Math.floor(Math.random() * 5) + 1,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    
    return mockApiCall(newWaitlistItem);
  }
  
  const response = await api.post('/waitlist', waitlistData);
  return response.waitlistEntry;
};

/**
 * Get user's waitlist entries
 * @returns {Promise<Array>} Array of user's waitlist entries
 */
export const getUserWaitlist = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_WAITLIST);
  }
  
  const response = await api.get('/waitlist');
  return response.waitlistEntries;
};
