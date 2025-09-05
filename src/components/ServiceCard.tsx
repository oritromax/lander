import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types/service';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { StatusIndicator } from './StatusIndicator';
import { useDarkMode } from '../hooks/useDarkMode';
import { Theme } from '../hooks/useTheme';

// Selfhost icon component
interface SelfhostIconProps {
  name: string;
  className?: string;
  isDarkMode?: boolean;
}

function SelfhostIcon({ name, className = "w-6 h-6", isDarkMode = false }: SelfhostIconProps) {
  // Use regular icons for light mode, light icons for dark mode (better visibility)
  const iconName = isDarkMode ? `${name.toLowerCase()}-light` : name.toLowerCase();
  const iconUrl = `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/${iconName}.svg`;
  
  return (
    <img
      src={iconUrl}
      alt={`${name} icon`}
      className={className}
      onError={(e) => {
        // Fallback to a default icon if the specific service icon doesn't exist
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.nextElementSibling?.classList.remove('hidden');
      }}
    />
  );
}

interface ServiceCardProps {
  service: Service;
  theme?: Theme;
}

export function ServiceCard({ service, theme = 'default' }: ServiceCardProps) {
  const status = useServiceStatus(service);
  const { isDarkMode } = useDarkMode();
  
  // Get fallback icon component from Lucide
  const FallbackIconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Globe;

  const handleClick = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className="group relative theme-surface rounded-xl shadow-sm border theme-border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] theme-card-hover"
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <StatusIndicator status={status} serviceName={service.name} />
      </div>

      {/* Content */}
      <div className="flex items-start space-x-4 pr-8">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 theme-accent-bg rounded-lg flex items-center justify-center transition-colors duration-200">
            <SelfhostIcon name={service.name} className="w-6 h-6 text-white" isDarkMode={isDarkMode} />
            <FallbackIconComponent className="w-6 h-6 text-white hidden" />
          </div>
        </div>

        {/* Service Info */}
        <div className="flex-1 min-w-0">
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