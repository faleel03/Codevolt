import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const StationsList = ({ stations, title = "Nearby Charging Stations", onSelectStation }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('distance'); // distance, availability, rating
  
  // Sort stations based on selected criteria
  const sortedStations = [...stations].sort((a, b) => {
    switch (sortBy) {
      case 'availability':
        const aAvailability = a.availableSlots / a.totalSlots;
        const bAvailability = b.availableSlots / b.totalSlots;
        return bAvailability - aAvailability;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
      default:
        return a.distance - b.distance;
    }
  });
  
  // Get color based on availability percentage
  const getAvailabilityColor = (availableSlots, totalSlots) => {
    const percentage = (availableSlots / totalSlots) * 100;
    
    if (percentage === 0) return 'text-red-500';
    if (percentage < 30) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const handleBookNow = (stationId, event) => {
    event.stopPropagation();
    navigate(`/booking?stationId=${stationId}`);
  };
  
  return (
    <Card title={title}>
      {/* Sorting Controls */}
      <div className="flex gap-2 mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
        <div className="flex gap-1">
          {[
            { value: 'distance', label: 'Distance' },
            { value: 'availability', label: 'Availability' },
            { value: 'rating', label: 'Rating' }
          ].map((option) => (
            <button
              key={option.value}
              className={`text-sm px-2 py-1 rounded-md ${
                sortBy === option.value
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stations List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedStations.length > 0 ? (
          sortedStations.map((station) => (
            <div
              key={station.id}
              className="py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => onSelectStation && onSelectStation(station)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{station.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{station.distance.toFixed(1)} km</span>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{station.address}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Availability: </span>
                  <span className={`font-medium ${getAvailabilityColor(station.availableSlots, station.totalSlots)}`}>
                    {station.availableSlots}/{station.totalSlots}
                  </span>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Charger Types: </span>
                  <span className="font-medium">{station.chargingTypes.join(', ')}</span>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Price: </span>
                  <span className="font-medium">${station.pricePerKwh}/kWh</span>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Rating: </span>
                  <span className="font-medium">{station.rating.toFixed(1)} ★</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={station.availableSlots > 0 ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={(e) => handleBookNow(station.id, e)}
                  disabled={station.availableSlots === 0}
                >
                  {station.availableSlots > 0 ? 'Book Now' : 'Join Waitlist'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://maps.google.com/?q=${station.location.lat},${station.location.lng}`, '_blank');
                  }}
                >
                  Directions
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No charging stations found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </Card>
  );
};

export default StationsList;
