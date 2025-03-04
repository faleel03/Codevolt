import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStations } from '../hooks/useStations';
import { useBooking } from '../hooks/useBooking';

// Components
import MapComponent from '../components/map/MapComponent';
import StationsList from '../components/dashboard/StationsList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';

const StationLocator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stations, loading, error, fetchStations } = useStations();
  
  const [selectedStation, setSelectedStation] = useState(null);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    chargingTypes: [],
    minAvailability: 0,
    maxDistance: 100,
    showOnlyAvailable: false
  });
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stationId = params.get('id');
    
    if (stationId && stations.length > 0) {
      const station = stations.find(s => s.id === stationId);
      if (station) {
        setSelectedStation(station);
      }
    }
  }, [location.search, stations]);
  
  // Fetch stations on component mount
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);
  
  // Filter stations based on search and filters
  useEffect(() => {
    if (!stations) return;
    
    let result = [...stations];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(station => 
        station.name.toLowerCase().includes(term) || 
        station.address.toLowerCase().includes(term)
      );
    }
    
    // Apply filters
    if (filters.chargingTypes.length > 0) {
      result = result.filter(station => 
        filters.chargingTypes.some(type => station.chargingTypes.includes(type))
      );
    }
    
    if (filters.showOnlyAvailable) {
      result = result.filter(station => station.availableSlots > 0);
    }
    
    if (filters.minAvailability > 0) {
      result = result.filter(station => {
        const availabilityPercentage = (station.availableSlots / station.totalSlots) * 100;
        return availabilityPercentage >= filters.minAvailability;
      });
    }
    
    if (filters.maxDistance < 100) {
      result = result.filter(station => station.distance <= filters.maxDistance);
    }
    
    setFilteredStations(result);
  }, [stations, searchTerm, filters]);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle charging type filter toggle
  const toggleChargingType = (type) => {
    setFilters(prev => {
      const types = [...prev.chargingTypes];
      
      if (types.includes(type)) {
        return {
          ...prev,
          chargingTypes: types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          chargingTypes: [...types, type]
        };
      }
    });
  };
  
  // Navigate to booking page for the selected station
  const handleBookSelectedStation = () => {
    if (selectedStation) {
      navigate(`/booking?stationId=${selectedStation.id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader size="lg" label="Loading stations..." />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <Button
          variant={selectedStation ? 'primary' : 'outline'}
          disabled={!selectedStation}
          onClick={handleBookSelectedStation}
        >
          {selectedStation ? `Book at ${selectedStation.name}` : 'Select a Station'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar with filters and list */}
        <div className="space-y-6">
          {/* Search and filters */}
          <Card title="Find Stations">
            <div className="space-y-4">
              <Input
                label="Search"
                placeholder="Search by name or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Charger Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {['L1', 'L2', 'L3'].map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.chargingTypes.includes(type)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => toggleChargingType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Distance: {filters.maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.maxDistance}
                  onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="available-only"
                  type="checkbox"
                  checked={filters.showOnlyAvailable}
                  onChange={(e) => handleFilterChange('showOnlyAvailable', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="available-only" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Show only available stations
                </label>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      chargingTypes: [],
                      minAvailability: 0,
                      maxDistance: 100,
                      showOnlyAvailable: false
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Station list */}
          <div className="hidden lg:block">
            <StationsList
              stations={filteredStations}
              title={`Stations (${filteredStations.length})`}
              onSelectStation={(station) => setSelectedStation(station)}
            />
          </div>
        </div>
        
        {/* Map */}
        <div className="lg:col-span-2">
          <Card noPadding title="Station Map">
            <MapComponent
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={(station) => setSelectedStation(station)}
              height="600px"
            />
          </Card>
          
          {/* Station list for mobile */}
          <div className="block lg:hidden mt-6">
            <StationsList
              stations={filteredStations}
              title={`Stations (${filteredStations.length})`}
              onSelectStation={(station) => setSelectedStation(station)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationLocator;
