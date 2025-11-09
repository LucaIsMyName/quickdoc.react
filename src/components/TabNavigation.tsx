import type { MarkdownFile } from '../types';

interface TabNavigationProps {
  files: MarkdownFile[];
  currentFile: string | null;
  onFileChange: (slug: string) => void;
}

export const TabNavigation = ({ files, currentFile, onFileChange }: TabNavigationProps) => {
  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex overflow-x-auto scrollbar-thin">
        {files.map((file) => (
          <button
            key={file.slug}
            onClick={() => onFileChange(file.slug)}
            className={`
              px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium whitespace-nowrap
              transition-colors duration-200 border-b-2
              ${
                currentFile === file.slug
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            {file.title}
          </button>
        ))}
      </div>
    </nav>
  );
};
