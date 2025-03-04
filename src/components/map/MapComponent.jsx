import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import StationMarker from './StationMarker';
import Loader from '../common/Loader';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map view updates
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

// Main map component
const MapComponent = ({ 
  stations, 
  center = [40.7128, -74.0060], // Default: New York City
  zoom = 13,
  selectedStation,
  onSelectStation,
  height = '500px'
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  // Center the map on user location if available
  const mapCenter = userLocation || center;
  
  return (
    <div className="relative" style={{ height }}>
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Loader size="lg" label="Loading map..." />
        </div>
      )}
      
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapViewUpdater center={mapCenter} zoom={zoom} />
        
        {/* User location marker */}
        {userLocation && (
          <div className="user-marker">
            <L.Marker 
              position={userLocation}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `
                  <div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                  </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            />
          </div>
        )}
        
        {/* Station markers */}
        {stations && stations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            selected={selectedStation && selectedStation.id === station.id}
            onClick={() => onSelectStation && onSelectStation(station)}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
