export interface AppConfig {
  // Navigation settings
  navigation: {
    breakingPoint: 'h1' | 'h2' | 'h3' | 'h4';
    showH1InSidebar: boolean;
    collapsible: boolean;
  };
  
  // Style tokens
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      backgroundSecondary: string;
      text: string;
      textSecondary: string;
      border: string;
      accent: string;
    };
    fonts: {
      sans: string;
      mono: string;
      size: 'small' | 'medium' | 'large';
    };
    spacing: {
      compact: boolean;
    };
  };
  
  // Content settings
  content: {
    maxWidth: string;
    enableMDX: boolean;
    syntaxHighlighting: boolean;
    copyCodeButton: boolean;
  };
  
  // Pages folder path (relative to public)
  pagesPath: string;
}

export const defaultConfig: AppConfig = {
  navigation: {
    breakingPoint: 'h2',
    showH1InSidebar: true,
    collapsible: false,
  },
  theme: {
    colors: {
      primary: '#111827',
      secondary: '#374151',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#2563eb',
    },
    fonts: {
      sans: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      mono: 'Geist Mono, Courier New, monospace',
      size: 'medium',
    },
    spacing: {
      compact: false,
    },
  },
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
  },
  pagesPath: '/pages',
};
