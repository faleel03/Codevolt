import React, { useState, useEffect } from 'react';
import { useBooking } from '../hooks/useBooking';

// Components
import ReservationCard from '../components/dashboard/ReservationCard';
import WaitlistCard from '../components/booking/WaitlistCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Notification from '../components/common/Notification';

const ReservationHistory = () => {
  const { userBookings, waitlistItems, getUserBookings, getUserWaitlist, cancelBooking, loading } = useBooking();
  
  const [view, setView] = useState('upcoming'); // upcoming, past, waitlist
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Fetch bookings and waitlist on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getUserBookings(),
          getUserWaitlist()
        ]);
      } catch (err) {
        setError('Failed to load reservation data. Please try again.');
      }
    };
    
    fetchData();
  }, [getUserBookings, getUserWaitlist]);
  
  // Filter bookings based on current view
  const getFilteredBookings = () => {
    if (!userBookings) return [];
    
    const now = new Date();
    
    if (view === 'upcoming') {
      return userBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const [hours, minutes] = booking.startTime.split(':').map(Number);
        bookingDate.setHours(hours, minutes, 0, 0);
        return bookingDate >= now;
      }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const [hoursA, minutesA] = a.startTime.split(':').map(Number);
        const [hoursB, minutesB] = b.startTime.split(':').map(Number);
        
        dateA.setHours(hoursA, minutesA, 0, 0);
        dateB.setHours(hoursB, minutesB, 0, 0);
        
        return dateA - dateB;
      });
    } else if (view === 'past') {
      return userBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const [hours, minutes] = booking.startTime.split(':').map(Number);
        bookingDate.setHours(hours, minutes, 0, 0);
        return bookingDate < now;
      }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const [hoursA, minutesA] = a.startTime.split(':').map(Number);
        const [hoursB, minutesB] = b.startTime.split(':').map(Number);
        
        dateA.setHours(hoursA, minutesA, 0, 0);
        dateB.setHours(hoursB, minutesB, 0, 0);
        
        return dateB - dateA; // Descending order for past bookings
      });
    }
    
    return [];
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        setSuccess('Reservation cancelled successfully.');
        // Refresh bookings
        getUserBookings();
      } else {
        setError('Failed to cancel reservation.');
      }
    } catch (err) {
      setError('An error occurred while cancelling the reservation.');
    }
  };
  
  // Handle waitlist cancellation
  const handleCancelWaitlist = async (waitlistId) => {
    try {
      // In a real app, we would call an API endpoint
      setSuccess('Removed from waitlist successfully.');
      // Refresh waitlist
      getUserWaitlist();
    } catch (err) {
      setError('An error occurred while removing from the waitlist.');
    }
  };
  
  const filteredBookings = getFilteredBookings();
  
  if (loading && (!userBookings || !waitlistItems)) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader size="lg" label="Loading reservation history..." />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservation History</h1>
      </div>
      
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Notification
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          autoClose
          duration={5000}
        />
      )}
      
      {/* View toggle */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            view === 'upcoming'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setView('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            view === 'past'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setView('past')}
        >
          Past
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            view === 'waitlist'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setView('waitlist')}
        >
          Waitlist {waitlistItems?.length > 0 && `(${waitlistItems.length})`}
        </button>
      </div>
      
      {/* Reservation list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {view === 'waitlist' ? (
          // Waitlist items
          waitlistItems && waitlistItems.length > 0 ? (
            waitlistItems.map((item) => (
              <WaitlistCard
                key={item.id}
                waitlistItem={item}
                onCancel={() => handleCancelWaitlist(item.id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No waitlist entries</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're not currently on any waitlists.
                  </p>
                </div>
              </Card>
            </div>
          )
        ) : (
          // Bookings (upcoming or past)
          filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <ReservationCard
                key={booking.id}
                reservation={booking}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {view === 'upcoming' ? 'No upcoming reservations' : 'No past reservations'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {view === 'upcoming' 
                      ? "You don't have any upcoming charging sessions scheduled."
                      : "You don't have any past charging sessions."
                    }
                  </p>
                  {view === 'upcoming' && (
                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => window.location.href = '/booking'}
                      >
                        Book a Charging Slot
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReservationHistory;
