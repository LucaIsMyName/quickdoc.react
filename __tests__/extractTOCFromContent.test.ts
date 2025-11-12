import { describe, it, expect } from 'vitest';

// We need to extract the function to test it
// For now, we'll copy the implementation to test it
const extractTOCFromContent = (content: string, fileSlug: string) => {
  const lines = content.split('\n');
  const items: any[] = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    // Track fenced code block boundaries
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    // Skip if inside fenced code block
    if (inCodeBlock) {
      continue;
    }
    
    // Skip indented code blocks (4+ spaces at start of line)
    if (line.match(/^    /)) {
      continue;
    }
    
    // Extract headings - preserve inline code in headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 0;
      const title = headingMatch[2]?.trim() ?? '';
      
      // Only include H2-H6 headings (exclude H1)
      if (level >= 2 && level <= 6 && title) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        items.push({
          id: `${fileSlug}-heading-${items.length}`,
          title,
          level,
          slug,
          subsections: []
        });
      }
    }
  }

  return items;
};

describe('extractTOCFromContent', () => {
  it('should extract headings with inline code correctly', () => {
    const content = `# Main Title

## Key Directories

Place your Markdown files here. Each folder becomes a documentation section.

## \`/src/pages/\`

Configuration files for customizing QuickDoc behavior.

## \`/src/config/\`

React components that make up the QuickDoc interface.

## \`/src/components/\`

More content here.`;

    const result = extractTOCFromContent(content, 'test-file');
    
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      id: 'test-file-heading-0',
      title: 'Key Directories',
      level: 2,
      slug: 'key-directories',
      subsections: []
    });
    expect(result[1]).toEqual({
      id: 'test-file-heading-1',
      title: '`/src/pages/`',
      level: 2,
      slug: 'src-pages',
      subsections: []
    });
    expect(result[2]).toEqual({
      id: 'test-file-heading-2',
      title: '`/src/config/`',
      level: 2,
      slug: 'src-config',
      subsections: []
    });
    expect(result[3]).toEqual({
      id: 'test-file-heading-3',
      title: '`/src/components/`',
      level: 2,
      slug: 'src-components',
      subsections: []
    });
  });

  it('should ignore headings inside fenced code blocks', () => {
    const content = `# Main Title

## Valid Heading

Some content.

\`\`\`markdown
# This is an example
## This should be ignored
### Also ignored
\`\`\`

## Another Valid Heading

More content.`;

    const result = extractTOCFromContent(content, 'test-file');
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Valid Heading');
    expect(result[1].title).toBe('Another Valid Heading');
  });

  it('should ignore headings in indented code blocks', () => {
    const content = `# Main Title

## Valid Heading

Some content.

    # This is indented code
    ## This should be ignored

## Another Valid Heading

More content.`;

    const result = extractTOCFromContent(content, 'test-file');
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Valid Heading');
    expect(result[1].title).toBe('Another Valid Heading');
  });

  it('should exclude H1 headings but include H2-H6', () => {
    const content = `# Main Title (should be excluded)

## H2 Heading (included)

### H3 Heading (included)

#### H4 Heading (included)

##### H5 Heading (included)

###### H6 Heading (included)`;

    const result = extractTOCFromContent(content, 'test-file');
    
    expect(result).toHaveLength(5);
    expect(result[0].level).toBe(2);
    expect(result[1].level).toBe(3);
    expect(result[2].level).toBe(4);
    expect(result[3].level).toBe(5);
    expect(result[4].level).toBe(6);
  });

  it('should handle mixed content with code blocks and inline code', () => {
    const content = `# File Structure

## Key Directories

\`\`\`
quickdoc.react/
├── src/
│   ├── components/         # React components
│   ├── config/            # Configuration files
│   └── pages/             # Your documentation files
\`\`\`

## \`/src/pages/\`

Place your Markdown files here.

## \`/src/config/\`

Configuration files for customizing behavior.`;

    const result = extractTOCFromContent(content, 'test-file');
    
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('Key Directories');
    expect(result[1].title).toBe('`/src/pages/`');
    expect(result[2].title).toBe('`/src/config/`');
  });
});
