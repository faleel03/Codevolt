import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useauth';
import { useBooking } from '../hooks/useBooking';
import { useNotification } from '../hooks/useNotification';
import { useStations } from '../hooks/useStations';

// Components
import StationsList from '../components/dashboard/StationsList';
import ReservationCard from '../components/dashboard/ReservationCard';
import PriorityStatus from '../components/dashboard/PriorityStatus';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Notification from '../components/common/Notification';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  // Add sample stations directly in the component
  const [sampleStations] = useState([
    {
      id: 'station-1',
      name: 'Downtown Charging Hub',
      address: '123 Main St, City Center',
      availableSlots: 3,
      totalSlots: 10,
      chargingTypes: ['L2', 'L3'],
      distance: 1.2,
      rating: 4.5
    },
    {
      id: 'station-2',
      name: 'Westside EV Station',
      address: '456 Park Ave, West District',
      availableSlots: 5,
      totalSlots: 8,
      chargingTypes: ['L2'],
      distance: 2.5,
      rating: 4.2
    },
    {
      id: 'station-3',
      name: 'Eastside Rapid Chargers',
      address: '789 Electric Blvd, East End',
      availableSlots: 1,
      totalSlots: 6,
      chargingTypes: ['L3'],
      distance: 3.7,
      rating: 4.8
    },
    {
      id: 'station-4',
      name: 'Northside Power Station',
      address: '234 Energy Lane, North District',
      availableSlots: 4,
      totalSlots: 12,
      chargingTypes: ['L2', 'L3'],
      distance: 4.1,
      rating: 4.3
    },
    {
      id: 'station-5',
      name: 'Southside Quick Charge',
      address: '567 Battery Road, South End',
      availableSlots: 2,
      totalSlots: 5,
      chargingTypes: ['L3'],
      distance: 2.9,
      rating: 4.6
    },
    {
      id: 'station-6',
      name: 'Central Mall Charging',
      address: '890 Shopping Center Blvd',
      availableSlots: 7,
      totalSlots: 15,
      chargingTypes: ['L2'],
      distance: 1.8,
      rating: 4.0
    },
    {
      id: 'station-7',
      name: 'Airport EV Station',
      address: '123 Terminal Drive',
      availableSlots: 6,
      totalSlots: 20,
      chargingTypes: ['L2', 'L3'],
      distance: 8.5,
      rating: 4.7
    },
    {
      id: 'station-8',
      name: 'Highway Rest Stop',
      address: 'Interstate 95, Mile 42',
      availableSlots: 3,
      totalSlots: 8,
      chargingTypes: ['L3'],
      distance: 12.3,
      rating: 4.4
    },
    {
      id: 'station-9',
      name: 'Tech Park Charging',
      address: '456 Innovation Way',
      availableSlots: 5,
      totalSlots: 10,
      chargingTypes: ['L2', 'L3'],
      distance: 5.6,
      rating: 4.9
    },
    {
      id: 'station-10',
      name: 'Riverside Chargers',
      address: '789 Waterfront Drive',
      availableSlots: 2,
      totalSlots: 6,
      chargingTypes: ['L2'],
      distance: 3.2,
      rating: 4.1
    }
  ]);
  const { stations, loading: stationsLoading } = useStations();
  const { userBookings, waitlistItems, fetchUserBookings, loading: bookingLoading } = useBooking();
  const { notifications, fetchNotifications, loading: notificationsLoading } = useNotification();
  
  const [error, setError] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Check for success message in location state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the location state
      window.history.replaceState({}, document.title);
      
      // Auto-dismiss success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  // Mock vehicle state - in a real app, this would come from an API or IoT device
  const [vehicleState, setVehicleState] = useState({
    soc: 35, // Current battery level (%)
    estimatedRange: 120, // km
    batteryCapacity: 'L2'
  });
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all necessary data
        await Promise.all([
          fetchUserBookings(),
          fetchNotifications()
        ]);
        setIsDataLoaded(true);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data loading error:', err);
        setIsDataLoaded(true); // Set to true even on error to prevent infinite loading
      }
    };
    
    fetchData();
  }, [fetchUserBookings, fetchNotifications]);
  
  // Handle reservation cancellation
  const handleCancelReservation = (reservationId) => {
    const { cancelBooking } = useBooking();
    if (cancelBooking) {
      cancelBooking(reservationId)
        .then(() => {
          setUpcomingReservation(null);
        })
        .catch(err => {
          console.error('Error canceling reservation:', err);
          setError('Failed to cancel reservation. Please try again.');
        });
    }
  };
  
  // Find the next upcoming reservation
  useEffect(() => {
    if (!userBookings || userBookings.length === 0) {
      setUpcomingReservation(null);
      return;
    }
    
    const now = new Date();
    
    // Filter and sort upcoming reservations
    const upcoming = userBookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        const [bookingHours, bookingMinutes] = booking.startTime.split(':').map(Number);
        bookingDate.setHours(bookingHours, bookingMinutes, 0, 0);
        return bookingDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const [hoursA, minutesA] = a.startTime.split(':').map(Number);
        const [hoursB, minutesB] = b.startTime.split(':').map(Number);
        
        dateA.setHours(hoursA, minutesA, 0, 0);
        dateB.setHours(hoursB, minutesB, 0, 0);
        
        return dateA - dateB;
      });
    
    setUpcomingReservation(upcoming.length > 0 ? upcoming[0] : null);
  }, [userBookings]);
  
  // Use sample stations instead of stations from useStations
  const nearbyStations = sampleStations.slice(0, 3);
  
  // Handle Find Stations button click without relying on fetchStations
  const handleFindStations = () => {
    // Store sample stations in sessionStorage for use in StationLocator
    sessionStorage.setItem('sampleStations', JSON.stringify(sampleStations));
    navigate('/stations');
  };
  
  // Loading state
  const isLoading = (stationsLoading || bookingLoading || notificationsLoading) && !isDataLoaded;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader size="lg" label="Loading dashboard..." />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="primary"
          onClick={() => navigate('/booking')}
        >
          Book a Slot
        </Button>
      </div>
      
      {error && (
        <Notification 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      {successMessage && (
        <Notification 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage('')} 
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* First column - Booking status */}
        <div className="space-y-6">
          {/* Vehicle Status */}
          <PriorityStatus 
            user={user} 
            vehicleState={vehicleState} 
          />
          
          {/* Upcoming Reservation */}
          {upcomingReservation ? (
            <ReservationCard 
              reservation={upcomingReservation} 
              onCancel={handleCancelReservation} 
            />
          ) : (
            <Card title="No Upcoming Reservations">
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No upcoming reservations</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You don't have any charging sessions scheduled.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/booking')}
                  >
                    Book a Charging Slot
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Waitlist Status */}
          {waitlistItems && waitlistItems.length > 0 && (
            <Card title="Your Waitlist Status">
              <div className="space-y-3">
                {waitlistItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.stationName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Position #{item.position} • {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/notifications')}
                    >
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Second and third columns - Map and Stations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Notifications */}
          {notifications && notifications.length > 0 && (
            <Card title="Recent Notifications">
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div 
                    key={`${notification.id}-${index}`}
                    className={`p-3 rounded-md border-l-4 ${
                      notification.read ? 'border-gray-300 bg-gray-50' : 'border-primary-500 bg-primary-50'
                    } dark:bg-gray-800`}
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/notifications')}
                  >
                    View All Notifications
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Nearby Stations */}
          <StationsList
            stations={nearbyStations}
            title="Nearby Charging Stations"
            onSelectStation={(station) => navigate(`/stations?id=${station.id}`)}
          />
          
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleFindStations}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Find Stations
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => navigate('/history')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => navigate('/profile')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Button>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="danger"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                if (logout) {
                  logout();
                }
                navigate('/login');
              }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
