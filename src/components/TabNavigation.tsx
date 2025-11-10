import type { MarkdownFile } from '../types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ScrollFade } from './ScrollFade';

interface TabNavigationProps {
  files: MarkdownFile[];
  currentFile: string | null;
}

const TabNavigationComponent = ({ files, currentFile }: TabNavigationProps) => {
  return (
    <nav className="sticky top-0 z-40 theme-bg border-b theme-border">
      <ScrollFade 
        direction="horizontal" 
        size={32}
        intensity={0.9}
        className="flex"
      >
        {files.map((file) => (
          <Link
            key={file.slug}
            to={`/${file.slug}`}
            className={`
              px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 border-transparent
              ${currentFile === file.slug
                ? 'tab-active'
                : 'theme-text-secondary hover:theme-text'
              }
            `}
          >
            {file.title}
          </Link>
        ))}
      </ScrollFade>
    </nav>
  );
};

// Memoize the TabNavigation component to prevent unnecessary re-renders
export const TabNavigation = memo(TabNavigationComponent);
