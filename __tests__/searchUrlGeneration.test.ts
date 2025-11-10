import { describe, it, expect, beforeEach } from 'vitest';

// Mock data that simulates the structure from useDocumentSearch
const mockConfig = {
  navigation: {
    breakingPoint: 'h2' as const
  },
  // ... other config properties would be here
} as any;

// Mock file content that represents a typical markdown structure
const mockFileContent = `# Main Title

Some intro content here.

## Basic Settings

This is the basic settings section with some content.

### Configuration Options

Details about configuration options.

### Advanced Settings

More advanced configuration details.

## Export Functionality

This section covers export features.

### PDF Export

Information about PDF export.

### Markdown Export

Information about Markdown export.

## URL Structure

This section explains URL structure.

### Route Patterns

Details about route patterns.
`;

const mockFile = {
  slug: 'quickdoc',
  title: 'QuickDoc',
  content: mockFileContent
};

// Test cases for different section levels and expected URLs
const testCases = [
  // File level (H1 or no section)
  {
    description: 'File level navigation',
    section: { level: 1, slug: 'quickdoc', title: 'QuickDoc' },
    expectedUrl: '/quickdoc',
    shouldWork: true
  },
  
  // H2 level (breakpoints)
  {
    description: 'H2 breakpoint - Basic Settings',
    section: { level: 2, slug: 'basic-settings', title: 'Basic Settings' },
    expectedUrl: '/quickdoc/basic-settings',
    shouldWork: true
  },
  {
    description: 'H2 breakpoint - Export Functionality',
    section: { level: 2, slug: 'export-functionality', title: 'Export Functionality' },
    expectedUrl: '/quickdoc/export-functionality',
    shouldWork: true
  },
  {
    description: 'H2 breakpoint - URL Structure',
    section: { level: 2, slug: 'url-structure', title: 'URL Structure' },
    expectedUrl: '/quickdoc/url-structure',
    shouldWork: true
  },
  
  // H3 level (should find parent H2)
  {
    description: 'H3 under Basic Settings',
    section: { level: 3, slug: 'configuration-options', title: 'Configuration Options' },
    expectedUrl: '/quickdoc/basic-settings#configuration-options',
    shouldWork: true
  },
  {
    description: 'H3 under Basic Settings - Advanced',
    section: { level: 3, slug: 'advanced-settings', title: 'Advanced Settings' },
    expectedUrl: '/quickdoc/basic-settings#advanced-settings',
    shouldWork: true
  },
  {
    description: 'H3 under Export Functionality - PDF',
    section: { level: 3, slug: 'pdf-export', title: 'PDF Export' },
    expectedUrl: '/quickdoc/export-functionality#pdf-export',
    shouldWork: true
  },
  {
    description: 'H3 under Export Functionality - Markdown',
    section: { level: 3, slug: 'markdown-export', title: 'Markdown Export' },
    expectedUrl: '/quickdoc/export-functionality#markdown-export',
    shouldWork: true
  },
  {
    description: 'H3 under URL Structure',
    section: { level: 3, slug: 'route-patterns', title: 'Route Patterns' },
    expectedUrl: '/quickdoc/url-structure#route-patterns',
    shouldWork: true
  },
  
  // Edge cases
  {
    description: 'H3 with no parent H2 (should fallback)',
    section: { level: 3, slug: 'orphaned-section', title: 'Orphaned Section' },
    expectedUrl: '/quickdoc#orphaned-section',
    shouldWork: true
  }
];

// Copy the URL generation logic from SearchDialog for testing
function getResultUrl(result: any, config: any) {
  const baseUrl = `/${result.file.slug}`;
  
  // If it's just the file (level 1), link to file only
  if (result.section.level === 1 || result.section.slug === result.file.slug) {
    return baseUrl;
  }
  
  // For sections, consider breaking points
  if (result.section.slug && result.section.slug !== result.file.slug) {
    if (config.navigation.breakingPoint === 'h2') {
      if (result.section.level === 2) {
        // H2 sections get their own route segment: /file/breakpoint
        return `${baseUrl}/${result.section.slug}`;
      } else if (result.section.level > 2) {
        // H3+ sections need parent H2 + anchor: /file/breakpoint#headline
        // Find the parent H2 section for this H3+ section
        const parentH2 = findParentH2Section(result.file, result.section);
        if (parentH2) {
          return `${baseUrl}/${parentH2.slug}#${result.section.slug}`;
        } else {
          // Fallback if no parent H2 found
          return `${baseUrl}#${result.section.slug}`;
        }
      }
    }
    return `${baseUrl}#${result.section.slug}`;
  }
  
  return baseUrl;
}

// Copy the helper function from SearchDialog
function findParentH2Section(file: any, section: any) {
  const lines = file.content.split('\n');
  let currentH2: any = null;
  let foundSection = false;
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      if (level === 2) {
        currentH2 = { title, slug, level };
      } else if (slug === section.slug && level > 2) {
        foundSection = true;
        break;
      }
    }
  }
  
  return foundSection ? currentH2 : null;
}

describe('Search URL Generation', () => {
  testCases.forEach(testCase => {
    it(`should generate correct URL for: ${testCase.description}`, () => {
      const result = {
        file: mockFile,
        section: testCase.section
      };
      
      const generatedUrl = getResultUrl(result, mockConfig);
      
      console.log(`Test: ${testCase.description}`);
      console.log(`Expected: ${testCase.expectedUrl}`);
      console.log(`Generated: ${generatedUrl}`);
      console.log(`Match: ${generatedUrl === testCase.expectedUrl ? '✅' : '❌'}`);
      console.log('---');
      
      expect(generatedUrl).toBe(testCase.expectedUrl);
    });
  });

  it('should correctly parse markdown headings', () => {
    const testSection = { level: 3, slug: 'configuration-options', title: 'Configuration Options' };
    const parentH2 = findParentH2Section(mockFile, testSection);
    
    expect(parentH2).toBeTruthy();
    expect(parentH2?.slug).toBe('basic-settings');
    expect(parentH2?.title).toBe('Basic Settings');
  });

  it('should handle sections with no parent H2', () => {
    const testSection = { level: 3, slug: 'nonexistent-section', title: 'Nonexistent Section' };
    const parentH2 = findParentH2Section(mockFile, testSection);
    
    expect(parentH2).toBeNull();
  });

  it('should generate correct slug from title', () => {
    const testCases = [
      { title: 'Basic Settings', expectedSlug: 'basic-settings' },
      { title: 'Export Functionality', expectedSlug: 'export-functionality' },
      { title: 'URL Structure', expectedSlug: 'url-structure' },
      { title: 'Configuration Options', expectedSlug: 'configuration-options' },
      { title: 'PDF Export', expectedSlug: 'pdf-export' }
    ];

    testCases.forEach(({ title, expectedSlug }) => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      expect(slug).toBe(expectedSlug);
    });
  });
});
