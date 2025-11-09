import { useEffect, useState } from 'react';
import type { NavigationItem } from '../types';

interface SidebarProps {
  title: string;
  navigation: NavigationItem[];
  currentSection: string | null;
  onSectionChange: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  title,
  navigation,
  currentSection,
  onSectionChange,
  isOpen,
  onClose,
}: SidebarProps) => {
  const [activeId, setActiveId] = useState<string | null>(currentSection);

  useEffect(() => {
    setActiveId(currentSection);
  }, [currentSection]);

  const handleClick = (item: NavigationItem) => {
    onSectionChange(item.slug);
    onClose(); // Close mobile menu
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-[57px] md:top-[57px] left-0 h-[calc(100vh-57px)]
          w-64 md:w-72 lg:w-80 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          overflow-y-auto z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 md:p-6">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm
                  transition-colors duration-200
                  ${item.level === 1 ? 'font-semibold' : ''}
                  ${item.level === 2 ? 'pl-3' : ''}
                  ${item.level === 3 ? 'pl-6' : ''}
                  ${item.level === 4 ? 'pl-9' : ''}
                  ${
                    activeId === item.slug
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
