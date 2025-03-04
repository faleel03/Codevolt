import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStations } from '../hooks/useStations';
import { useBooking } from '../hooks/useBooking';

// Components
import BookingForm from '../components/booking/BookingForm';
import SlotAvailability from '../components/booking/SlotAvailability';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Notification from '../components/common/Notification';

const SlotBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStation, selectStation, loading: stationLoading } = useStations();
  const { loading: bookingLoading } = useBooking();
  
  const [stationId, setStationId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notification, setNotification] = useState(null);
  const [step, setStep] = useState(1); // 1: Select station, 2: Book slot
  
  // Get station ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('stationId');
    const date = params.get('date');
    
    if (id) {
      setStationId(id);
      selectStation(id);
      setStep(2); // Skip to booking step if station is provided
    }
    
    if (date) {
      setBookingDate(date);
    }
  }, [location.search, selectStation]);
  
  // Handle station selection
  const handleStationSelect = (station) => {
    setStationId(station.id);
    navigate(`/booking?stationId=${station.id}`);
  };
  
  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };
  
  // Handle successful booking
  const handleBookingSuccess = (type, item) => {
    if (type === 'booking') {
      setNotification({
        type: 'success',
        title: 'Booking Confirmed!',
        message: `Your reservation at ${item.stationName} on ${item.date} at ${item.startTime} has been confirmed.`
      });
    } else {
      setNotification({
        type: 'success',
        title: 'Joined Waitlist',
        message: `You've been added to the waitlist for ${item.stationName} on ${item.date}. You're in position #${item.position}.`
      });
    }
    
    // Reset selection
    setSelectedSlot(null);
  };
  
  const loading = stationLoading || bookingLoading;
  
  if (loading && !selectedStation) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader size="lg" label="Loading station details..." />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Book a Charging Slot</h1>
        {step === 2 && (
          <Button
            variant="outline"
            onClick={() => navigate('/stations')}
          >
            Change Station
          </Button>
        )}
      </div>
      
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          autoClose
          duration={8000}
          onClose={() => setNotification(null)}
        />
      )}
      
      {step === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Station Selection Guide */}
          <Card title="Select a Charging Station">
            <div className="py-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No station selected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please select a charging station first to view availability and book a slot.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => navigate('/stations')}
                >
                  Find a Station
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Station Details and Slot Selection */}
          <div className="space-y-6">
            {/* Station Information */}
            {selectedStation && (
              <Card title="Station Information">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedStation.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{selectedStation.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Availability</span>
                      <p className="font-medium">
                        <span className={selectedStation.availableSlots === 0 ? 'text-red-500' : 'text-green-500'}>
                          {selectedStation.availableSlots}
                        </span>
                        /{selectedStation.totalSlots} slots
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Charger Types</span>
                      <p className="font-medium">{selectedStation.chargingTypes.join(', ')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                      <p className="font-medium">${selectedStation.pricePerKwh}/kWh</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Hours</span>
                      <p className="font-medium">{selectedStation.openingHours}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`https://maps.google.com/?q=${selectedStation.location.lat},${selectedStation.location.lng}`, '_blank')}
                    >
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/stations?id=${selectedStation.id}`)}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Slot Availability */}
            <SlotAvailability
              stationId={stationId}
              date={bookingDate}
              onSelectSlot={handleSlotSelect}
            />
          </div>
          
          {/* Booking Form */}
          <div>
            <BookingForm
              station={selectedStation}
              onSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;
