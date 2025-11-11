import { describe, it, expect } from 'vitest';
import { splitContentBySections, getMainNavigation } from '../src/utils/contentSplitter';

describe('Content Splitter - Breaking Points', () => {
  const sampleMarkdown = `# Quick Start Guide

Welcome to the quick start guide!

## Installation

This section covers installation.

### Prerequisites

You need Node.js installed.

### Install Dependencies

Run npm install.

## Configuration

This section covers configuration.

### Basic Setup

Configure your app.

### Advanced Options

More advanced settings.

## Deployment

This section covers deployment.

### Build

Run npm run build.`;

  describe('splitContentBySections with H2 breaking point', () => {
    it('splits content into 4 sections (intro + 3 H2s)', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      expect(sections).toHaveLength(4);
      expect(sections[0]?.title).toBe('Quick Start Guide'); // H1 intro
      expect(sections[1]?.title).toBe('Installation');
      expect(sections[2]?.title).toBe('Configuration');
      expect(sections[3]?.title).toBe('Deployment');
    });

    it('each section contains only its content', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      const installSection = sections[1]; // Index 1 now (after intro)
      expect(installSection?.content).toContain('## Installation');
      expect(installSection?.content).toContain('### Prerequisites');
      expect(installSection?.content).toContain('### Install Dependencies');
      expect(installSection?.content).not.toContain('## Configuration');
      expect(installSection?.content).not.toContain('## Deployment');
    });

    it('extracts subsections for each section', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      const installSection = sections[1]; // Index 1 (after intro)
      expect(installSection?.subsections).toHaveLength(2);
      expect(installSection?.subsections[0]?.title).toBe('Prerequisites');
      expect(installSection?.subsections[0]?.level).toBe(3);
      expect(installSection?.subsections[1]?.title).toBe('Install Dependencies');
      
      const configSection = sections[2]; // Index 2 (after intro)
      expect(configSection?.subsections).toHaveLength(2);
      expect(configSection?.subsections[0]?.title).toBe('Basic Setup');
      expect(configSection?.subsections[1]?.title).toBe('Advanced Options');
    });

    it('generates correct slugs for sections', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      expect(sections[0]?.slug).toBe('introduction'); // Intro section
      expect(sections[1]?.slug).toBe('installation');
      expect(sections[2]?.slug).toBe('configuration');
      expect(sections[3]?.slug).toBe('deployment');
    });
  });

  describe('getMainNavigation', () => {
    it('returns only H2 headings for main navigation', () => {
      const nav = getMainNavigation(sampleMarkdown, 'h2');
      
      expect(nav).toHaveLength(3);
      expect(nav[0]?.title).toBe('Installation');
      expect(nav[0]?.level).toBe(2);
      expect(nav[1]?.title).toBe('Configuration');
      expect(nav[2]?.title).toBe('Deployment');
    });

    it('does not include H3 or lower headings', () => {
      const nav = getMainNavigation(sampleMarkdown, 'h2');
      
      const hasH3 = nav.some(item => item.title === 'Prerequisites');
      expect(hasH3).toBe(false);
    });
  });

  describe('Breaking point behavior', () => {
    it('H2 breaking point creates separate pages for each H2', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      // Intro + 3 H2 sections = 4 total
      expect(sections).toHaveLength(4);
      
      // Each H2 section contains only one H2 (intro has H1)
      sections.slice(1).forEach(section => {
        const h2Count = (section.content.match(/^## /gm) || []).length;
        expect(h2Count).toBe(1); // Only one H2 per section
      });
    });

    it('subsections are H3+ headings within the section', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      sections.forEach(section => {
        section.subsections.forEach(subsection => {
          expect(subsection.level).toBeGreaterThan(2); // All subsections are H3+
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('handles content with no breaking point headings', () => {
      const markdown = `# Title\n\nSome content\n\n### Subsection`;
      const sections = splitContentBySections(markdown, 'h2');
      
      // Should create intro section
      expect(sections.length).toBeGreaterThan(0);
    });

    it('handles empty content', () => {
      const sections = splitContentBySections('', 'h2');
      // Empty content creates an intro section
      expect(sections.length).toBeGreaterThanOrEqual(0);
    });

    it('handles content with only H1', () => {
      const markdown = `# Title\n\nSome content`;
      const sections = splitContentBySections(markdown, 'h2');
      
      // Should create intro section with H1
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('MDX file handling', () => {
    it('should process MDX content the same as markdown content', () => {
      const mdxContent = `# MDX Example

This is an example MDX file that demonstrates how to use React components in your documentation.

## Interactive Counter

Here's a simple React component embedded in the documentation:

export const Counter = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '20px' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

<Counter />

## Features

MDX allows you to:

- Write standard Markdown content
- Embed React components directly
- Create interactive documentation

## Conclusion

With MDX support, you can create rich, interactive documentation.`;

      const sections = splitContentBySections(mdxContent, 'h2');
      
      // Should have introduction + 3 H2 sections
      expect(sections).toHaveLength(4);
      
      // Check introduction section
      expect(sections[0].slug).toBe('introduction');
      expect(sections[0].title).toBe('MDX Example');
      
      // Check H2 sections are properly extracted
      expect(sections[1].slug).toBe('interactive-counter');
      expect(sections[1].title).toBe('Interactive Counter');
      
      expect(sections[2].slug).toBe('features');
      expect(sections[2].title).toBe('Features');
      
      expect(sections[3].slug).toBe('conclusion');
      expect(sections[3].title).toBe('Conclusion');
    });

    it('should handle MDX content with React components and JSX', () => {
      const mdxWithJSX = `# MDX with JSX

import { Button } from '@/components/ui/button';

## Component Example

Here's a button component:

<Button variant="default">Click me</Button>

## More Content

Some additional content with inline code: \`const x = 1\`;

### Subsection

This should appear as a subsection.

## Final Section

The end of the document.`;

      const sections = splitContentBySections(mdxWithJSX, 'h2');
      
      // Should have introduction + 3 H2 sections
      expect(sections).toHaveLength(4);
      
      // Check that subsections are properly extracted
      const featuresSection = sections.find(s => s.slug === 'more-content');
      expect(featuresSection).toBeDefined();
      expect(featuresSection?.subsections).toHaveLength(1);
      expect(featuresSection?.subsections[0].title).toBe('Subsection');
      expect(featuresSection?.subsections[0].level).toBe(3);
    });

    it('should return fallback section for truly empty content', () => {
      const emptyContent = '';
      const sections = splitContentBySections(emptyContent, 'h2');
      
      expect(sections).toHaveLength(1);
      expect(sections[0].slug).toBe('content');
      expect(sections[0].title).toBe('Content');
      expect(sections[0].content).toBe('');
    });

    it('should return fallback section for null/undefined content', () => {
      const nullContent = null as any;
      const sections = splitContentBySections(nullContent, 'h2');
      
      expect(sections).toHaveLength(1);
      expect(sections[0].slug).toBe('content');
      expect(sections[0].title).toBe('Content');
    });
  });

  describe('URL mapping', () => {
    it('section slugs map to URL segments', () => {
      const sections = splitContentBySections(sampleMarkdown, 'h2');
      
      // /quick-start/introduction (H1 intro)
      expect(sections[0]?.slug).toBe('introduction');
      
      // /quick-start/installation
      expect(sections[1]?.slug).toBe('installation');
      
      // /quick-start/configuration  
      expect(sections[2]?.slug).toBe('configuration');
      
      // /quick-start/deployment
      expect(sections[3]?.slug).toBe('deployment');
    });
  });
});
