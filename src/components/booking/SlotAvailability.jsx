import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { useBooking } from '../../hooks/useBooking';

const SlotAvailability = ({ stationId, date, onSelectSlot }) => {
  const { checkAvailability, loading } = useBooking();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Fetch slot availability when station or date changes
  useEffect(() => {
    if (stationId && date) {
      const fetchData = async () => {
        const data = await checkAvailability(stationId, date);
        setSlots(data || []);
        // Clear selection when the data changes
        setSelectedSlot(null);
      };
      
      fetchData();
    }
  }, [stationId, date, checkAvailability]);
  
  // Function to group slots by type
  const groupSlotsByType = (slots) => {
    const groupedSlots = {};
    
    slots.forEach(slot => {
      if (!groupedSlots[slot.type]) {
        groupedSlots[slot.type] = [];
      }
      groupedSlots[slot.type].push(slot);
    });
    
    return groupedSlots;
  };
  
  // Function to handle slot selection
  const handleSelectSlot = (slot) => {
    if (!slot.available) return;
    
    setSelectedSlot(slot);
    onSelectSlot && onSelectSlot(slot);
  };
  
  // Group the slots by type
  const groupedSlots = groupSlotsByType(slots);
  
  // Legend items for the availability status
  const legendItems = [
    { label: 'Available', color: 'bg-green-500' },
    { label: 'Selected', color: 'bg-blue-500' },
    { label: 'Unavailable', color: 'bg-red-500' }
  ];
  
  if (loading) {
    return (
      <Card title="Slot Availability">
        <div className="flex justify-center py-8">
          <Loader label="Loading availability..." />
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Slot Availability">
      {slots.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">
            No availability data found for this date. Please select a different date or station.
          </p>
        </div>
      ) : (
        <div>
          {/* Color legend */}
          <div className="flex justify-center gap-4 mb-4">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
          
          {/* Slots by type */}
          <div className="space-y-6">
            {Object.keys(groupedSlots).map((type) => (
              <div key={type}>
                <h3 className="font-medium mb-2">Level {type.substring(1)} Charging</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {groupedSlots[type].map((slot, idx) => {
                    // Determine the background color based on availability and selection
                    let bgColor;
                    if (selectedSlot && selectedSlot.id === slot.id && selectedSlot.time === slot.time) {
                      bgColor = 'bg-blue-500 text-white'; // Selected
                    } else if (slot.available) {
                      bgColor = 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'; // Available
                    } else {
                      bgColor = 'bg-red-100 dark:bg-red-900 opacity-60 cursor-not-allowed'; // Unavailable
                    }
                    
                    return (
                      <button
                        key={`${slot.id}-${slot.time}-${idx}`}
                        className={`py-2 px-3 rounded-md text-center ${bgColor} transition-colors`}
                        onClick={() => handleSelectSlot(slot)}
                        disabled={!slot.available}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SlotAvailability;
