import type { ContentSection, NavigationItem } from '../types';
import { parseMDX } from './mdxParser';
import { buildIntroSection, buildAllSections } from './mdxSectionBuilder';

/**
 * Split MDX content into sections with full imports/exports preservation
 * Each section gets all imports and component exports from the original file
 */
export const splitMDXContentBySections = (
  content: string,
  breakingPoint: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'
): ContentSection[] => {
  console.log('[MDX Splitter] Starting MDX content split');
  console.log('[MDX Splitter] Content length:', content.length);
  console.log('[MDX Splitter] Breaking point:', breakingPoint);

  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const breakLevel = levelMap[breakingPoint];

  // Parse MDX to extract imports, exports, and sections
  const parsed = parseMDX(content, breakingPoint);
  
  console.log('[MDX Splitter] Parsed result:', {
    imports: parsed.imports.length,
    exports: parsed.exports.length,
    sections: parsed.sections.length,
  });

  const contentSections: ContentSection[] = [];

  // Build intro section if there's content before first breakpoint
  const introSection = buildIntroSection(
    content,
    breakingPoint,
    parsed.imports,
    parsed.exports
  );

  if (introSection) {
    console.log('[MDX Splitter] Built intro section:', introSection.title);
    contentSections.push({
      slug: introSection.slug,
      title: introSection.title,
      content: introSection.mdxSource,
      level: introSection.level,
      subsections: extractSubsections(introSection.mdxSource, breakLevel),
    });
  }

  // Build all other sections
  const reconstructedSections = buildAllSections(
    parsed.sections,
    parsed.imports,
    parsed.exports
  );

  for (const section of reconstructedSections) {
    console.log('[MDX Splitter] Built section:', section.title);
    contentSections.push({
      slug: section.slug,
      title: section.title,
      content: section.mdxSource,
      level: section.level,
      subsections: extractSubsections(section.mdxSource, breakLevel),
    });
  }

  console.log('[MDX Splitter] Final sections count:', contentSections.length);
  return contentSections;
};

/**
 * Split markdown content into sections based on breaking point
 * Each section becomes a separate "page"
 * 
 * For regular Markdown files only (not MDX)
 */
export const splitContentBySections = (
  content: string,
  breakingPoint: 'h1' | 'h2' | 'h3' | 'h4' = 'h2',
  isMDX: boolean = false
): ContentSection[] => {
  // Use MDX splitter for MDX files
  if (isMDX) {
    return splitMDXContentBySections(content, breakingPoint);
  }
  // Ensure content is a string and not empty
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return [{
      slug: 'content',
      title: 'Content',
      content: '',
      level: 1,
      subsections: [],
    }];
  }

  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const breakLevel = levelMap[breakingPoint];
  
  const lines = content.split('\n');
  const sections: ContentSection[] = [];
  let currentSection: ContentSection | null = null;
  let currentContent: string[] = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    // Track code block state - MUST be checked BEFORE heading detection
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      // Always add code block delimiters to content
      if (currentSection) {
        currentContent.push(line);
      } else {
        currentContent.push(line);
      }
      continue;
    }
    
    // Skip heading detection if we're inside a code block
    if (!inCodeBlock) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headingMatch) {
        const level = headingMatch[1]?.length ?? 0;
        const title = headingMatch[2]?.trim() ?? '';
        
        // If this is a breaking point heading, start a new section
        if (level === breakLevel) {
          // Save previous section
          if (currentSection) {
            currentSection.content = currentContent.join('\n');
            currentSection.subsections = extractSubsections(currentSection.content, breakLevel);
            sections.push(currentSection);
          }
          
          // Start new section
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          
          currentSection = {
            slug,
            title,
            content: '',
            level,
            subsections: [],
          };
          currentContent = [line];
          continue;
        }
      }
    }
    
    // Add line to current content (whether in code block or not)
    if (currentSection) {
      currentContent.push(line);
    } else {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n');
    currentSection.subsections = extractSubsections(currentSection.content, breakLevel);
    sections.push(currentSection);
  }
  
  // Always create intro section for H1 + content before first H2
  const introLines: string[] = [];
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 0;
      if (level === breakLevel) {
        break;
      }
    }
    introLines.push(line);
  }
  
  if (introLines.length > 0) {
    const introContent = introLines.join('\n');
    const h1Match = introContent.match(/^#\s+(.+)$/m);
    const introTitle = h1Match?.[1] ?? 'Introduction';
    
    sections.unshift({
      slug: 'introduction',
      title: introTitle,
      content: introContent,
      level: 1,
      subsections: extractSubsections(introContent, breakLevel),
    });
  }
  
  return sections;
};

/**
 * Extract subsections (headings below the breaking point level)
 */
// Global counter to ensure unique IDs across all sections
let globalHeadingCounter = 0;

const extractSubsections = (content: string, breakLevel: number): NavigationItem[] => {
  const items: NavigationItem[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    
    // Toggle code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // Skip lines inside code blocks
    if (inCodeBlock) continue;

    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 0;
      const title = headingMatch[2]?.trim() ?? '';
      
      // Only include headings below the breaking point
      if (level > breakLevel) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        items.push({
          id: `heading-${globalHeadingCounter++}`, // FIXED: Use global counter for unique IDs
          title,
          level,
          slug,
        });
      }
    }
  }

  return items;
};

/**
 * Get main navigation items (breaking point headings only)
 */
export const getMainNavigation = (
  content: string,
  breakingPoint: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'
): NavigationItem[] => {
  const levelMap = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const breakLevel = levelMap[breakingPoint];
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: NavigationItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length ?? 0;
    const title = match[2]?.trim() ?? '';
    
    // Only include breaking point level headings
    if (level === breakLevel) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      items.push({
        id: `section-${items.length}`,
        title,
        level,
        slug,
      });
    }
  }

  return items;
};
