import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBooking } from '../../hooks/useBooking';

const BookingForm = ({ station, onSuccess }) => {
  const { bookSlot, joinWaitlist, loading } = useBooking();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      stationId: station?.id || '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      soc: 50, // Default 50%
      estimatedRange: 100, // Default 100 km
      batteryCapacity: 'L2' // Default L2 charging
    }
  });
  
  // Available times for the dropdown (in a real app, these would be dynamic)
  const availableTimes = [];
  for (let hour = 8; hour < 20; hour++) {
    availableTimes.push(`${hour}:00`);
    availableTimes.push(`${hour}:30`);
  }
  
  // Calculate end time based on battery capacity and SoC
  const calculateEndTime = (startTime, soc, batteryCapacity) => {
    if (!startTime) return '';
    
    // Simple calculation - in a real app this would be more sophisticated
    // Lower SoC means more charging time needed
    const socFactor = (100 - soc) / 100;
    
    // Different charging speeds based on capacity
    let hoursNeeded;
    switch (batteryCapacity) {
      case 'L1':
        hoursNeeded = 4 * socFactor; // Slowest
        break;
      case 'L3':
        hoursNeeded = 1 * socFactor; // Fastest
        break;
      case 'L2':
      default:
        hoursNeeded = 2 * socFactor; // Medium
    }
    
    // Calculate end time
    const [hour, minute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hour, minute, 0);
    
    const endDate = new Date(startDate.getTime() + hoursNeeded * 60 * 60 * 1000);
    const endHour = endDate.getHours().toString().padStart(2, '0');
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHour}:${endMinute}`;
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (showWaitlist) {
        // Join waitlist
        const result = await joinWaitlist({
          ...data,
          stationName: station.name
        });
        
        if (result.success) {
          reset();
          onSuccess && onSuccess('waitlist', result.waitlistItem);
        }
      } else {
        // Book a slot
        const result = await bookSlot({
          ...data,
          stationName: station.name
        });
        
        if (result.success) {
          reset();
          onSuccess && onSuccess('booking', result.booking);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <Card title={showWaitlist ? 'Join Waitlist' : 'Book a Charging Slot'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Station Name (read-only) */}
          <div className="col-span-1 md:col-span-2">
            <Input
              id="stationName"
              label="Station"
              value={station?.name}
              disabled
            />
          </div>
          
          {/* Date */}
          <div>
            <Input
              id="date"
              label="Date"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              {...register('date', { required: 'Date is required' })}
              error={errors.date?.message}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              {...register('startTime', { required: 'Start time is required' })}
            >
              <option value="">Select a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
            )}
          </div>
          
          {/* EV Details */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-3">EV Details</h3>
          </div>
          
          {/* State of Charge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current State of Charge (SoC)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="flex-grow mr-3"
                {...register('soc', { 
                  required: 'SoC is required',
                  min: { value: 0, message: 'SoC must be at least 0%' },
                  max: { value: 100, message: 'SoC cannot exceed 100%' }
                })}
              />
              <span className="w-12 text-right font-medium">
                {errors.soc?.message || `${register('soc').value || 50}%`}
              </span>
            </div>
          </div>
          
          {/* Estimated Range */}
          <div>
            <Input
              id="estimatedRange"
              label="Estimated Range (km)"
              type="number"
              required
              min="0"
              {...register('estimatedRange', { 
                required: 'Range is required',
                min: { value: 0, message: 'Range must be positive' }
              })}
              error={errors.estimatedRange?.message}
            />
          </div>
          
          {/* Battery Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Battery Capacity
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              {...register('batteryCapacity', { required: 'Battery capacity is required' })}
            >
              <option value="L1">L1 - 120V (Slow Charging)</option>
              <option value="L2">L2 - 240V (Standard Charging)</option>
              <option value="L3">L3 - 480V (Fast Charging)</option>
            </select>
            {errors.batteryCapacity && (
              <p className="mt-1 text-sm text-red-500">{errors.batteryCapacity.message}</p>
            )}
          </div>
          
          {/* Additional Notes */}
          <div className="col-span-1 md:col-span-2">
            <Input
              id="notes"
              label="Additional Notes (optional)"
              type="textarea"
              {...register('notes')}
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              type="submit"
              variant={showWaitlist ? 'secondary' : 'primary'}
              isLoading={loading}
              className="flex-1"
            >
              {showWaitlist ? 'Join Waitlist' : 'Book Now'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowWaitlist(!showWaitlist)}
              className="flex-1"
            >
              {showWaitlist ? 'Try to Book Instead' : 'Join Waitlist Instead'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default BookingForm;
