import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types/service';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { StatusIndicator } from './StatusIndicator';
import { useDarkMode } from '../hooks/useDarkMode';
import { Theme } from '../hooks/useTheme';

// Selfhost icon component with React state fallback
interface SelfhostIconProps {
  name: string;
  className?: string;
  isDarkMode?: boolean;
  onFallback: () => void;
}

function SelfhostIcon({ name, className = "w-6 h-6", isDarkMode = false, onFallback }: SelfhostIconProps) {
  // Use regular icons for light mode, light icons for dark mode (better visibility)
  const iconName = isDarkMode ? `${name.toLowerCase()}-light` : name.toLowerCase();
  const iconUrl = `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/${iconName}.svg`;
  
  return (
    <img
      src={iconUrl}
      alt={`${name} icon`}
      className={className}
      onError={onFallback}
    />
  );
}

interface ServiceCardProps {
  service: Service;
  theme?: Theme;
  cardDisplay?: 'default' | 'compact' | 'icon';
  iconSize?: 'default' | 'full';
}

export function ServiceCard({ service, theme, cardDisplay = 'default', iconSize = 'default' }: ServiceCardProps) {
  const status = useServiceStatus(service);
  const { isDarkMode } = useDarkMode();
  const [useExternalIcon, setUseExternalIcon] = useState(true);
  
  // Get fallback icon component from Lucide
  const FallbackIconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Globe;
  
  const handleIconError = () => {
    setUseExternalIcon(false);
  };

  const handleClick = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  // Icon display component with fallback
  const IconDisplay = ({ className }: { className: string }) => {
    if (useExternalIcon) {
      return (
        <SelfhostIcon
          name={service.name}
          className={`${className} text-white`}
          isDarkMode={isDarkMode}
          onFallback={handleIconError}
        />
      );
    }
    return <FallbackIconComponent className={`${className} text-white`} />;
  };

  // Icon-only mode
  if (cardDisplay === 'icon') {
    return (
      <div
        onClick={handleClick}
        className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover aspect-square ${
          iconSize === 'full' ? 'p-0' : 'p-4 flex items-center justify-center'
        }`}
        title={`${service.name} - ${service.description}`}
      >
        {/* Status Indicator */}
        <div className={`absolute top-2 right-2 ${iconSize === 'full' ? 'z-10' : ''}`}>
          <StatusIndicator status={status} serviceName={service.name} />
        </div>

        {/* Icon Only */}
        <div className={`${
          iconSize === 'full'
            ? 'w-full h-full theme-accent-bg flex items-center justify-center rounded-xl'
            : 'w-12 h-12 theme-accent-bg rounded-lg flex items-center justify-center'
        } transition-colors duration-200`}>
          <IconDisplay className={iconSize === 'full' ? 'w-12 h-12' : 'w-6 h-6'} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    );
  }

  // Compact mode
  if (cardDisplay === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover ${
          iconSize === 'full' ? 'p-0 overflow-hidden' : 'p-4'
        }`}
      >
        {/* Status Indicator */}
        <div className={`absolute top-3 right-3 ${iconSize === 'full' ? 'z-10' : ''}`}>
          <StatusIndicator status={status} serviceName={service.name} />
        </div>

        {/* Content */}
        <div className={`flex items-center ${iconSize === 'full' ? 'h-full' : 'space-x-3 pr-6'}`}>
          {/* Icon */}
          <div className={`flex-shrink-0 ${
            iconSize === 'full' 
              ? 'w-16 h-full theme-accent-bg flex items-center justify-center' 
              : ''
          }`}>
            <div className={`${
              iconSize === 'full'
                ? 'w-8 h-8'
                : 'w-10 h-10 theme-accent-bg rounded-lg'
            } flex items-center justify-center transition-colors duration-200`}>
              <IconDisplay className={iconSize === 'full' ? 'w-6 h-6' : 'w-5 h-5'} />
            </div>
          </div>

          {/* Service Name Only */}
          <div className={`flex-1 min-w-0 ${
            iconSize === 'full' ? 'p-4 pr-8' : ''
          }`}>
            <h3 className="text-base font-semibold theme-text group-hover:theme-accent transition-colors duration-200 truncate">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    );
  }

  // Default mode (current implementation)
  return (
    <div
      onClick={handleClick}
      className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover ${
        iconSize === 'full' ? 'p-0 overflow-hidden' : 'p-6'
      }`}
    >
      {/* Status Indicator */}
      <div className={`absolute top-4 right-4 ${iconSize === 'full' ? 'z-10' : ''}`}>
        <StatusIndicator status={status} serviceName={service.name} />
      </div>

      {/* Content */}
      <div className={`flex items-start ${iconSize === 'full' ? 'h-full' : 'space-x-4 pr-8'}`}>
        {/* Icon */}
        <div className={`flex-shrink-0 ${
          iconSize === 'full' 
            ? 'w-20 h-full theme-accent-bg flex items-center justify-center' 
            : ''
        }`}>
          <div className={`${
            iconSize === 'full'
              ? 'w-10 h-10'
              : 'w-12 h-12 theme-accent-bg rounded-lg'
          } flex items-center justify-center transition-colors duration-200`}>
            <IconDisplay className={iconSize === 'full' ? 'w-8 h-8' : 'w-6 h-6'} />
          </div>
        </div>

        {/* Service Info */}
        <div className={`flex-1 min-w-0 ${
          iconSize === 'full' ? 'p-6 pr-12' : ''
        }`}>
          <h3 className="text-lg font-semibold theme-text group-hover:theme-accent transition-colors duration-200 truncate">
            {service.name}
          </h3>
          <p className="mt-1 text-sm theme-text-secondary line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}