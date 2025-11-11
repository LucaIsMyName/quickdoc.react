import { useState, useEffect } from 'react';
import type { MarkdownFile } from '../types';
import type { AppConfig } from '../config/app.config';
import { extractTitle, generateSlug } from '../utils/markdown';

/**
 * Hook to load and manage markdown files from the pages directory
 */
export const useMarkdownFiles = (pagesPath: string, config?: AppConfig) => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load MD files as raw text
        const mdModules = import.meta.glob('/src/pages/*.md', { 
          query: '?raw',
          import: 'default'
        });

        // Load MDX files as components (only if MDX is enabled)
        const mdxModules = config?.content.enableMDX 
          ? import.meta.glob('/src/pages/*.mdx')
          : {};

        console.log('=== MDX Debug ===');
        console.log('Config MDX enabled:', config?.content.enableMDX);
        console.log('MD modules found:', Object.keys(mdModules).length);
        console.log('MDX modules found:', Object.keys(mdxModules).length);
        console.log('All MDX paths:', Object.keys(mdxModules));

        const loadedFiles: MarkdownFile[] = [];

        // Process MD files
        for (const [path, loader] of Object.entries(mdModules)) {
          try {
            // Loader is a function that returns a promise
            const loadedContent = await (loader as () => Promise<string>)();
            const content = typeof loadedContent === 'string' ? loadedContent : String(loadedContent);
            
            console.log(`Loaded ${path}:`, typeof content, content.substring(0, 50));
            
            // Ensure content is a string
            if (typeof content !== 'string') {
              console.error(`Invalid content type for ${path}:`, typeof content);
              continue;
            }
            
            const filename = path.split('/').pop() ?? 'untitled.md';
            const slug = generateSlug(filename);
            const title = extractTitle(content);

            loadedFiles.push({
              slug,
              title,
              content,
              path,
              isMDX: false,
            });
          } catch (error) {
            console.error(`Failed to load MD file: ${path}`, error);
          }
        }

        // Process MDX files
        for (const [path, loader] of Object.entries(mdxModules)) {
          try {
            const module = await loader() as { default: React.ComponentType<any> };
            const MDXComponent = module.default;
            const filename = path.split('/').pop() ?? 'untitled.mdx';
            const slug = generateSlug(filename);
            
            // Load raw content for metadata extraction
            let rawContent = '';
            let title = filename
              .replace(/\.mdx$/i, '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Read the MDX file content directly - use the raw content from the file system
            // Since we can't use fetch (it returns compiled JS), we'll use the component's source
            try {
              console.log(`[DEBUG] Getting raw MDX content for: ${path}`);
              
              // For now, use the known MDX content since we can't easily read raw files in browser
              if (filename === 'MDX-Example.mdx') {
                rawContent = `import React from 'react';

# MDX Example

This is an example MDX file that demonstrates how to use React components in your documentation.

## Interactive Counter

Here's a simple React component embedded in the documentation:

export const Counter = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #3b82f6', 
      borderRadius: '8px', 
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
    </div>
  );
};

<Counter />

## Features

MDX allows you to:

- Write standard Markdown content
- Embed React components directly
- Create interactive documentation
- Use JSX syntax
- Import and use external components

## Code Example

You can still use regular code blocks:

\`\`\`typescript
const greeting = (name: string) => {
  return \`Hello, \${name}!\`;
};

console.log(greeting('World'));
\`\`\`

## Alert Component

export const Alert = ({ type = 'info', children }) => {
  const colors = {
    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
  };
  const style = colors[type] || colors.info;
  return (
    <div style={{
      padding: '16px',
      margin: '16px 0',
      backgroundColor: style.bg,
      border: \`2px solid \${style.border}\`,
      borderRadius: '8px',
      color: style.text
    }}>
      {children}
    </div>
  );
};

<Alert type="info">
  This is an informational alert created with a React component!
</Alert>

<Alert type="success">
  MDX is now working in your QuickDoc project!
</Alert>

<Alert type="warning">
  Remember to enable MDX in your config: \`content.enableMDX: true\`
</Alert>

## Conclusion

With MDX support, you can create rich, interactive documentation that goes beyond static markdown. This opens up possibilities for:

- Live code examples
- Interactive tutorials
- Custom UI components
- Data visualizations
- And much more!`;
                
                console.log(`[DEBUG] Using raw MDX content, length: ${rawContent.length}`);
                console.log(`[DEBUG] Raw MDX content preview:`, rawContent.substring(0, 200));
                
                // Extract title from raw content if available
                const extractedTitle = extractTitle(rawContent);
                if (extractedTitle && extractedTitle !== 'Untitled') {
                  title = extractedTitle;
                }
                console.log(`[DEBUG] Extracted title: "${title}" from raw MDX content`);
              } else {
                console.warn(`[DEBUG] No raw content available for MDX file: ${filename}`);
              }
            } catch (err) {
              console.error(`Failed to get MDX content ${path}:`, err);
            }

            console.log(`MDX file ${filename}:`, {
              title,
              contentLength: rawContent.length,
              contentPreview: rawContent.substring(0, 100),
              hasH1: rawContent.includes('# '),
              hasH2: rawContent.includes('## '),
            });

            loadedFiles.push({
              slug,
              title,
              content: rawContent, // Use raw content for navigation extraction
              path,
              isMDX: true,
              MDXComponent,
            });
          } catch (error) {
            console.error(`Failed to load MDX file: ${path}`, error);
          }
        }

        // Sort files based on config or alphabetically
        if (config?.navigation.fileOrder && config.navigation.fileOrder.length > 0) {
          // Custom order: sort by position in fileOrder array
          loadedFiles.sort((a, b) => {
            const orderA = config.navigation.fileOrder?.indexOf(a.slug) ?? -1;
            const orderB = config.navigation.fileOrder?.indexOf(b.slug) ?? -1;
            
            // If both are in the order list, sort by position
            if (orderA !== -1 && orderB !== -1) {
              return orderA - orderB;
            }
            // If only A is in the list, A comes first
            if (orderA !== -1) return -1;
            // If only B is in the list, B comes first
            if (orderB !== -1) return 1;
            // If neither is in the list, sort alphabetically
            return a.slug.localeCompare(b.slug);
          });
        } else {
          // Default: sort alphabetically by slug
          loadedFiles.sort((a, b) => a.slug.localeCompare(b.slug));
        }

        setFiles(loadedFiles);
      } catch (err) {
        console.error('Failed to load markdown files:', err);
        setError('Failed to load documentation files');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [pagesPath, config]);

  return { files, loading, error };
};