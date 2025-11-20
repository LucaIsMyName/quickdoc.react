import { memo, useState } from 'react';
import { Settings, X, Search, Sun, Moon } from 'lucide-react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { DarkModeToggle } from './DarkModeToggle';
import { SearchButton } from './SearchButton';
import { ExportButton } from './ExportButton';

interface FloatingToolbarProps {
  // Global actions
  isDark: boolean;
  onToggleDarkMode: () => void;
  onSearchOpen: () => void;
  
  // Local actions (current page)
  exportProps?: {
    content: string;
    title: string;
    filename?: string;
  };
}

const FloatingToolbarComponent = ({ 
  isDark, 
  onToggleDarkMode, 
  onSearchOpen, 
  exportProps 
}: FloatingToolbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuId = 'floating-toolbar-menu';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Toolbar - Always visible on desktop */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3 theme-bg theme-border-medium shadow-lg px-3 py-2">
          {/* Local Actions */}
          <div className="flex items-center gap-1">
            {exportProps && (
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <span className="inline-flex">
                    <ExportButton
                      content={exportProps.content}
                      title={exportProps.title}
                      filename={exportProps.filename}
                    />
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner side="top" align="end" sideOffset={8}>
                    <Tooltip.Popup className="px-2 py-1 text-xs theme-bg theme-border-medium shadow-md theme-text whitespace-nowrap">
                      Export options
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            )}
          </div>

          {/* Separator */}
          {exportProps && (
            <div className="w-px h-6 theme-border bg-current opacity-20 mx-1" />
          )}

          {/* Global Actions */}
          <div className="flex items-center gap-1">
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span className="inline-flex">
                  <SearchButton onClick={onSearchOpen} />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="top" align="end" sideOffset={8}>
                  <Tooltip.Popup className="px-2 py-1 text-xs theme-bg theme-border-medium shadow-md theme-text whitespace-nowrap">
                    Search documentation
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger>
                <span className="inline-flex">
                  <DarkModeToggle isDark={isDark} onToggle={onToggleDarkMode} />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="top" align="end" sideOffset={8}>
                  <Tooltip.Popup className="px-2 py-1 text-xs theme-bg theme-border-medium shadow-md theme-text whitespace-nowrap">
                    {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="w-12 h-12 theme-bg theme-border-base shadow-lg flex items-center justify-center theme-radius-medium"
          aria-label="Open toolbar menu"
          aria-haspopup="dialog"
          aria-expanded={isMobileMenuOpen}
          aria-controls={menuId}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 theme-text" />
          ) : (
            <Settings className="w-5 h-5 theme-text" />
          )}
        </button>

        {/* Mobile Popover Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div
              id={menuId}
              className="absolute bottom-16 right-0 w-64 theme-bg theme-border-large shadow-xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="floating-toolbar-title"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b theme-border">
                <h3 id="floating-toolbar-title" className="text-sm font-medium theme-text">Toolbar</h3>
              </div>

              {/* Local Actions Section */}
              {exportProps && (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-medium theme-text-secondary uppercase tracking-wide">
                    Current Page
                  </div>
                  <div className="mt-1">
                    <ExportButton
                      content={exportProps.content}
                      title={exportProps.title}
                      filename={exportProps.filename}
                    />
                  </div>
                </div>
              )}

              {/* Separator */}
              {exportProps && (
                <div className="border-t theme-border mx-2" />
              )}

              {/* Global Actions Section */}
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-medium theme-text-secondary uppercase tracking-wide">
                  Global
                </div>
                <div className="mt-1 space-y-1">
                  {/* Search */}
                  <button
                    onClick={() => {
                      onSearchOpen();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm theme-text-secondary hover:theme-text hover:theme-active-bg theme-radius-base transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Documentation</span>
                  </button>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => {
                      onToggleDarkMode();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm theme-text-secondary hover:theme-text hover:theme-active-bg theme-radius-base transition-colors"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const FloatingToolbar = memo(FloatingToolbarComponent);
