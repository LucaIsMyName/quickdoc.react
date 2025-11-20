import { memo, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import type { AppConfig } from "../config/app.config";
import { ScrollFade } from "./ScrollFade";
import { SidebarWidthControl } from "./SidebarWidthControl";
import { useSidebarWidth } from "../hooks/useSidebarWidth";

// Define NavigationItem interface
interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  level: number;
  subsections?: NavigationItem[];
  isIndex?: boolean; // Mark index files for special styling
}

// Generate hierarchical numbering for folder-based sidebar items
const generateSidebarNumbers = (navigation: NavigationItem[], config: AppConfig) => {
  if (!config.navigation.enableNumberedSidebar) return {};

  const numbers: Record<string, string> = {};

  // SIMPLE: Just number files 1, 2, 3... and their subsections 1.1, 1.2, 2.1, 2.2...
  navigation.forEach((item, fileIndex) => {
    const fileNumber = fileIndex + 1;

    // File gets number like "1.", "2.", "3."
    numbers[item.id] = `${fileNumber}.`;

    // Subsections get numbers like "1.1.", "1.2.", "1.1.1."
    if (item.subsections) {
      let h2Counter = 0;
      let h3Counter = 0;

      item.subsections.forEach((sub) => {
        if (sub.level === 2) {
          h2Counter++;
          h3Counter = 0; // Reset H3 when new H2
          numbers[sub.id] = `${fileNumber}.${h2Counter}.`;
        } else if (sub.level === 3) {
          h3Counter++;
          numbers[sub.id] = `${fileNumber}.${h2Counter}.${h3Counter}.`;
        }
      });
    }
  });

  return numbers;
};

interface SidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  currentFile?: string | null; // Current file slug for building URLs
}

const SidebarComponent = memo(({ navigation, isOpen, onClose, config, currentFile }: SidebarProps) => {
  // console.log(`[DEBUG] Sidebar received navigation for ${currentFile}:`, navigation.length, "items");
 
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { width, setWidth, resetWidth, canResize } = useSidebarWidth(config);

  // Generate sidebar numbers with proper dependencies
  const sidebarNumbers = useMemo(() => {
    return generateSidebarNumbers(navigation, config);
  }, [navigation, config.navigation.enableNumberedSidebar, config.navigation.showH1InSidebar]);

  // Memoize the close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{
          width: `${width}px`,
          fontFamily: 'var(--sidebar-font-family)',
        }}
        className={`
          fixed md:sticky top-[40px] left-0 md:left-auto h-[calc(100vh-40px)] md:h-[calc(100vh-40px)]
          theme-bg-secondary
          ${config.theme.isSidebarTransparent ? "md:!bg-transparent " : ""}
          ${config.theme.isSidebarTransparent ? "" : "sidebar-container"}
          overflow-y-auto overflow-x-hidden z-40 md:z-auto transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${config.theme.isSidebarTransparent ? "md:hover:sidebar-container" : ""}
        `}>
        <div className="p-2 h-full flex flex-col">
          <ScrollFade
            direction="vertical"
            size={40}
            intensity={0.8}
            className="flex-1">
            {/* Navigation */}
            <nav className="mb-24 md:mb-6" role="navigation" aria-label="Documentation sidebar">
              {navigation.map((item, index) => (
                <div
                  key={item.id}
                  className={index < navigation.length - 1 ? "mb-1" : "mb-1"}>
                  <Link
                    to={`/${item.slug}`}
                    onClick={handleClose}
                    aria-label={`Navigate to ${item.title} Chapter`}
                    className={`
                      block w-full text-left py-2 rounded-lg text-sm
                      transition-all duration-200 ease-in-out transform
                      truncate
                      ${item.level === 1 ? "text-base px-3" : ""}
                      ${item.level === 2 ? "px-3" : ""}
                      ${item.level === 3 ? "text-sm ml-6  px-3" : ""}
                      ${item.level === 4 ? "text-xs ml-9 px-3" : ""}
                      ${item.level === 5 ? "text-xs ml-12 px-3" : ""}
                      ${item.level === 6 ? "text-xs ml-16 px-3" : ""}
                      ${item.isIndex ? "font-bold  mb-0" : ""}
                      ${currentFile === item.slug ? "sidebar-item-active" : `neutral-text-secondary hover:neutral-text ${item.level === 1 ? "hover:theme-bg-secondary" : ""}`}
                    `}>
                    <span className="block truncate">
                      {sidebarNumbers[item.id] && <span className="inline-block mr-2 font-mono text-xs opacity-75">{sidebarNumbers[item.id]}</span>}
                      {item.title}
                    </span>
                  </Link>

                  {/* Show subsections based on config or current file */}
                  {(config.navigation.expandAllSections || currentFile === item.slug) && item.subsections && item.subsections.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {item.subsections.map((sub: NavigationItem) => {
                        // Calculate indentation based on heading level (H2=level 2, H3=level 3, etc.)
                        const baseIndent = 16; // Base indentation in pixels
                        const levelIndent = (sub.level - 2) * 12; // Additional indent per level (H2=0, H3=12, H4=24, etc.)
                        const totalIndent = baseIndent + levelIndent;

                        return (
                          <div key={sub.id}>
                            <Link
                              to={`/${item.slug}#${sub.slug}`}
                              onClick={handleClose}
                              aria-label={`Navigate to ${sub.title}`}
                              className={`
                                block text-left py-1 px-2 rounded text-xs
                                transition-all duration-200 ease-in-out transform
                                neutral-text-secondary hover:neutral-text
                                truncate min-w-0
                              `}
                              style={{ marginLeft: `${totalIndent}px` }}>
                              <span className="block truncate">
                                {sidebarNumbers[sub.id] && <span className="inline-block mr-2 font-mono text-xs opacity-75">{sidebarNumbers[sub.id]}</span>}
                                {sub.title}
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollFade>

          {/* Mobile spacer to prevent content from being hidden behind mobile menu button */}
          <div className="md:hidden h-20"></div>
        </div>

        {/* Resize handle - only show if user resizing is enabled */}
        {canResize && (
          <SidebarWidthControl
            width={width}
            onWidthChange={setWidth}
            onReset={resetWidth}
          />
        )}
      </aside>
    </>
  );
});

// Export the memoized Sidebar component
export const Sidebar = SidebarComponent;
