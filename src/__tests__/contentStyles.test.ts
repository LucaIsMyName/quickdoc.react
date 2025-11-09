import { applyContentStyles } from '../utils/contentStyles';
import type { AppConfig } from '../config/app.config';

// Simple test function to verify the implementation
const testContentStyles = () => {
  // Mock document methods
  const mockSetProperty = (property: string, value: string) => {
    console.log(`CSS Variable set: ${property} = ${value}`);
  };

  const mockElement = {
    classList: {
      remove: (...classes: string[]) => console.log(`Classes removed: ${classes.join(', ')}`),
      add: (className: string) => console.log(`Class added: ${className}`),
    },
  };

  // Mock document.documentElement
  (global as any).document = {
    documentElement: {
      style: {
        setProperty: mockSetProperty,
      },
    },
  };

  console.log('Testing compact spacing with left alignment...');
  const config1: AppConfig = {
    navigation: {
      breakingPoint: 'h2',
      showH1InSidebar: true,
      collapsible: false,
      sidebarWidth: { min: '200px', default: '280px', max: '400px' },
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
        accent: '#111827',
        activeBackground: '#f3f4f6',
        activeText: '#111827',
      },
      fonts: {
        sans: 'Geist, sans-serif',
        mono: 'Geist Mono, monospace',
        size: 'medium',
      },
      spacing: { compact: false },
    },
    content: {
      maxWidth: '800px',
      enableMDX: true,
      syntaxHighlighting: true,
      copyCodeButton: true,
      align: 'left',
      spacing: 'compact',
    },
    pagesPath: '/pages',
  };

  applyContentStyles(config1, mockElement as any);

  console.log('\nTesting relaxed spacing with center alignment...');
  const config2: AppConfig = {
    ...config1,
    content: {
      ...config1.content,
      align: 'center',
      spacing: 'relaxed',
    },
  };

  applyContentStyles(config2, mockElement as any);

  console.log('\nTesting normal spacing with right alignment...');
  const config3: AppConfig = {
    ...config1,
    content: {
      ...config1.content,
      align: 'right',
      spacing: 'normal',
    },
  };

  applyContentStyles(config3, mockElement as any);

  console.log('\nTesting null element...');
  applyContentStyles(config1, null);

  console.log('\nAll tests completed successfully!');
};

// Export for manual testing
export { testContentStyles };
