import type { MarkdownFile } from '../types';

interface TabNavigationProps {
  files: MarkdownFile[];
  currentFile: string | null;
  onFileChange: (slug: string) => void;
}

export const TabNavigation = ({ files, currentFile, onFileChange }: TabNavigationProps) => {
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="flex overflow-x-auto scrollbar-thin">
        {files.map((file) => (
          <button
            key={file.slug}
            onClick={() => onFileChange(file.slug)}
            className={`
              px-4 py-2.5 text-xs font-medium whitespace-nowrap
              transition-colors duration-200 border-b-2
              ${
                currentFile === file.slug
                  ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
            `}
          >
            {file.title}
          </button>
        ))}
      </nav>
    </nav>
  );
};
