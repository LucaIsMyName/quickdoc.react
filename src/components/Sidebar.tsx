import { useEffect, useState, useRef } from "react";
import type { NavigationItem } from "../types";
import type { AppConfig } from "../config/app.config";
import { ScrollFade } from "./ScrollFade";
import { useSidebarWidth } from "../hooks/useSidebarWidth";
import { SidebarWidthControl } from "./SidebarWidthControl";

interface SidebarProps {
  title: string;
  navigation: NavigationItem[];
  currentSection: string | null;
  onSectionChange: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const Sidebar = ({ navigation, currentSection, onSectionChange, isOpen, onClose, config }: SidebarProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { width, setWidth, resetWidth, canResize } = useSidebarWidth(config);

  useEffect(() => {
    setActiveId(currentSection);
  }, [currentSection]);

  const handleClick = (item: NavigationItem) => {
    onSectionChange(item.slug);
    onClose(); // Close mobile menu
  };

  const handleSubsectionClick = (slug: string) => {
    // Scroll to subsection within current page and update URL hash
    const element = document.getElementById(slug);
    if (element) {
      // Account for sticky header height using CSS variable
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Update URL hash without triggering navigation
      window.history.replaceState(null, '', `#${slug}`);
    }
    onClose(); // Close mobile menu
  };

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
          overflow-y-auto z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0 shadow-none"}
        `}>
        <div className="p-2 h-full">
          <ScrollFade 
            direction="vertical" 
            size={40}
            intensity={0.8}
            className="h-full"
          >
            {/* Navigation */}
            <nav>
              {navigation.map((item, index) => (
                <div key={item.id} className={index < navigation.length - 1 ? "mb-1" : "mb-20 md:mb-1"}>
                  <button
                    aria-label={`Navigate to ${item.title} Chapter`}
                    onClick={() => handleClick(item)}
                    className={`
                      w-full text-left py-2 rounded-lg text-sm
                      transition-all duration-200 ease-in-out transform
                      ${item.level === 1 ? "text-base px-3 font-bold" : ""}
                      ${item.level === 2 ? "px-3" : ""}
                      ${item.level === 3 ? "text-sm ml-6  px-3" : ""}
                      ${item.level === 4 ? "text-xs ml-9 px-3" : ""}
                      ${item.level === 5 ? "text-xs ml-12 px-3" : ""}
                      ${item.level === 6 ? "text-xs ml-16 px-3" : ""}
                      ${activeId === item.slug 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-700 dark:text-gray-300"
                      }
                    `}>
                    {item.title}
                  </button>

                  {/* Show subsections when this item is active */}
                  {activeId === item.slug && item.subsections && item.subsections.length > 0 && (
                    <div className="space-y-1">
                      {item.subsections.map((sub) => (
                        <button
                          aria-label={`Navigate to ${sub.title}`}
                          key={sub.id}
                          onClick={() => handleSubsectionClick(sub.slug)}
                          className={`
                            w-full text-left py-1.5 my-1 rounded text-xs
                            transition-all duration-200 ease-in-out transform
                            ${sub.level === 3 ? "ml-6 mr-3 px-3" : ""}
                            ${sub.level === 4 ? "ml-9 mr-3 px-3" : ""}
                            ${sub.level === 5 ? "ml-12 mr-3 px-3" : ""}
                            ${sub.level === 6 ? "ml-16 mr-3 px-3" : ""}
                            text-gray-600 dark:text-gray-400
                          `}>
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollFade>
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
