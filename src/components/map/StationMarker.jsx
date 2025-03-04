import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Card from '../common/Card';
import Button from '../common/Button';

const StationMarker = ({ station, selected, onClick }) => {
  // Create custom marker icon based on availability
  const createMarkerIcon = (station, selected) => {
    const { availableSlots, totalSlots } = station;
    const availability = totalSlots > 0 ? (availableSlots / totalSlots) : 0;
    
    // Colors based on availability
    let color;
    if (availability === 0) {
      color = '#ef4444';
    } else if (availability < 0.3) {
      color = '#f59e0b';
    } else {
      color = '#10b981';
    }
    
    const iconHtml = `
      <div class="${selected ? 'scale-125' : ''}" style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          ${selected ? 'transform: scale(1.2);' : ''}
        ">
          ${availableSlots}
        </div>
        ${selected ? `<div style="
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid ${color};
          margin-top: -5px;
        "></div>` : ''}
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-station-marker',
      iconSize: [40, 40],
      iconAnchor: [20, selected ? 45 : 30]
    });
  };
  
  return (
    <Marker
      position={[station.location.lat, station.location.lng]}
      icon={createMarkerIcon(station, selected)}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup minWidth={280} maxWidth={320}>
        <div className="station-popup">
          <h3 className="text-lg font-medium mb-1">{station.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{station.address}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-xs text-gray-500">Available</span>
              <p className="font-medium">{station.availableSlots} / {station.totalSlots}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-xs text-gray-500">Price</span>
              <p className="font-medium">${station.pricePerKwh}/kWh</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-xs text-gray-500">Charger Types</span>
              <p className="font-medium">{station.chargingTypes.join(', ')}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-xs text-gray-500">Hours</span>
              <p className="font-medium">{station.openingHours}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/booking?stationId=${station.id}`;
              }}
            >
              Book a Slot
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://maps.google.com/?q=${station.location.lat},${station.location.lng}`, '_blank');
              }}
            >
              Directions
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;