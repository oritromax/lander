import React, { useState, useEffect, useMemo } from 'react';
import { Server } from 'lucide-react';
import { Service, DashboardConfig } from '../types/service';
import { loadServices, loadConfig } from '../utils/yamlLoader';
import { ServiceCard } from './ServiceCard';
import { CategoryFilter } from './CategoryFilter';
import { ThemeToggle } from './ThemeToggle';
import { WeatherWidget } from './WeatherWidget';
import { TopBar } from './TopBar';
import { useTheme } from '../hooks/useTheme';

export function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'category'>('grid');
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [cardDisplay, setCardDisplay] = useState<'default' | 'compact' | 'icon'>('default');
  const [iconSize, setIconSize] = useState<'default' | 'full'>('default');
  const [configuredTheme, setConfiguredTheme] = useState<'default' | 'forest'>('default');
  const [weatherConfig, setWeatherConfig] = useState<DashboardConfig['weather']>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { theme } = useTheme(configuredTheme);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [servicesData, config] = await Promise.all([
          loadServices(),
          loadConfig()
        ]);
        
        setServices(servicesData.services);
        setViewMode(config.view || 'grid');
        setSortOrder(config.order || 'ascending');
        setCardDisplay(config['card-display'] || 'default');
        setIconSize(config['icon-size'] || 'default');
        setConfiguredTheme(config.theme || 'default');
        setWeatherConfig(config.weather);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(services.map(service => service.category))];
    return uniqueCategories.sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    const filtered = services.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesCategory;
    });
    
    // Apply ordering for grid view
    if (viewMode === 'grid' && sortOrder === 'descending') {
      return [...filtered].reverse();
    }
    
    return filtered;
  }, [services, selectedCategory, viewMode, sortOrder]);

  const servicesByCategory = useMemo(() => {
    const grouped = services.reduce((acc, service) => {
      const category = service.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);
    
    // Sort categories alphabetically, then apply order
    let sortedCategories = Object.keys(grouped).sort();
    if (sortOrder === 'descending') {
      sortedCategories = sortedCategories.reverse();
    }
    
    const result: Record<string, Service[]> = {};
    sortedCategories.forEach(category => {
      result[category] = grouped[category];
    });
    
    return result;
  }, [services, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        {weatherConfig?.apiKey && weatherConfig?.location && (
          <WeatherWidget apiKey={weatherConfig.apiKey} location={weatherConfig.location} />
        )}
        <ThemeToggle />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 theme-loading-spinner mx-auto"></div>
          <p className="mt-4 theme-text-secondary">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg transition-colors duration-200 relative">
      {weatherConfig?.apiKey && weatherConfig?.location && (
        <WeatherWidget apiKey={weatherConfig.apiKey} location={weatherConfig.location} />
      )}
      <ThemeToggle />
      <TopBar theme={theme} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Filters - Only show in grid view */}
        {viewMode === 'grid' && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              theme={theme}
            />
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <>
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Server className="w-12 h-12 theme-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium theme-text mb-2">No services found</h3>
                <p className="theme-text-secondary">
                  {selectedCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Add services to your configuration file to get started'}
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                cardDisplay === 'icon' 
                  ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10' 
                  : cardDisplay === 'compact'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredServices.map((service, index) => (
                  <ServiceCard key={`${service.name}-${index}`} service={service} theme={theme} cardDisplay={cardDisplay} iconSize={iconSize} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Category View */}
        {viewMode === 'category' && (
          <div className="space-y-12">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold theme-text mb-6 pb-2 border-b theme-border">
                  {category}
                </h2>
                <div className={`grid gap-6 ${
                  cardDisplay === 'icon' 
                    ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10' 
                    : cardDisplay === 'compact'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {categoryServices.map((service, index) => (
                    <ServiceCard key={`${service.name}-${index}`} service={service} theme={theme} cardDisplay={cardDisplay} iconSize={iconSize} />
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(servicesByCategory).length === 0 && (
              <div className="text-center py-12">
                <Server className="w-12 h-12 theme-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium theme-text mb-2">No services found</h3>
                <p className="theme-text-secondary">
                  Add services to your configuration file to get started
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Copyright Notice */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p className="theme-text-secondary">
          Deployed with ❤ using <a href="#" target="_blank" className="theme-accent"> Lander </a>
        </p>
      </footer>
    </div>
  );
}