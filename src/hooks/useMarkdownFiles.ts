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

        // We'll load raw MDX content using fetch since dynamic imports aren't working
        const mdxRawModules: Record<string, () => Promise<{ default: string }>> = {};
        
        if (config?.content.enableMDX) {
          // Create fetch-based loaders for each MDX file
          for (const path of Object.keys(mdxModules)) {
            mdxRawModules[path] = async () => {
              console.log(`[MDX] Fetching raw content from: ${path}?mdx-raw`);
              const response = await fetch(path + '?mdx-raw');
              let content = await response.text();
              console.log(`[MDX] Fetched content length: ${content.length}`);
              console.log(`[MDX] Fetched content preview:`, content.substring(0, 200));
              
              // Extract the raw MDX source from the compiled JavaScript
              // The source is stored as: const MDXLayout = "escaped_mdx_source";
              const mdxLayoutMatch = content.match(/const MDXLayout = "(.*?)";/s);
              if (mdxLayoutMatch && mdxLayoutMatch[1]) {
                // Properly unescape the JSON-escaped string content
                try {
                  let rawMdxSource = JSON.parse(`"${mdxLayoutMatch[1]}"`);
                  console.log(`[MDX] Extracted raw MDX source, length: ${rawMdxSource.length}`);
                  console.log(`[MDX] Raw MDX preview:`, rawMdxSource.substring(0, 200));
                  
                  // Remove React import since the compiler provides React as a parameter
                  rawMdxSource = rawMdxSource.replace(/^import\s+React\s+from\s+['"]react['"];\s*\n?/m, '');
                  console.log(`[MDX] Cleaned MDX source, length: ${rawMdxSource.length}`);
                  console.log(`[MDX] Cleaned preview:`, rawMdxSource.substring(0, 200));
                  
                  content = rawMdxSource;
                } catch (parseError) {
                  console.error(`[MDX] Failed to parse extracted MDX source:`, parseError);
                  console.log(`[MDX] Raw extracted string:`, mdxLayoutMatch[1].substring(0, 200));
                }
              } else {
                console.warn(`[MDX] Could not extract raw MDX source from compiled content`);
                console.log(`[MDX] Content structure:`, content.substring(0, 500));
              }
              
              return { default: content };
            };
          }
        }

        console.log('=== MDX Debug ===');
        console.log('Config MDX enabled:', config?.content.enableMDX);
        console.log('MD modules found:', Object.keys(mdModules).length);
        console.log('MDX modules found:', Object.keys(mdxModules).length);
        console.log('MDX raw modules found:', Object.keys(mdxRawModules).length);
        console.log('All MDX paths:', Object.keys(mdxModules));
        console.log('All MDX RAW paths:', Object.keys(mdxRawModules));
        console.log('Raw modules object:', mdxRawModules);

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
            // Load compiled MDX component
            const module = await loader() as { default: React.ComponentType<any> };
            const MDXComponent = module.default;
            const filename = path.split('/').pop() ?? 'untitled.mdx';
            const slug = generateSlug(filename);
            
            // Load raw MDX content
            const rawLoader = mdxRawModules[path];
            console.log(`[MDX] Looking for raw loader for path: ${path}`);
            console.log(`[MDX] Raw loader found:`, !!rawLoader);
            console.log(`[MDX] Available raw paths:`, Object.keys(mdxRawModules));
            let rawContent = '';
            let title = filename
              .replace(/\.mdx$/i, '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            if (rawLoader) {
              try {
                console.log(`[MDX] Loading raw content for: ${path}`);
                const module = await rawLoader();
                const loadedRawContent = module.default;
                console.log(`[MDX] Type of loaded content:`, typeof loadedRawContent);
                console.log(`[MDX] Is function?:`, typeof loadedRawContent === 'function');
                console.log(`[MDX] Raw loaded content preview:`, String(loadedRawContent).substring(0, 200));
                
                rawContent = typeof loadedRawContent === 'string' ? loadedRawContent : String(loadedRawContent);
                
                console.log(`[MDX] Raw content loaded, length: ${rawContent.length}`);
                console.log(`[MDX] Preview:`, rawContent.substring(0, 150));
                
                // Extract title from raw content
                const extractedTitle = extractTitle(rawContent);
                if (extractedTitle && extractedTitle !== 'Untitled') {
                  title = extractedTitle;
                }
                console.log(`[MDX] Extracted title: "${title}"`);
              } catch (err) {
                console.error(`[MDX] Failed to load raw content for ${path}:`, err);
              }
            } else {
              console.warn(`[MDX] No raw loader found for: ${path}`);
            }

            console.log(`[MDX] File ${filename}:`, {
              title,
              contentLength: rawContent.length,
              hasH1: rawContent.includes('# '),
              hasH2: rawContent.includes('## '),
            });

            loadedFiles.push({
              slug,
              title,
              content: rawContent, // Raw content for section splitting
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