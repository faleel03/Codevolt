import { useState, useEffect } from 'react';
import { getStations, getStationDetails } from '../services/stationService';

export const useStations = (stationId = null) => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all stations or a specific station
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (stationId) {
          // Fetch a specific station
          const stationData = await getStationDetails(stationId);
          setSelectedStation(stationData);
        } else {
          // Fetch all stations
          const stationsData = await getStations();
          setStations(stationsData);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch station data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  // Function to select a station
  const selectStation = async (id) => {
    if (id === selectedStation?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stationData = await getStationDetails(id);
      setSelectedStation(stationData);
    } catch (err) {
      setError(err.message || 'Failed to fetch station details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate station availability percentage
  const getAvailabilityPercentage = (station) => {
    if (!station) return 0;
    const { availableSlots, totalSlots } = station;
    return totalSlots > 0 ? Math.round((availableSlots / totalSlots) * 100) : 0;
  };

  return {
    stations,
    selectedStation,
    loading,
    error,
    selectStation,
    getAvailabilityPercentage
  };
};
