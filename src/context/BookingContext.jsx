import React, { createContext, useState, useEffect } from 'react';
import { getStations, getUserBookings, getUserWaitlist, cancelBooking as apiCancelBooking } from '../services/bookingService';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [waitlistItems, setWaitlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stations
  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await getStations();
      setStations(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings();
      setUserBookings(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add the missing fetchUserWaitlist function
  const fetchUserWaitlist = async () => {
    try {
      setLoading(true);
      const data = await getUserWaitlist();
      setWaitlistItems(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await apiCancelBooking(bookingId);
      // Refresh bookings after cancellation
      await fetchUserBookings();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchStations();
    fetchUserBookings();
    fetchUserWaitlist();
  }, []);

  return (
    <BookingContext.Provider value={{
      stations,
      userBookings,
      waitlistItems,
      loading,
      error,
      fetchStations,
      fetchUserBookings,
      fetchUserWaitlist,
      cancelBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};
