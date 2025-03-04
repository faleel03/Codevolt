import React from 'react';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const PriorityStatus = ({ user, vehicleState }) => {
  const navigate = useNavigate();
  
  // Priority status is determined by SoC level and other factors
  const getPriorityStatus = () => {
    const { soc, estimatedRange, batteryCapacity } = vehicleState;
    
    if (soc <= 10) {
      return {
        level: 'high',
        message: 'Critical battery level',
        color: 'bg-red-500',
        textColor: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20'
      };
    } else if (soc <= 20) {
      return {
        level: 'medium',
        message: 'Low battery level',
        color: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-300',
        bgColor: 'bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20'
      };
    } else if (estimatedRange <= 50) {
      return {
        level: 'low',
        message: 'Limited driving range',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20'
      };
    } else {
      return {
        level: 'none',
        message: 'Your battery level is good',
        color: 'bg-green-500',
        textColor: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20'
      };
    }
  };
  
  const priority = getPriorityStatus();
  
  // Calculate recommended charging time based on current SoC
  const getRecommendedChargingTime = () => {
    const { soc, batteryCapacity } = vehicleState;
    const capacityFactor = batteryCapacity === 'L3' ? 0.5 : batteryCapacity === 'L2' ? 1 : 2;
    const chargingNeeded = 100 - soc;
    
    // Rough estimate: each percentage point takes capacityFactor minutes to charge
    const totalMinutes = Math.round(chargingNeeded * capacityFactor);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };
  
  return (
    <Card 
      title="Vehicle Status & Priority" 
      className={`border-l-4 ${priority.color} overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8">
        <div className={`${priority.color} opacity-10 w-full h-full rounded-full`}></div>
      </div>
      
      <div className="relative space-y-4">
        {/* Vehicle Info */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{user?.vehicleType || 'Your EV'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Battery Capacity: {vehicleState.batteryCapacity}
            </p>
          </div>
          
          {/* Priority Badge */}
          {priority.level !== 'none' && (
            <div className={`${priority.bgColor} ${priority.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
              {priority.level.toUpperCase()} Priority
            </div>
          )}
        </div>
        
        {/* Battery Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Battery Level</span>
            <span className="font-medium">{vehicleState.soc}%</span>
          </div>
          
          <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div 
              className={`h-full ${priority.color}`} 
              style={{ width: `${vehicleState.soc}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <span className="text-xs text-gray-500 dark:text-gray-400">Estimated Range</span>
              <p className="font-medium">{vehicleState.estimatedRange} km</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <span className="text-xs text-gray-500 dark:text-gray-400">Est. Charging Time</span>
              <p className="font-medium">{getRecommendedChargingTime()}</p>
            </div>
          </div>
        </div>
        
        {/* Priority Status Message */}
        <div className={`${priority.bgColor} ${priority.textColor} p-3 rounded-md text-sm`}>
          <p className="font-medium">{priority.message}</p>
          <p className="mt-1">
            {priority.level !== 'none'
              ? 'You have priority access to charging slots based on your current battery level.'
              : 'Your vehicle is at a good charge level. No priority status needed at this time.'}
          </p>
        </div>
        
        {/* Action Button */}
        {priority.level !== 'none' && (
          <button
            className={`
              mt-2 w-full py-2 px-4 rounded-md font-medium text-white
              ${priority.level === 'high' ? 'bg-red-500 hover:bg-red-600' : 
                priority.level === 'medium' ? 'bg-amber-500 hover:bg-amber-600' :
                'bg-yellow-500 hover:bg-yellow-600'}
            `}
            onClick={() => navigate('/booking')}
          >
            Find Priority Charging
          </button>
        )}
      </div>
    </Card>
  );
};

export default PriorityStatus;
