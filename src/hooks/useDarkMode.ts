import { useState, useEffect } from 'react';

const STORAGE_KEY = 'quickdoc-dark-mode';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Priority: localStorage > system preference
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored !== null) {
      // User has explicitly set a preference before
      const prefersDark = stored === 'true';
      // Apply immediately to prevent flash
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return prefersDark;
    }
    
    // First visit - use system preference (don't save yet)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
    }
    return systemPrefersDark;
  });

  useEffect(() => {
    // Always update document class when state changes
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save user preference to localStorage
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  const toggle = () => {
    setIsDark(prev => !prev);
  };

  return { isDark, toggle };
};
