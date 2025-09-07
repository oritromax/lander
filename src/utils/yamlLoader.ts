import * as yaml from 'js-yaml';
import { ServicesData, DashboardConfig } from '../types/service';

export async function loadServices(): Promise<ServicesData> {
  try {
    const response = await fetch('/config/services.yaml');
    const yamlText = await response.text();
    const servicesData = yaml.load(yamlText) as ServicesData;
    return servicesData;
  } catch (error) {
    console.error('Error loading services configuration:', error);
    return { services: [] };
  }
}

export async function loadConfig(): Promise<DashboardConfig> {
  try {
    const response = await fetch('/config/config.yaml');
    const yamlText = await response.text();
    const raw = yaml.load(yamlText) as any;

    // Normalize dashed YAML keys to camelCase for TS safety
    const normalized: DashboardConfig = {
      view: raw?.view ?? 'grid',
      order: raw?.order ?? 'ascending',
      theme: raw?.theme ?? 'default',
      cardDisplay: raw?.['card-display'] ?? raw?.cardDisplay ?? 'default',
      iconSize: raw?.['icon-size'] ?? raw?.iconSize ?? 'default',
      weather: raw?.weather,
    };

    return normalized;
  } catch (error) {
    console.error('Error loading dashboard configuration:', error);
    return {
      view: 'grid',
      order: 'ascending',
      theme: 'default'
    };
  }
}
