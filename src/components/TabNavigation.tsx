import type { MarkdownFile } from '../types';
import { memo, useCallback } from 'react';
import { ScrollFade } from './ScrollFade';

interface TabNavigationProps {
  files: MarkdownFile[];
  currentFile: string | null;
  onFileChange: (slug: string) => void;
}

const TabNavigationComponent = ({ files, currentFile, onFileChange }: TabNavigationProps) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleFileClick = useCallback((slug: string) => {
    onFileChange(slug);
  }, [onFileChange]);
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <ScrollFade 
        direction="horizontal" 
        size={32}
        intensity={0.9}
        className="flex"
      >
        {files.map((file) => (
          <button
            key={file.slug}
            onClick={() => handleFileClick(file.slug)}
            className={`
              px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200
              ${currentFile === file.slug
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {file.title}
          </button>
        ))}
      </ScrollFade>
    </nav>
  );
};

// Memoize the TabNavigation component to prevent unnecessary re-renders
export const TabNavigation = memo(TabNavigationComponent);
