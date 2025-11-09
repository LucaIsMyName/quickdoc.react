import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../src/components/Sidebar';
import type { NavigationItem, AppConfig } from '../src/types';

const mockConfig: AppConfig = {
  navigation: {
    breakingPoint: 'h2',
    showH1InSidebar: true,
    collapsible: false,
    sidebarWidth: {
      min: '200px',
      default: '280px',
      max: '400px',
    },
    fileOrder: [],
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

const mockNavigation: NavigationItem[] = [
  {
    id: 'section-1',
    title: 'Overview',
    level: 2,
    slug: 'overview',
    subsections: [
      {
        id: 'heading-0',
        title: 'Key Features',
        level: 3,
        slug: 'key-features',
      },
      {
        id: 'heading-1',
        title: 'Installation',
        level: 3,
        slug: 'installation',
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Configuration',
    level: 2,
    slug: 'configuration',
    subsections: [
      {
        id: 'heading-2',
        title: 'Basic Settings',
        level: 3,
        slug: 'basic-settings',
      },
    ],
  },
];

describe('Sidebar', () => {
  it('renders navigation items correctly', () => {
    render(
      <Sidebar
        title="Test Documentation"
        navigation={mockNavigation}
        currentSection="overview"
        onSectionChange={() => {}}
        isOpen={true}
        onClose={() => {}}
        config={mockConfig}
      />
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Configuration')).toBeTruthy();
  });

  it('renders subsections when active section has subsections', () => {
    render(
      <Sidebar
        title="Test Documentation"
        navigation={mockNavigation}
        currentSection="overview"
        onSectionChange={() => {}}
        isOpen={true}
        onClose={() => {}}
        config={mockConfig}
      />
    );

    expect(screen.getByText('Key Features')).toBeTruthy();
    expect(screen.getByText('Installation')).toBeTruthy();
  });

  it('does not render subsections when section is not active', () => {
    render(
      <Sidebar
        title="Test Documentation"
        navigation={mockNavigation}
        currentSection="configuration"
        onSectionChange={() => {}}
        isOpen={true}
        onClose={() => {}}
        config={mockConfig}
      />
    );

    expect(screen.queryByText('Key Features')).toBeFalsy();
    expect(screen.queryByText('Installation')).toBeFalsy();
    expect(screen.getByText('Basic Settings')).toBeTruthy();
  });

  it('applies correct CSS classes for subsection container without extra margin', () => {
    const { container } = render(
      <Sidebar
        title="Test Documentation"
        navigation={mockNavigation}
        currentSection="overview"
        onSectionChange={() => {}}
        isOpen={true}
        onClose={() => {}}
        config={mockConfig}
      />
    );

    // Find the subsection container
    const subsectionContainer = container.querySelector('.space-y-1');
    expect(subsectionContainer).toBeTruthy();
    
    // Verify it doesn't have the problematic mt-1 class
    expect(subsectionContainer?.className).not.toContain('mt-1');
  });

  it('applies correct indentation for different heading levels', () => {
    const { container } = render(
      <Sidebar
        title="Test Documentation"
        navigation={mockNavigation}
        currentSection="overview"
        onSectionChange={() => {}}
        isOpen={true}
        onClose={() => {}}
        config={mockConfig}
      />
    );

    // Check that H3 subsections have proper indentation
    const h3Subsections = container.querySelectorAll('.pl-9');
    expect(h3Subsections.length).toBeGreaterThan(0);
  });
});
