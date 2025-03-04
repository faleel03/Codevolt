import React, { createContext, useState, useEffect } from 'react';
import { getStations, getUserBookings } from '../services/bookingService';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Load stations on mount
  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <BookingContext.Provider value={{
      stations,
      userBookings,
      loading,
      error,
      fetchStations,
      fetchUserBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};
