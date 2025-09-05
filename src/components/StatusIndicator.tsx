import React from 'react';
import { ServiceStatus } from '../types/service';

interface StatusIndicatorProps {
  status: ServiceStatus;
  serviceName: string;
}

export function StatusIndicator({ status, serviceName }: StatusIndicatorProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500 shadow-green-500/25';
      case 'offline':
        return 'bg-red-500 shadow-red-500/25';
      case 'checking':
        return 'bg-amber-500 shadow-amber-500/25 animate-pulse';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'online':
        return `${serviceName} is online`;
      case 'offline':
        return `${serviceName} is offline`;
      case 'checking':
        return `Checking ${serviceName} status`;
    }
  };

  return (
    <div className="relative group">
      <div
        className={`w-3 h-3 rounded-full shadow-lg ${getStatusStyles()}`}
        title={getStatusLabel()}
      />
      
      {/* Pulse animation for online status */}
      {status === 'online' && (
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 opacity-75 animate-ping" />
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {getStatusLabel()}
        <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-800 dark:border-t-gray-700" />
      </div>
    </div>
  );
}