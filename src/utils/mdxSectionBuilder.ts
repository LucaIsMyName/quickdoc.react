/**
 * MDX Section Builder
 * Reconstructs complete MDX source for individual sections
 * by combining imports, exports, and section content
 */

import type { MDXImport, MDXExport, MDXSection } from './mdxParser';

export interface ReconstructedSection {
  slug: string;
  title: string;
  level: number;
  mdxSource: string;
}

/**
 * Rebuild MDX source for a single section
 * Includes all imports and exports from the original file
 * plus the content for this specific section
 */
export const buildSectionMDX = (
  section: MDXSection,
  imports: MDXImport[],
  exports: MDXExport[]
): ReconstructedSection => {
  const parts: string[] = [];

  // 1. Add all imports at the top
  if (imports.length > 0) {
    const importLines = imports.map(imp => imp.line);
    parts.push(importLines.join('\n'));
    parts.push(''); // Blank line after imports
  }

  // 2. Add all component exports
  if (exports.length > 0) {
    const exportContents = exports.map(exp => exp.content);
    parts.push(exportContents.join('\n\n'));
    parts.push(''); // Blank line after exports
  }

  // 3. Add section content
  parts.push(section.content);

  return {
    slug: section.slug,
    title: section.title,
    level: section.level,
    mdxSource: parts.join('\n'),
  };
};

/**
 * Build MDX source for all sections
 */
export const buildAllSections = (
  sections: MDXSection[],
  imports: MDXImport[],
  exports: MDXExport[]
): ReconstructedSection[] => {
  return sections.map(section => buildSectionMDX(section, imports, exports));
};

/**
 * Build introduction section from content before first breaking point
 * This handles content that appears before the first H2 (or configured breakpoint)
 */
export const buildIntroSection = (
  content: string,
  breakingPoint: 'h1' | 'h2' | 'h3' | 'h4' = 'h2',
  imports: MDXImport[],
  exports: MDXExport[]
): ReconstructedSection | null => {
  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const breakLevel = levelMap[breakingPoint];
  
  const lines = content.split('\n');
  const introLines: string[] = [];
  let foundBreakpoint = false;
  let inCodeBlock = false;

  for (const line of lines) {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    // Check for breaking point heading (outside code blocks)
    if (!inCodeBlock) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1]?.length ?? 0;
        if (level === breakLevel) {
          foundBreakpoint = true;
          break;
        }
      }
    }

    introLines.push(line);
  }

  // Only create intro section if there's content before the breakpoint
  if (foundBreakpoint && introLines.length > 0) {
    const introContent = introLines.join('\n');
    
    // Extract title from H1 if present
    const h1Match = introContent.match(/^#\s+(.+)$/m);
    const title = h1Match?.[1] ?? 'Introduction';

    const parts: string[] = [];

    // Add imports
    if (imports.length > 0) {
      const importLines = imports.map(imp => imp.line);
      parts.push(importLines.join('\n'));
      parts.push('');
    }

    // Add exports
    if (exports.length > 0) {
      const exportContents = exports.map(exp => exp.content);
      parts.push(exportContents.join('\n\n'));
      parts.push('');
    }

    // Add intro content
    parts.push(introContent);

    return {
      slug: 'introduction',
      title,
      level: 1,
      mdxSource: parts.join('\n'),
    };
  }

  return null;
};
