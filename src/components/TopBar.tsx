import React, { useState, useEffect } from 'react';
import { Theme } from '../hooks/useTheme';

interface TopBarProps {
  theme?: Theme;
}

export function TopBar({ theme = 'default' }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="absolute top-6 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md theme-topbar-surface border theme-topbar-border rounded-2xl shadow-lg">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Date on the left */}
            <div className="theme-text">
              <span className="text-lg font-semibold">
                {formatDate(currentTime)}
              </span>
            </div>

            {/* Time on the right */}
            <div className="theme-text">
              <span className="text-lg font-mono font-semibold tabular-nums">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}