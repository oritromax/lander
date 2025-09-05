import * as yaml from 'js-yaml';
import { ServicesData, DashboardConfig } from '../types/service';

export async function loadServices(): Promise<ServicesData> {
  try {
    const response = await fetch('/src/config/services.yaml');
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
    const response = await fetch('/src/config/config.yaml');
    const yamlText = await response.text();
    const config = yaml.load(yamlText) as DashboardConfig;
    return config;
  } catch (error) {
    console.error('Error loading dashboard configuration:', error);
    return {
      view: 'grid',
      order: 'ascending',
      theme: 'default'
    };
  }
}