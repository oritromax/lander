import { useState, useEffect } from 'react';

export type Theme = 'default' | 'forest' | 'nether' | 'summer' | 'neon';

export function useTheme(configuredTheme?: Theme) {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    if (configuredTheme) {
      setTheme(configuredTheme);
      loadThemeCSS(configuredTheme);
    }
  }, [configuredTheme]);

  const loadThemeCSS = (themeName: Theme) => {
    // Remove any existing theme stylesheets
    const existingThemeLinks = document.querySelectorAll('link[data-theme]');
    existingThemeLinks.forEach(link => link.remove());

    // Create and add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/styles/themes/${themeName}.css`;
    link.setAttribute('data-theme', themeName);
    document.head.appendChild(link);
  };

  return { theme };
}