export interface Service {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

export interface ServicesData {
  services: Service[];
}

export interface DashboardConfig {
  view?: 'grid' | 'category';
  order?: 'ascending' | 'descending';
  theme?: 'default' | 'forest' | 'nether' | 'summer' | 'neon';
  cardDisplay?: 'default' | 'compact' | 'icon';
  iconSize?: 'default' | 'full';
  weather?: {
    apiKey: string;
    location: string;
  };
}

export type ServiceStatus = 'online' | 'offline' | 'checking';