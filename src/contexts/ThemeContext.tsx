import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'quickdoc-dark-mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Default to system preference for SSR/hydration
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Priority: localStorage > system preference
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored !== null) {
        // User has explicitly set a preference before
        return stored === 'true';
      }
    } catch (e) {
      // localStorage might be disabled
      console.warn('Failed to access localStorage:', e);
    }
    
    // First visit - use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Initialize dark mode class on mount
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save user preference to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [isDark]);

  const toggle = () => {
    setIsDark(prev => !prev);
  };

  const value = {
    isDark,
    toggle,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
