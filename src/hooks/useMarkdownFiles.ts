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

        // In a real implementation, you'd fetch a manifest or use import.meta.glob
        // For now, we'll use Vite's glob import feature
        const modules = import.meta.glob('/public/pages/*.{md,mdx}', { 
          query: '?raw',
          import: 'default'
        });

        const loadedFiles: MarkdownFile[] = [];

        for (const [path, loader] of Object.entries(modules)) {
          const content = await loader() as string;
          const filename = path.split('/').pop() ?? 'untitled.md';
          const slug = generateSlug(filename);
          const title = extractTitle(content);

          loadedFiles.push({
            slug,
            title,
            content,
            path,
          });
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