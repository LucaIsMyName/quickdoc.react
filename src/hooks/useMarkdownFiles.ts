import { useState, useEffect } from 'react';
import type { MarkdownFile } from '../types';
import { extractTitle, generateSlug } from '../utils/markdown';

/**
 * Hook to load and manage markdown files from the pages directory
 */
export const useMarkdownFiles = (pagesPath: string) => {
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

        // Sort files alphabetically by slug
        loadedFiles.sort((a, b) => a.slug.localeCompare(b.slug));

        setFiles(loadedFiles);
      } catch (err) {
        console.error('Failed to load markdown files:', err);
        setError('Failed to load documentation files');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [pagesPath]);

  return { files, loading, error };
};
