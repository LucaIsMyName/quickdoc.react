import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyColorStyles, getTailwindColor, getAvailableColors } from '../src/utils/colorStyles';
import type { AppConfig } from '../src/config/app.config';

// Mock DOM methods
const mockSetProperty = vi.fn();
const mockGetElementById = vi.fn();
const mockQuerySelector = vi.fn();
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockRemove = vi.fn();

// Mock document and style element
const mockStyleElement = {
  id: '',
  textContent: '',
  remove: mockRemove
};

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
  
  // Mock document.documentElement.style.setProperty
  Object.defineProperty(document, 'documentElement', {
    value: {
      style: {
        setProperty: mockSetProperty
      }
    },
    writable: true
  });

  // Mock document.getElementById
  Object.defineProperty(document, 'getElementById', {
    value: mockGetElementById,
    writable: true
  });

  // Mock document.querySelector
  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
    writable: true
  });

  // Mock document.createElement
  Object.defineProperty(document, 'createElement', {
    value: mockCreateElement.mockReturnValue(mockStyleElement),
    writable: true
  });

  // Mock document.head.appendChild
  Object.defineProperty(document, 'head', {
    value: {
      appendChild: mockAppendChild
    },
    writable: true
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('colorStyles', () => {
  describe('getTailwindColor', () => {
    it('should return correct hex color for valid color name and weight', () => {
      expect(getTailwindColor('blue', 500)).toBe('#3b82f6');
      expect(getTailwindColor('red', 600)).toBe('#dc2626');
      expect(getTailwindColor('gray', 50)).toBe('#f9fafb');
    });

    it('should return fallback color for invalid color name', () => {
      expect(getTailwindColor('invalid' as any, 500)).toBe('#000000');
    });

    it('should return fallback color for invalid weight', () => {
      expect(getTailwindColor('blue', 999 as any)).toBe('#000000');
    });
  });

  describe('getAvailableColors', () => {
    it('should return array of available color names', () => {
      const colors = getAvailableColors();
      expect(colors).toContain('blue');
      expect(colors).toContain('red');
      expect(colors).toContain('gray');
      expect(colors).toContain('green');
      expect(colors.length).toBeGreaterThan(10);
    });
  });

  describe('applyColorStyles', () => {
    it('should apply new simplified color system', () => {
      const config: AppConfig = {
        site: {
          title: 'Test',
          description: 'Test',
          author: 'Test',
          url: 'Test'
        },
        navigation: {
          breakingPoint: 'h2',
          showH1InSidebar: false,
          collapsible: false,
          expandAllSections: false,
          sidebarWidth: { min: '200px', default: '280px', max: '350px' },
          enableUserSidebarWidthChange: true,
          pagination: { enabled: false, showOnTop: false, showOnBottom: true }
        },
        theme: {
          colors: {
            accent: 'blue',
            light: 'gray',
            dark: 'slate'
          },
          fonts: {
            sans: 'system-ui',
            mono: 'monospace',
            size: 'medium'
          },
          spacing: { compact: false },
          border: { radius: 'sm', size: 1 }
        },
        content: {
          maxWidth: '800px',
          enableMDX: true,
          syntaxHighlighting: true,
          copyCodeButton: true,
          align: 'left',
          spacing: 'normal'
        },
        pagesPath: '/pages'
      };

      mockGetElementById.mockReturnValue(null);

      applyColorStyles(config);

      // Verify CSS custom properties are set
      expect(mockSetProperty).toHaveBeenCalledWith('--color-bg', '#f9fafb'); // gray-50
      expect(mockSetProperty).toHaveBeenCalledWith('--color-text', '#020617'); // slate-950
      expect(mockSetProperty).toHaveBeenCalledWith('--color-accent', '#2563eb'); // blue-600
      expect(mockSetProperty).toHaveBeenCalledWith('--color-accent-dark', '#60a5fa'); // blue-400

      // Verify dynamic style creation
      expect(mockCreateElement).toHaveBeenCalledWith('style');
      expect(mockAppendChild).toHaveBeenCalledWith(mockStyleElement);
    });

    it('should apply legacy color system for backward compatibility', () => {
      const config: AppConfig = {
        site: {
          title: 'Test',
          description: 'Test',
          author: 'Test',
          url: 'Test'
        },
        navigation: {
          breakingPoint: 'h2',
          showH1InSidebar: false,
          collapsible: false,
          expandAllSections: false,
          sidebarWidth: { min: '200px', default: '280px', max: '350px' },
          enableUserSidebarWidthChange: true,
          pagination: { enabled: false, showOnTop: false, showOnBottom: true }
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
            activeText: '#111827'
          },
          fonts: {
            sans: 'system-ui',
            mono: 'monospace',
            size: 'medium'
          },
          spacing: { compact: false },
          border: { radius: 'sm', size: 1 }
        },
        content: {
          maxWidth: '800px',
          enableMDX: true,
          syntaxHighlighting: true,
          copyCodeButton: true,
          align: 'left',
          spacing: 'normal'
        },
        pagesPath: '/pages'
      };

      applyColorStyles(config);

      // Verify legacy colors are applied
      expect(mockSetProperty).toHaveBeenCalledWith('--color-bg', '#ffffff');
      expect(mockSetProperty).toHaveBeenCalledWith('--color-text', '#111827');
      expect(mockSetProperty).toHaveBeenCalledWith('--color-accent', '#111827');
    });

    it('should remove existing dynamic style before adding new one', () => {
      const existingStyle = { remove: mockRemove };
      mockGetElementById.mockReturnValue(existingStyle);

      const config: AppConfig = {
        site: { title: 'Test', description: 'Test', author: 'Test', url: 'Test' },
        navigation: {
          breakingPoint: 'h2', showH1InSidebar: false, collapsible: false,
          expandAllSections: false, sidebarWidth: { min: '200px', default: '280px', max: '350px' },
          enableUserSidebarWidthChange: true, pagination: { enabled: false, showOnTop: false, showOnBottom: true }
        },
        theme: {
          colors: { accent: 'blue', light: 'gray', dark: 'slate' },
          fonts: { sans: 'system-ui', mono: 'monospace', size: 'medium' },
          spacing: { compact: false }, border: { radius: 'sm', size: 1 }
        },
        content: {
          maxWidth: '800px', enableMDX: true, syntaxHighlighting: true,
          copyCodeButton: true, align: 'left', spacing: 'normal'
        },
        pagesPath: '/pages'
      };

      applyColorStyles(config);

      expect(mockGetElementById).toHaveBeenCalledWith('dynamic-color-style');
      expect(mockRemove).toHaveBeenCalled();
    });
  });
});
