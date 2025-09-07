import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types/service';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { StatusIndicator } from './StatusIndicator';
import { useDarkMode } from '../hooks/useDarkMode';
import { Theme } from '../hooks/useTheme';

interface SelfhostIconProps {
  name: string;
  className?: string;
  isDarkMode?: boolean;
  onFallback: () => void;
}

function SelfhostIcon({ name, className = "w-6 h-6", isDarkMode = false, onFallback }: SelfhostIconProps) {
  const [imageFormat, setImageFormat] = useState<'svg' | 'png'>('svg');
  
  
  const formattedName = name.toLowerCase().replace(/\s+/g, '-');
  const iconName = isDarkMode && imageFormat === 'svg' ? `${formattedName}-light` : formattedName;
  const iconUrl = `https://cdn.jsdelivr.net/gh/selfhst/icons/${imageFormat}/${iconName}.${imageFormat}`;
  
  const handleError = () => {
    // If SVG fails, try PNG
    if (imageFormat === 'svg') {
      setImageFormat('png');
    } else {
      // If both fail, use the fallback
      onFallback();
    }
  };
  
  return (
    <img
      src={iconUrl}
      alt={`${name} icon`}
      className={className}
      onError={handleError}
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
  
  const FallbackIconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Globe;
  
  const handleIconError = () => {
    setUseExternalIcon(false);
  };

  const handleClick = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  const IconDisplay = ({ className }: { className: string }) => {
    if (useExternalIcon) {
      return (
        <SelfhostIcon
          name={service.icon}
          className={`${className} text-white`}
          isDarkMode={isDarkMode}
          onFallback={handleIconError}
        />
      );
    }
    return <FallbackIconComponent className={`${className} text-white`} />;
  };

  if (cardDisplay === 'icon') {
    return (
      <div
        onClick={handleClick}
        className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover aspect-square ${
          iconSize === 'full' ? 'p-0' : 'p-4 flex items-center justify-center'
        }`}
        title={`${service.name} - ${service.description}`}
      >
        <div className={`absolute top-2 right-2 ${iconSize === 'full' ? 'z-10' : ''}`}>
          <StatusIndicator status={status} serviceName={service.name} />
        </div>

        <div className={`${
          iconSize === 'full'
            ? 'w-full h-full theme-accent-bg flex items-center justify-center rounded-xl'
            : 'w-12 h-12 theme-accent-bg rounded-lg flex items-center justify-center'
        } transition-colors duration-200`}>
          <IconDisplay className={iconSize === 'full' ? 'w-12 h-12' : 'w-6 h-6'} />
        </div>

        <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    );
  }

  if (cardDisplay === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover ${
          iconSize === 'full' ? 'p-0 overflow-hidden' : 'p-4'
        }`}
      >
        <div className={`absolute top-3 right-3 ${iconSize === 'full' ? 'z-10' : ''}`}>
          <StatusIndicator status={status} serviceName={service.name} />
        </div>

        <div className={`flex items-center ${iconSize === 'full' ? 'h-full' : 'space-x-3 pr-6'}`}>
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

          <div className={`flex-1 min-w-0 ${
            iconSize === 'full' ? 'p-4 pr-8' : ''
          }`}>
            <h3 className="text-base font-semibold theme-text group-hover:theme-accent transition-colors duration-200 truncate">
              {service.name}
            </h3>
          </div>
        </div>

        <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative theme-surface rounded-xl shadow-sm border theme-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover ${
        iconSize === 'full' ? 'p-0 overflow-hidden' : 'p-6'
      }`}
    >
      <div className={`absolute top-4 right-4 ${iconSize === 'full' ? 'z-10' : ''}`}>
        <StatusIndicator status={status} serviceName={service.name} />
      </div>

      <div className={`flex items-start ${iconSize === 'full' ? 'h-full' : 'space-x-4 pr-8'}`}>
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

      <div className="absolute inset-0 theme-card-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}