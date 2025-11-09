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
    // Priority: localStorage > system preference
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored !== null) {
      // User has explicitly set a preference before
      return stored === 'true';
    }
    
    // First visit - use system preference (don't save yet)
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
