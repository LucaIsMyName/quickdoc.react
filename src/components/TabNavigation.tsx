import type { AppConfig } from '../config/app.config';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ScrollFade } from './ScrollFade';

interface FolderNavItem {
  slug: string;
  title: string;
  isFolder: boolean;
  folderName?: string;
}

interface TabNavigationProps {
  folderNavigation: FolderNavItem[];
  currentFile: string | null;
  config: AppConfig;
}

const TabNavigationComponent = ({ folderNavigation, currentFile, config }: TabNavigationProps) => {
  return (
    <nav className={`sticky top-0 z-40 ${config.theme.isSidebarTransparent ? 'bg-transparent' : 'theme-bg'} border-b theme-border tab-navigation overflow-hidden`}>
      <ScrollFade 
        direction="horizontal" 
        size={24}
        intensity={0.9}
        className="overflow-x-auto scrollbar-thin"
      >
        <div className="flex min-w-max">
          {folderNavigation.map((item) => (
            <Link
              key={item.slug}
              to={`/${item.slug}`}
              className={`
                flex-shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 border-transparent tab-item
                ${currentFile === item.slug || (item.isFolder && currentFile?.startsWith(item.folderName || ''))
                  ? 'tab-active'
                  : 'neutral-text-secondary hover:neutral-text'
                }
              `}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollFade>
    </nav>
  );
};

// Memoize the TabNavigation component to prevent unnecessary re-renders
export const TabNavigation = memo(TabNavigationComponent);
