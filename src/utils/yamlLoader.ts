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
    const raw = yaml.load(yamlText) as Record<string, unknown> | undefined;

    // Normalize dashed YAML keys to camelCase for TS safety
    const normalized: DashboardConfig = {
      view: (raw?.['view'] as DashboardConfig['view']) ?? 'grid',
      order: (raw?.['order'] as DashboardConfig['order']) ?? 'ascending',
      theme: (raw?.['theme'] as DashboardConfig['theme']) ?? 'default',
      cardDisplay: (raw?.['card-display'] as DashboardConfig['cardDisplay'])
        ?? (raw?.['cardDisplay'] as DashboardConfig['cardDisplay'])
        ?? 'default',
      iconSize: (raw?.['icon-size'] as DashboardConfig['iconSize'])
        ?? (raw?.['iconSize'] as DashboardConfig['iconSize'])
        ?? 'default',
      weather: raw?.['weather'] as DashboardConfig['weather'],
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
