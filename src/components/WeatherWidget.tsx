import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Zap, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

interface WeatherWidgetProps {
  apiKey: string;
  location: string;
}

export function WeatherWidget({ apiKey, location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey && location) {
      fetchWeather();
      const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes
      return () => clearInterval(interval);
    }
  }, [apiKey, location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-4 h-4" />;
      case 'clouds':
        return <Cloud className="w-4 h-4" />;
      case 'rain':
        return <CloudRain className="w-4 h-4" />;
      case 'drizzle':
        return <CloudDrizzle className="w-4 h-4" />;
      case 'snow':
        return <CloudSnow className="w-4 h-4" />;
      case 'thunderstorm':
        return <Zap className="w-4 h-4" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <Wind className="w-4 h-4" />;
      default:
        return <Cloud className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-6 right-20 z-50">
        <button
          className="w-12 h-12 rounded-full theme-surface border theme-border shadow-lg flex items-center justify-center"
          disabled
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 theme-loading-spinner"></div>
        </button>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 right-20 z-50">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="w-12 h-12 rounded-full theme-surface border theme-border shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-105"
          title={`${weather.temp}°C - ${weather.description}`}
        >
          <span className="text-sm font-semibold theme-text">
            {weather.temp}°
          </span>
        </button>
        
        {showPopup && (
          <div className="absolute bottom-14 right-0 mb-2 p-3 theme-surface border theme-border rounded-lg shadow-xl min-w-[180px] animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center space-x-3">
              <div className="theme-accent-bg rounded-lg p-2">
                {getWeatherIcon(weather.condition)}
              </div>
              <div>
                <p className="text-lg font-semibold theme-text">{weather.temp}°C</p>
                <p className="text-sm theme-text-secondary capitalize">{weather.description}</p>
                <p className="text-xs theme-text-secondary mt-1">{location}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showPopup && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPopup(false)}
        />
      )}
    </>
  );
}