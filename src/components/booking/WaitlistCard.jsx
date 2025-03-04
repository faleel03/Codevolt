import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useBooking } from '../../hooks/useBooking';

const WaitlistCard = ({ waitlistItem, onCancel }) => {
  const { loading } = useBooking();
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Determine if the waitlist is priority based on SoC
  const isPriority = waitlistItem.soc < 20;
  
  // Get appropriate status indicator color
  const getStatusColor = () => {
    if (waitlistItem.status === 'notified') return 'bg-green-500';
    if (isPriority) return 'bg-amber-500';
    return 'bg-blue-500';
  };
  
  return (
    <Card 
      title="Waitlist Details"
      className={`border-l-4 ${isPriority ? 'border-amber-500' : 'border-blue-500'}`}
    >
      <div className="space-y-4">
        {/* Station and Time Info */}
        <div>
          <h3 className="font-medium text-lg">{waitlistItem.stationName}</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {formatDate(waitlistItem.date)}
            {waitlistItem.preferredTimeSlot && ` • ${waitlistItem.preferredTimeSlot} preferred`}
          </p>
        </div>
        
        {/* Status and Position */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="font-medium">
            {waitlistItem.status === 'notified' ? 'Slot Available!' : `Position #${waitlistItem.position} in queue`}
          </span>
        </div>
        
        {/* Priority Badge */}
        {isPriority && (
          <div className="inline-block bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-md text-sm font-medium">
            Priority Status (Low Battery)
          </div>
        )}
        
        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current SoC</p>
            <p className="font-medium">{waitlistItem.soc}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Range</p>
            <p className="font-medium">{waitlistItem.estimatedRange} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Battery Type</p>
            <p className="font-medium">{waitlistItem.batteryCapacity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Added on</p>
            <p className="font-medium">{new Date(waitlistItem.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {waitlistItem.status === 'notified' ? (
            <Button 
              variant="primary"
              className="flex-grow"
              onClick={() => window.location.href = `/booking?stationId=${waitlistItem.stationId}&date=${waitlistItem.date}`}
            >
              Book Now
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="flex-grow"
              onClick={() => onCancel && onCancel(waitlistItem.id)}
              isLoading={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WaitlistCard;
