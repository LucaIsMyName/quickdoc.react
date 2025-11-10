import type { MarkdownFile } from '../types';
import type { AppConfig } from '../config/app.config';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ScrollFade } from './ScrollFade';

interface TabNavigationProps {
  files: MarkdownFile[];
  currentFile: string | null;
  config: AppConfig;
}

const TabNavigationComponent = ({ files, currentFile, config }: TabNavigationProps) => {
  return (
    <nav className={`sticky top-0 z-40 ${config.theme.isSidebarTransparent ? 'bg-transparent' : 'theme-bg'} border-b theme-border tab-navigation overflow-hidden`}>
      <ScrollFade 
        direction="horizontal" 
        size={24}
        intensity={0.9}
        className="overflow-x-auto scrollbar-thin"
      >
        <div className="flex min-w-max">
          {files.map((file) => (
            <Link
              key={file.slug}
              to={`/${file.slug}`}
              className={`
                flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 border-transparent tab-item
                ${currentFile === file.slug
                  ? 'tab-active'
                  : 'theme-text-secondary hover:theme-text'
                }
              `}
            >
              {file.title}
            </Link>
          ))}
        </div>
      </ScrollFade>
    </nav>
  );
};

// Memoize the TabNavigation component to prevent unnecessary re-renders
export const TabNavigation = memo(TabNavigationComponent);
