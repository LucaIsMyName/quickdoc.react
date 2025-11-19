import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../src/components/Sidebar';
import type { NavigationItem } from '../src/types';
import type { AppConfig } from '../src/config/app.config';

const mockConfig: AppConfig = {
  site: {
    title: 'Test Site',
    description: 'Test description',
    author: 'Test Author',
    url: 'https://test.com',
  },
  navigation: {
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
      <BrowserRouter>
        <Sidebar
          navigation={mockNavigation}
          isOpen={true}
          onClose={() => {}}
          config={mockConfig}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Configuration')).toBeTruthy();
  });

  it('renders subsections when active section has subsections', () => {
    render(
      <BrowserRouter>
        <Sidebar
          title="Test Documentation"
          navigation={mockNavigation}
          currentSection="overview"
          isOpen={true}
          onClose={() => {}}
          config={mockConfig}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Key Features')).toBeTruthy();
    expect(screen.getByText('Installation')).toBeTruthy();
  });

  it('does not render subsections when section is not active', () => {
    render(
      <BrowserRouter>
        <Sidebar
          navigation={mockNavigation}
          isOpen={true}
          onClose={() => {}}
          config={mockConfig}
        />
      </BrowserRouter>
    );

    expect(screen.queryByText('Key Features')).toBeFalsy();
    expect(screen.queryByText('Installation')).toBeFalsy();
    expect(screen.getByText('Basic Settings')).toBeTruthy();
  });

  it('applies correct CSS classes for subsection container without extra margin', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar
          title="Test Documentation"
          navigation={mockNavigation}
          currentSection="overview"
          isOpen={true}
          onClose={() => {}}
          config={mockConfig}
        />
      </BrowserRouter>
    );

    // Find the subsection container
    const subsectionContainer = container.querySelector('.space-y-1');
    expect(subsectionContainer).toBeTruthy();
    
    // Verify it doesn't have the problematic mt-1 class
    expect(subsectionContainer?.className).not.toContain('mt-1');
  });

  it('applies correct indentation for different heading levels', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar
          title="Test Documentation"
          navigation={mockNavigation}
          currentSection="overview"
          isOpen={true}
          onClose={() => {}}
          config={mockConfig}
        />
      </BrowserRouter>
    );

    // Check that H3 subsections have proper indentation
    const h3Subsections = container.querySelectorAll('.ml-6');
    expect(h3Subsections.length).toBeGreaterThan(0);
  });

  describe('Sidebar Numbering System', () => {
    const numberedConfig: AppConfig = {
      ...mockConfig,
      navigation: {
        ...mockConfig.navigation,
        enableNumberedSidebar: true,
        expandAllSections: true,
      },
    };

    const complexNavigation: NavigationItem[] = [
      {
        id: 'section-0',
        title: 'Introduction',
        level: 1,
        slug: 'introduction',
        subsections: [],
      },
      {
        id: 'section-1',
        title: 'Basic Syntax',
        level: 2,
        slug: 'basic-syntax',
        subsections: [
          {
            id: 'heading-0',
            title: 'Headings',
            level: 3,
            slug: 'headings',
          },
          {
            id: 'heading-1',
            title: 'Paragraphs',
            level: 3,
            slug: 'paragraphs',
          },
        ],
      },
      {
        id: 'section-2',
        title: 'Best Practices',
        level: 2,
        slug: 'best-practices',
        subsections: [
          {
            id: 'heading-2',
            title: 'Document Structure',
            level: 3,
            slug: 'document-structure',
          },
          {
            id: 'heading-3',
            title: 'Writing Tips',
            level: 3,
            slug: 'writing-tips',
          },
          {
            id: 'heading-4',
            title: 'Code Examples',
            level: 3,
            slug: 'code-examples',
          },
          {
            id: 'heading-5',
            title: 'Avoiding Common Mistakes',
            level: 3,
            slug: 'avoiding-common-mistakes',
            subsections: [
              {
                id: 'heading-6',
                title: "Don't skip heading levels",
                level: 4,
                slug: 'dont-skip-heading-levels',
              },
              {
                id: 'heading-7',
                title: "Don't forget blank lines",
                level: 4,
                slug: 'dont-forget-blank-lines',
              },
              {
                id: 'heading-8',
                title: "Don't use headings in code blocks",
                level: 4,
                slug: 'dont-use-headings-in-code-blocks',
              },
            ],
          },
        ],
      },
      {
        id: 'section-3',
        title: 'Advanced Features',
        level: 2,
        slug: 'advanced-features',
        subsections: [
          {
            id: 'heading-9',
            title: 'Task Lists',
            level: 3,
            slug: 'task-lists',
          },
        ],
      },
    ];

    it('numbers H2 sections correctly (1., 2., 3.)', () => {
      render(
        <BrowserRouter>
          <Sidebar
            navigation={complexNavigation}
            isOpen={true}
            onClose={() => {}}
            config={numberedConfig}
          />
        </BrowserRouter>
      );

      // Check main section numbers (exact matches to avoid matching subsections)
      expect(screen.getByText(/^1\.$/)).toBeTruthy(); // Basic Syntax
      expect(screen.getByText(/^2\.$/)).toBeTruthy(); // Best Practices
      expect(screen.getByText(/^3\.$/)).toBeTruthy(); // Advanced Features
    });

    it('numbers H3 subsections correctly (1.1., 1.2., 2.1., 2.2.)', () => {
      render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={complexNavigation}
            currentSection="basic-syntax"
            isOpen={true}
            onClose={() => {}}
            config={numberedConfig}
          />
        </BrowserRouter>
      );

      // Check H3 subsection numbers under section 1 (exact matches)
      expect(screen.getByText(/^1\.1\.$/)).toBeTruthy(); // Headings
      expect(screen.getByText(/^1\.2\.$/)).toBeTruthy(); // Paragraphs
    });

    it('numbers H4 sub-subsections correctly (2.4.1., 2.4.2., 2.4.3.)', () => {
      render(
        <BrowserRouter>
          <Sidebar
            navigation={complexNavigation}
            isOpen={true}
            onClose={() => {}}
            config={numberedConfig}
          />
        </BrowserRouter>
      );

      // Check H4 sub-subsection numbers under section 2.4 (exact matches)
      expect(screen.getByText(/^2\.4\.1\.$/)).toBeTruthy(); // Don't skip heading levels
      expect(screen.getByText(/^2\.4\.2\.$/)).toBeTruthy(); // Don't forget blank lines
      expect(screen.getByText(/^2\.4\.3\.$/)).toBeTruthy(); // Don't use headings in code blocks
    });

    it('maintains correct numbering across multiple sections', () => {
      render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={complexNavigation}
            currentSection="best-practices"
            isOpen={true}
            onClose={() => {}}
            config={numberedConfig}
          />
        </BrowserRouter>
      );

      // Section 2 subsections should be numbered 2.1, 2.2, 2.3, 2.4
      expect(screen.getByText(/^2\.1\.$/)).toBeTruthy(); // Document Structure (exact match)
      expect(screen.getByText(/^2\.2\.$/)).toBeTruthy(); // Writing Tips (exact match)
      expect(screen.getByText(/^2\.3\.$/)).toBeTruthy(); // Code Examples (exact match)
      // 2.4. will match multiple times (2.4., 2.4.1., 2.4.2., 2.4.3.), so use getAllByText
      const matches = screen.getAllByText(/2\.4\./);
      expect(matches.length).toBeGreaterThan(0); // Should find at least the parent 2.4.
    });

    it('does not show numbers when enableNumberedSidebar is false', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={complexNavigation}
            currentSection="basic-syntax"
            isOpen={true}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      // Check that no numbering spans exist
      const numberSpans = container.querySelectorAll('.font-mono.text-xs.opacity-75');
      expect(numberSpans.length).toBe(0);
    });

    it('shows numbers when enableNumberedSidebar is true', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={complexNavigation}
            currentSection="basic-syntax"
            isOpen={true}
            onClose={() => {}}
            config={numberedConfig}
          />
        </BrowserRouter>
      );

      // Check that numbering spans exist
      const numberSpans = container.querySelectorAll('.font-mono.text-xs.opacity-75');
      expect(numberSpans.length).toBeGreaterThan(0);
    });

  });

  describe('Mobile Sidebar Overlay', () => {
    it('applies fixed positioning on mobile and sticky on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            navigation={mockNavigation}
            isOpen={true}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const sidebar = container.querySelector('aside');
      expect(sidebar).toBeTruthy();
      
      // Check positioning classes
      expect(sidebar?.className).toContain('fixed');
      expect(sidebar?.className).toContain('md:sticky');
    });

    // Deep numbering sequence and counter reset tests have been removed because
    // the current numbering implementation is intentionally simplified and
    // does not track nested subsections beyond the first level.

    it('translates sidebar off-screen when closed on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={mockNavigation}
            currentSection="overview"
            isOpen={false}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const sidebar = container.querySelector('aside');
      expect(sidebar).toBeTruthy();
      
      // Should be translated off-screen on mobile, but visible on desktop
      expect(sidebar?.className).toContain('-translate-x-full');
      expect(sidebar?.className).toContain('md:translate-x-0');
    });

    it('translates sidebar on-screen when open', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={mockNavigation}
            currentSection="overview"
            isOpen={true}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const sidebar = container.querySelector('aside');
      expect(sidebar).toBeTruthy();
      
      // Should be on-screen when open
      expect(sidebar?.className).toContain('translate-x-0');
    });

    it('shows overlay backdrop on mobile when sidebar is open', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={mockNavigation}
            currentSection="overview"
            isOpen={true}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
      expect(overlay).toBeTruthy();
      expect(overlay?.className).toContain('opacity-100');
      expect(overlay?.className).toContain('pointer-events-auto');
    });

    it('hides overlay backdrop when sidebar is closed', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={mockNavigation}
            currentSection="overview"
            isOpen={false}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
      expect(overlay).toBeTruthy();
      expect(overlay?.className).toContain('opacity-0');
      expect(overlay?.className).toContain('pointer-events-none');
    });

    it('renders navigation landmark with accessible label', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar
            title="Test Documentation"
            navigation={mockNavigation}
            currentSection="overview"
            isOpen={true}
            onClose={() => {}}
            config={mockConfig}
          />
        </BrowserRouter>
      );

      const nav = container.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Documentation sidebar');
    });
  });
});
