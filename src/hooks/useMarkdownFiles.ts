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

        // Load MD files from both root and folders
        const mdModules = import.meta.glob(['/src/pages/*.md', '/src/pages/**/*.md'], { 
          query: '?raw',
          import: 'default'
        });

        // Load MDX files from both root and folders (only if MDX is enabled)
        const mdxModules = config?.content.enableMDX 
          ? import.meta.glob(['/src/pages/*.mdx', '/src/pages/**/*.mdx'])
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
              
              // The middleware now returns: export default "raw content"
              // Extract the string from the module format
              const moduleMatch = content.match(/export default "(.*)"/s);
              if (moduleMatch && moduleMatch[1]) {
                try {
                  // Unescape the JSON string
                  const rawMdxSource = JSON.parse(`"${moduleMatch[1]}"`);
                  console.log(`[MDX] Extracted raw MDX source, length: ${rawMdxSource.length}`);
                  console.log(`[MDX] Raw MDX preview:`, rawMdxSource.substring(0, 200));
                  content = rawMdxSource;
                } catch (parseError) {
                  console.error(`[MDX] Failed to parse module export:`, parseError);
                  console.log(`[MDX] Match content:`, moduleMatch[1].substring(0, 200));
                }
              } else {
                console.warn(`[MDX] Could not extract from module format for ${path}`);
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
            
            const pathParts = path.split('/');
            const filename = pathParts.pop() ?? 'untitled.md';
            
            // Check if this is a folder-based file
            const isInFolder = pathParts.length > 3; // /src/pages/folder/file.md
            let slug: string;
            
            if (isInFolder) {
              const folderName = pathParts[pathParts.length - 1] ?? 'unknown'; // Get folder name
              const cleanFilename = filename.replace(/^\d+-/, ''); // Remove numeric prefix
              
              // For index files, use just the folder name
              if (cleanFilename.startsWith('index.')) {
                slug = generateSlug(folderName);
              } else {
                // For chapter files, use folder/chapter format
                slug = `${generateSlug(folderName)}/${generateSlug(cleanFilename)}`;
              }
            } else {
              slug = generateSlug(filename);
            }
            
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
            const pathParts = path.split('/');
            const filename = pathParts.pop() ?? 'untitled.mdx';
            
            // Check if this is a folder-based file
            const isInFolder = pathParts.length > 3; // /src/pages/folder/file.mdx
            let slug: string;
            
            if (isInFolder) {
              const folderName = pathParts[pathParts.length - 1] ?? 'unknown'; // Get folder name
              const cleanFilename = filename.replace(/^\d+-/, ''); // Remove numeric prefix
              
              // For index files, use just the folder name
              if (cleanFilename.startsWith('index.')) {
                slug = generateSlug(folderName);
              } else {
                // For chapter files, use folder/chapter format
                slug = `${generateSlug(folderName)}/${generateSlug(cleanFilename)}`;
              }
            } else {
              slug = generateSlug(filename);
            }
            
            // Load raw MDX content
            const rawLoader = mdxRawModules[path];
            let rawContent = '';
            let title = filename
              .replace(/\.mdx$/i, '')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            if (rawLoader) {
              try {
                const module = await rawLoader();
                const loadedRawContent = module.default;
                rawContent = typeof loadedRawContent === 'string' ? loadedRawContent : String(loadedRawContent);
                
                // Extract title from raw content
                const extractedTitle = extractTitle(rawContent);
                if (extractedTitle && extractedTitle !== 'Untitled') {
                  title = extractedTitle;
                }
              } catch (err) {
                console.error(`[MDX] Failed to load raw content for ${path}:`, err);
              }
            }

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

        // Sort files: first by folder, then by numeric prefix, then alphabetically
        loadedFiles.sort((a, b) => {
          // Extract folder and order info from paths
          const getFileInfo = (file: MarkdownFile) => {
            const pathParts = file.path.split('/');
            const filename = pathParts[pathParts.length - 1] ?? '';
            const isInFolder = pathParts.length > 3;
            const folderName = isInFolder ? pathParts[pathParts.length - 2] ?? '' : '';
            const numericPrefix = filename.match(/^(\d+)-/)?.[1];
            const order = numericPrefix ? parseInt(numericPrefix, 10) : 999;
            
            return { folderName, order, filename, isInFolder };
          };
          
          const aInfo = getFileInfo(a);
          const bInfo = getFileInfo(b);
          
          // First, sort by folder (root files first, then folders alphabetically)
          if (aInfo.isInFolder !== bInfo.isInFolder) {
            return aInfo.isInFolder ? 1 : -1; // Root files first
          }
          
          if (aInfo.isInFolder && bInfo.isInFolder && aInfo.folderName !== bInfo.folderName) {
            return aInfo.folderName.localeCompare(bInfo.folderName);
          }
          
          // Within same folder (or root), sort by numeric prefix
          if (aInfo.order !== bInfo.order) {
            return aInfo.order - bInfo.order;
          }
          
          // Finally, sort alphabetically
          return aInfo.filename.localeCompare(bInfo.filename);
        });

        // Apply custom order if specified in config
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