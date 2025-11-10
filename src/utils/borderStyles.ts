import type { AppConfig } from '../config/app.config';
import { getTailwindColor } from './colorStyles';
import type { TailwindColorName } from './colorStyles';

export const applyBorderStyles = (config: AppConfig) => {
  const root = document.documentElement;
  const { border, colors } = config.theme;

  // Progressive border radius mapping
  const radiusMap = {
    none: {
      base: '0px',
      small: '0px',
      medium: '0px',
      large: '0px'
    },
    sm: {
      base: '0.25rem',    // 4px - buttons, small elements
      small: '0.125rem',  // 2px - child elements
      medium: '0.375rem', // 6px - containers
      large: '0.5rem'     // 8px - dialogs
    },
    md: {
      base: '0.5rem',     // 8px - buttons, small elements
      small: '0.25rem',   // 4px - child elements
      medium: '0.75rem',  // 12px - containers
      large: '1rem'       // 16px - dialogs
    },
    lg: {
      base: '0.75rem',    // 12px - buttons, small elements
      small: '0.5rem',    // 8px - child elements
      medium: '1rem',     // 16px - containers
      large: '1.5rem'     // 24px - dialogs
    }
  };

  // Get border colors based on theme and contrast level
  const getBorderColors = () => {
    if ('accent' in colors && 'light' in colors && 'dark' in colors) {
      const { light, dark } = colors as {
        accent: TailwindColorName;
        light: TailwindColorName;
        dark: TailwindColorName;
      };

      return {
        // Light mode border colors with increasing contrast
        light1: getTailwindColor(light, 200),  // Very subtle
        light2: getTailwindColor(light, 300),  // Medium contrast
        light3: getTailwindColor(dark, 400),   // High contrast
        // Dark mode border colors with increasing contrast
        dark1: getTailwindColor(dark, 800),    // Very subtle
        dark2: getTailwindColor(dark, 700),    // Medium contrast
        dark3: getTailwindColor(light, 600),   // High contrast
      };
    } else {
      // Fallback for legacy colors
      return {
        light1: '#e5e7eb',
        light2: '#d1d5db',
        light3: '#9ca3af',
        dark1: '#374151',
        dark2: '#4b5563',
        dark3: '#6b7280'
      };
    }
  };

  const borderColors = getBorderColors();

  // Set CSS custom properties for border radius
  const currentRadius = radiusMap[border.radius];
  root.style.setProperty('--border-radius-base', currentRadius.base);
  root.style.setProperty('--border-radius-small', currentRadius.small);
  root.style.setProperty('--border-radius-medium', currentRadius.medium);
  root.style.setProperty('--border-radius-large', currentRadius.large);

  // Set border width (always 1px, but can be disabled)
  const borderWidth = border.size === 'none' ? '0px' : '1px';
  root.style.setProperty('--border-width', borderWidth);

  // Set border colors for different contrast levels
  if (border.size !== 'none') {
    const level = typeof border.size === 'number' ? border.size : 1;
    
    // Light mode colors
    const lightColor = level === 1 ? borderColors.light1 : 
                      level === 2 ? borderColors.light2 : 
                      borderColors.light3;
    
    // Dark mode colors
    const darkColor = level === 1 ? borderColors.dark1 : 
                     level === 2 ? borderColors.dark2 : 
                     borderColors.dark3;

    root.style.setProperty('--border-color-light', lightColor);
    root.style.setProperty('--border-color-dark', darkColor);
  } else {
    root.style.setProperty('--border-color-light', 'transparent');
    root.style.setProperty('--border-color-dark', 'transparent');
  }

  // Apply dynamic border styles
  updateDynamicBorderStyles(border.size !== 'none');
};

/**
 * Update dynamic border styles in the DOM
 */
const updateDynamicBorderStyles = (hasBorders: boolean) => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      /* Current border properties */
      --current-border-width: var(--border-width);
      --current-border-color: var(--border-color-light);
    }

    .dark {
      --current-border-color: var(--border-color-dark);
    }

    /* Border utility classes */
    .theme-border-base { 
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-base);
    }
    
    .theme-border-small { 
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-small);
    }
    
    .theme-border-medium { 
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-medium);
    }
    
    .theme-border-large { 
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-large);
    }

    /* Radius-only classes (for elements that shouldn't have borders) */
    .theme-radius-base { border-radius: var(--border-radius-base); }
    .theme-radius-small { border-radius: var(--border-radius-small); }
    .theme-radius-medium { border-radius: var(--border-radius-medium); }
    .theme-radius-large { border-radius: var(--border-radius-large); }

    /* Specific component styling */
    ${hasBorders ? `
    /* SearchDialog */
    .search-dialog {
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-large);
    }

    /* Code blocks in markdown */
    .markdown-content pre {
      border: var(--current-border-width) solid var(--current-border-color) !important;
      border-radius: var(--border-radius-medium) !important;
    }

    .markdown-content code:not(pre code) {
      border: var(--current-border-width) solid var(--current-border-color) !important;
      border-radius: var(--border-radius-small) !important;
    }

    /* Buttons */
    .theme-button {
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-base);
    }

    /* Input elements */
    .theme-input {
      border: var(--current-border-width) solid var(--current-border-color);
      border-radius: var(--border-radius-base);
    }
    ` : `
    /* No borders mode */
    .search-dialog {
      border: none;
      border-radius: var(--border-radius-large);
    }

    .markdown-content pre {
      border: none !important;
      border-radius: var(--border-radius-medium) !important;
    }

    .markdown-content code:not(pre code) {
      border: none !important;
      border-radius: var(--border-radius-small) !important;
    }

    .theme-button {
      border: none;
      border-radius: var(--border-radius-base);
    }

    .theme-input {
      border: none;
      border-radius: var(--border-radius-base);
    }
    `}

    /* Sidebar always has border (as requested) */
    .sidebar-container {
      border-right: 1px solid var(--current-border-color) !important;
    }

    /* Transparent sidebar hover effect */
    .hover\\:sidebar-container:hover {
      border-right: 1px solid var(--current-border-color) !important;
    }

    /* TabNavigation never has radius (as requested) */
    .tab-navigation {
      border-radius: 0 !important;
    }
    .tab-navigation .tab-item {
      border-radius: 0 !important;
    }
  `;

  // Remove existing dynamic border style if it exists
  const existingStyle = document.getElementById('dynamic-border-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  style.id = 'dynamic-border-style';
  document.head.appendChild(style);
};
