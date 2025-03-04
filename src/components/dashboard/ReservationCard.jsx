import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useBooking } from '../../hooks/useBooking';

const ReservationCard = ({ reservation, onCancel }) => {
  const { cancelBooking, loading } = useBooking();
  
  // Format date and time for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if reservation is upcoming (today or in the future)
  const isUpcoming = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const reservationDate = new Date(reservation.date);
    reservationDate.setHours(0, 0, 0, 0);
    
    return reservationDate >= today;
  };
  
  // Calculate the time remaining until the reservation
  const getTimeRemaining = () => {
    const now = new Date();
    const reservationDate = new Date(reservation.date);
    const [hours, minutes] = reservation.startTime.split(':').map(Number);
    reservationDate.setHours(hours, minutes, 0, 0);
    
    const diffMs = reservationDate - now;
    
    // If the reservation is in the past, return empty string
    if (diffMs < 0) return '';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m remaining`;
    } else {
      return `${diffMinutes}m remaining`;
    }
  };
  
  // Handle cancel button click
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const result = await cancelBooking(reservation.id);
        if (result.success && onCancel) {
          onCancel(reservation.id);
        }
      } catch (error) {
        console.error('Error canceling reservation:', error);
      }
    }
  };
  
  // Determine card border color based on status
  const getBorderColor = () => {
    if (!isUpcoming()) return 'border-gray-300';
    
    const now = new Date();
    const reservationDate = new Date(reservation.date);
    const [hours, minutes] = reservation.startTime.split(':').map(Number);
    reservationDate.setHours(hours, minutes, 0, 0);
    
    const diffMs = reservationDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'border-red-500'; // Less than 1 hour
    if (diffHours < 3) return 'border-amber-500'; // Less than 3 hours
    return 'border-green-500'; // More than 3 hours
  };
  
  return (
    <Card 
      className={`border-l-4 ${getBorderColor()}`} 
      title={isUpcoming() ? 'Upcoming Reservation' : 'Past Reservation'}
    >
      <div className="space-y-4">
        {/* Station and Time Info */}
        <div>
          <h3 className="font-medium text-lg">{reservation.stationName}</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              {formatDate(reservation.date)} • {reservation.startTime} - {reservation.endTime}
            </p>
            {isUpcoming() && (
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {getTimeRemaining()}
              </span>
            )}
          </div>
        </div>
        
        {/* Slot and Status Info */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Slot</p>
            <p className="font-medium">{reservation.slotId} ({reservation.slotType})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium capitalize">{reservation.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Charging Level</p>
            <p className="font-medium">{reservation.batteryCapacity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Initial SoC</p>
            <p className="font-medium">{reservation.soc}%</p>
          </div>
        </div>
        
        {/* Actions */}
        {isUpcoming() && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-grow"
              onClick={handleCancel}
              isLoading={loading}
            >
              Cancel Reservation
            </Button>
            
            <Button
              variant="primary"
              className="flex-grow"
              onClick={() => window.open(`https://maps.google.com/?q=${reservation.stationName}`, '_blank')}
            >
              Get Directions
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReservationCard;
