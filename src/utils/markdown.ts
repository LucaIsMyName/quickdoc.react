import { marked } from 'marked';
import type { NavigationItem } from '../types';

// Configure marked with syntax highlighting
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Parse markdown content to HTML
 */
export const parseMarkdown = (content: string): string => {
  return marked.parse(content) as string;
};

/**
 * Extract title (first H1) from markdown content
 */
export const extractTitle = (content: string): string => {
  const h1Match = content.match(/^#\s+(.+)$/m);
  return h1Match?.[1] ?? 'Untitled';
};

/**
 * Extract navigation items from markdown based on heading level
 */
export const extractNavigation = (
  content: string,
  breakingPoint: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'
): NavigationItem[] => {
  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const maxLevel = levelMap[breakingPoint];
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: NavigationItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length ?? 0;
    const title = match[2]?.trim() ?? '';
    
    if (level <= maxLevel && level > 0) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      items.push({
        id: `heading-${items.length}`,
        title,
        level,
        slug,
      });
    }
  }

  return items;
};

/**
 * Generate slug from filename
 */
export const generateSlug = (filename: string): string => {
  return filename
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
