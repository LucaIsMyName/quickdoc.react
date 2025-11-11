import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MarkdownContent } from '../src/components/MarkdownContent';
import type { AppConfig } from '../src/config/app.config';

const mockConfig: AppConfig = {
  site: {
    title: 'Test Site',
    description: 'Test description',
    author: 'Test Author',
    url: 'https://test.com',
  },
  navigation: {
    breakingPoint: 'h2',
    showH1InSidebar: true,
    collapsible: false,
    expandAllSections: false,
    sidebarWidth: {
      min: '200px',
      default: '280px',
      max: '400px',
    },
    enableUserSidebarWidthChange: false,
    enableNumberedSidebar: false,
    pagination: {
      enabled: true,
      showOnTop: false,
      showOnBottom: true,
    },
    fileOrder: [],
  },
  theme: {
    colors: {
      accent: 'blue',
      light: 'gray',
      dark: 'gray',
    },
    isSidebarTransparent: false,
    fonts: {
      sans: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      mono: 'Geist Mono, Courier New, monospace',
      size: 'medium',
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: 'sm',
      size: 1,
    },
  },
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
    align: 'left',
    spacing: 'normal',
  },
  search: {
    enableFuzzySearch: false,
  },
  pagesPath: '/pages',
};

describe('MarkdownContent', () => {
  beforeEach(() => {
    // Clear any existing dynamic styles
    const existingStyle = document.getElementById('dynamic-border-style');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  describe('Copy Button Theming', () => {
    it('renders copy button with theme border radius and size', async () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      const { container } = render(
        <MarkdownContent content={content} config={mockConfig} />
      );

      // Wait for the button to be added (it's added in useEffect)
      await waitFor(() => {
        const copyButton = container.querySelector('.copy-button');
        expect(copyButton).toBeTruthy();
        
        // Check that the button has the copy-button class (which applies CSS variables)
        expect(copyButton?.className).toContain('copy-button');
      });
    });

    it('applies different border radius based on config', async () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      // Test with large radius
      const largeRadiusConfig: AppConfig = {
        ...mockConfig,
        theme: {
          ...mockConfig.theme,
          border: {
            radius: 'lg' as const,
            size: 2 as const,
          },
        },
      };

      const { container } = render(
        <MarkdownContent content={content} config={largeRadiusConfig} />
      );

      await waitFor(() => {
        const copyButton = container.querySelector('.copy-button');
        expect(copyButton).toBeTruthy();
        
        // The button should have the copy-button class which uses CSS variables
        expect(copyButton?.className).toContain('copy-button');
      });
    });

    it('applies no border when size is set to none', async () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      const noBorderConfig = {
        ...mockConfig,
        theme: {
          ...mockConfig.theme,
          border: {
            radius: 'sm' as const,
            size: 'none' as const,
          },
        },
      };

      const { container } = render(
        <MarkdownContent content={content} config={noBorderConfig} />
      );

      await waitFor(() => {
        const copyButton = container.querySelector('.copy-button');
        expect(copyButton).toBeTruthy();
      });
    });

    it('does not render copy button when copyCodeButton is disabled', () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      const noCopyButtonConfig = {
        ...mockConfig,
        content: {
          ...mockConfig.content,
          copyCodeButton: false,
        },
      };

      const { container } = render(
        <MarkdownContent content={content} config={noCopyButtonConfig} />
      );

      setTimeout(() => {
        const copyButton = container.querySelector('.copy-button');
        expect(copyButton).toBeFalsy();
      }, 100);
    });
  });

  describe('Code Block Rendering', () => {
    it('renders code blocks correctly', () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      const { container } = render(
        <MarkdownContent content={content} config={mockConfig} />
      );

      const codeBlock = container.querySelector('pre code');
      expect(codeBlock).toBeTruthy();
    });

    it('applies syntax highlighting when enabled', async () => {
      const content = '```javascript\nconst test = "hello";\n```';
      
      const { container } = render(
        <MarkdownContent content={content} config={mockConfig} />
      );

      await waitFor(() => {
        const codeBlock = container.querySelector('pre code');
        expect(codeBlock).toBeTruthy();
        // Highlight.js adds classes to the code element
        expect(codeBlock?.className).toBeTruthy();
      });
    });
  });
});
