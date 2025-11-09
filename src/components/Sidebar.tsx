import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import type { NavigationItem } from "../types";
import type { AppConfig } from "../config/app.config";
import { useSidebarWidth } from "../hooks/useSidebarWidth";
import { SidebarWidthControl } from "./SidebarWidthControl";
import { ScrollFade } from "./ScrollFade";

interface SidebarProps {
  title: string;
  navigation: NavigationItem[];
  currentSection: string | null;
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  currentFile?: string | null; // Current file slug for building URLs
}

const SidebarComponent = ({ navigation, currentSection, isOpen, onClose, config, currentFile }: SidebarProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { width, setWidth, resetWidth, canResize } = useSidebarWidth(config);

  useEffect(() => {
    setActiveId(currentSection);
  }, [currentSection]);

  // Memoize the close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ width: `${width}px` }}
        className={`
          fixed md:sticky bottom-0 md:top-[40px] left-0 h-[calc(100vh-40px)]
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          overflow-y-auto overflow-x-hidden z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0 shadow-none"}
        `}>
        <div className="p-2 h-full flex flex-col">
          <ScrollFade 
            direction="vertical" 
            size={40}
            intensity={0.8}
            className="flex-1"
          >
            {/* Navigation */}
            <nav>
              {navigation.map((item, index) => (
                <div key={item.id} className={index < navigation.length - 1 ? "mb-1" : "mb-1"}>
                  <Link
                    to={currentFile ? `/${currentFile}/${item.slug}` : `/${item.slug}`}
                    onClick={handleClose}
                    aria-label={`Navigate to ${item.title} Chapter`}
                    className={`
                      block w-full text-left py-2 rounded-lg text-sm
                      transition-all duration-200 ease-in-out transform
                      truncate
                      ${item.level === 1 ? "text-base px-3 font-bold" : ""}
                      ${item.level === 2 ? "px-3" : ""}
                      ${item.level === 3 ? "text-sm ml-6  px-3" : ""}
                      ${item.level === 4 ? "text-xs ml-9 px-3" : ""}
                      ${item.level === 5 ? "text-xs ml-12 px-3" : ""}
                      ${item.level === 6 ? "text-xs ml-16 px-3" : ""}
                      ${activeId === item.slug 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }
                    `}>
                    <span className="block truncate">{item.title}</span>
                  </Link>

                  {/* Show subsections based on config or active state */}
                  {((config.navigation.expandAllSections) || (activeId === item.slug)) && item.subsections && item.subsections.length > 0 && (
                    <div className="space-y-1">
                      {item.subsections.map((sub) => (
                        <Link
                          key={sub.id}
                          to={currentFile ? `/${currentFile}/${item.slug}#${sub.slug}` : `/${item.slug}#${sub.slug}`}
                          onClick={handleClose}
                          aria-label={`Navigate to ${sub.title}`}
                          className={`
                            block text-left py-1.5 my-1 rounded text-xs
                            transition-all duration-200 ease-in-out transform
                            text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                            truncate min-w-0
                            ${sub.level === 3 ? "ml-6 mr-3 px-3" : ""}
                            ${sub.level === 4 ? "ml-9 mr-3 px-3" : ""}
                            ${sub.level === 5 ? "ml-12 mr-3 px-3" : ""}
                            ${sub.level === 6 ? "ml-16 mr-3 px-3" : ""}
                          `}>
                          <span className="block truncate">{sub.title}</span>
                        </Link>
                      ))}
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
};

// Memoize the Sidebar component to prevent unnecessary re-renders
export const Sidebar = memo(SidebarComponent);
