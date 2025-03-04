import api, { mockApiCall } from './api';

// Mock stations data for development
const MOCK_STATIONS = [
  {
    id: 'station-1',
    name: 'Downtown Charging Hub',
    address: '123 Main St, City Center',
    location: { lat: 40.7128, lng: -74.0060 },
    availableSlots: 3,
    totalSlots: 10,
    chargingTypes: ['L2', 'L3'],
    pricePerKwh: 0.25,
    distance: 1.2, // in km
    rating: 4.5,
    openingHours: '24/7',
  },
  {
    id: 'station-2',
    name: 'Westside EV Station',
    address: '456 West Ave, Westside',
    location: { lat: 40.7138, lng: -74.0170 },
    availableSlots: 0,
    totalSlots: 5,
    chargingTypes: ['L2'],
    pricePerKwh: 0.20,
    distance: 2.5, // in km
    rating: 4.2,
    openingHours: '6AM - 10PM',
  },
  {
    id: 'station-3',
    name: 'Eastside Supercharger',
    address: '789 East Blvd, Eastside',
    location: { lat: 40.7200, lng: -73.9950 },
    availableSlots: 5,
    totalSlots: 8,
    chargingTypes: ['L1', 'L2', 'L3'],
    pricePerKwh: 0.30,
    distance: 3.1, // in km
    rating: 4.8,
    openingHours: '24/7',
  },
  {
    id: 'station-4',
    name: 'North Shopping Mall',
    address: '101 North Mall, Shopping District',
    location: { lat: 40.7350, lng: -74.0080 },
    availableSlots: 2,
    totalSlots: 6,
    chargingTypes: ['L2', 'L3'],
    pricePerKwh: 0.28,
    distance: 4.2, // in km
    rating: 3.9,
    openingHours: '8AM - 9PM',
  },
  {
    id: 'station-5',
    name: 'South Park Charging',
    address: '202 South Park, Green Area',
    location: { lat: 40.7080, lng: -74.0150 },
    availableSlots: 6,
    totalSlots: 6,
    chargingTypes: ['L2'],
    pricePerKwh: 0.22,
    distance: 2.8, // in km
    rating: 4.0,
    openingHours: '7AM - 8PM',
  }
];

// Detailed station data with slots
const MOCK_STATION_DETAILS = {
  'station-1': {
    ...MOCK_STATIONS[0],
    slots: [
      { id: 's1-1', type: 'L2', available: true, power: '7.2kW' },
      { id: 's1-2', type: 'L2', available: true, power: '7.2kW' },
      { id: 's1-3', type: 'L2', available: true, power: '7.2kW' },
      { id: 's1-4', type: 'L3', available: false, power: '50kW' },
      { id: 's1-5', type: 'L3', available: false, power: '50kW' },
      { id: 's1-6', type: 'L3', available: false, power: '50kW' },
      { id: 's1-7', type: 'L3', available: false, power: '50kW' },
      { id: 's1-8', type: 'L3', available: false, power: '150kW' },
      { id: 's1-9', type: 'L3', available: false, power: '150kW' },
      { id: 's1-10', type: 'L3', available: false, power: '150kW' }
    ],
    amenities: ['Restrooms', 'Cafe', 'Wifi', 'Waiting Area'],
    photos: ['station1.jpg', 'station1-2.jpg'],
    reviews: [
      { user: 'John D.', rating: 5, comment: 'Great location, always available!' },
      { user: 'Sarah M.', rating: 4, comment: 'Fast charging but limited amenities.' }
    ]
  },
  // Define other stations similarly...
};

/**
 * Get all charging stations
 * @returns {Promise<Array>} Array of stations
 */
export const getStations = async () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return mockApiCall(MOCK_STATIONS);
  }
  
  const response = await api.get('/stations');
  return response.stations;
};

/**
 * Get details for a specific station
 * @param {string} stationId - ID of the station
 * @returns {Promise<Object>} Station details
 */
export const getStationDetails = async (stationId) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // If we have detailed mock data for this station
    if (MOCK_STATION_DETAILS[stationId]) {
      return mockApiCall(MOCK_STATION_DETAILS[stationId]);
    }
    
    // Otherwise find the station in our basic list and return it
    const station = MOCK_STATIONS.find(s => s.id === stationId);
    if (!station) {
      return mockApiCall(null, 500, true);
    }
    
    return mockApiCall(station);
  }
  
  const response = await api.get(`/stations/${stationId}`);
  return response.station;
};

/**
 * Get nearby stations based on coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in km
 * @returns {Promise<Array>} Array of nearby stations
 */
export const getNearbyStations = async (lat, lng, radius = 5) => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // For mocked data, we'll just return all stations
    // In a real app, this would filter based on location
    return mockApiCall(MOCK_STATIONS);
  }
  
  const response = await api.get('/stations/nearby', {
    params: { lat, lng, radius }
  });
  
  return response.stations;
};
