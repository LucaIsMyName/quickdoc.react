import { useState, useEffect } from 'react';
import type { AppConfig } from '../config/app.config';

const STORAGE_KEY = 'quickdoc-sidebar-width';

export const useSidebarWidth = (config: AppConfig) => {
  const [width, setWidth] = useState(() => {
    // Try to get width from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedWidth = parseInt(stored, 10);
        // Validate stored width is within bounds
        const minWidth = parseInt(config.navigation.sidebarWidth.min, 10);
        const maxWidth = parseInt(config.navigation.sidebarWidth.max, 10);
        
        if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
          return parsedWidth;
        }
      }
    }
    
    // Fall back to default config width
    return parseInt(config.navigation.sidebarWidth.default, 10);
  });

  // Save to localStorage whenever width changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, width.toString());
    }
  }, [width]);

  const updateWidth = (newWidth: number) => {
    const minWidth = parseInt(config.navigation.sidebarWidth.min, 10);
    const maxWidth = parseInt(config.navigation.sidebarWidth.max, 10);
    
    // Constrain width within bounds
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(constrainedWidth);
  };

  const resetWidth = () => {
    setWidth(parseInt(config.navigation.sidebarWidth.default, 10));
  };

  return {
    width,
    setWidth: updateWidth,
    resetWidth,
    minWidth: parseInt(config.navigation.sidebarWidth.min, 10),
    maxWidth: parseInt(config.navigation.sidebarWidth.max, 10),
    canResize: config.navigation.enableUserSidebarWidthChange,
  };
};
