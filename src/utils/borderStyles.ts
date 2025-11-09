import type { AppConfig } from '../config/app.config';

export const applyBorderStyles = (config: AppConfig) => {
  const root = document.documentElement;
  
  // Border radius mapping
  const radiusMap = {
    none: '0px',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    xl: '1rem',      // 16px
  };
  
  // Border size mapping
  const borderMap = {
    none: '0px',
    1: '1px',
    2: '2px',
    3: '3px',
  };
  
  // Set CSS custom properties
  root.style.setProperty('--border-radius', radiusMap[config.theme.border.radius]);
  root.style.setProperty('--border-size', borderMap[config.theme.border.size]);
};
