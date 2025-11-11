import { memo, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { AppConfig } from '../config/app.config';
import { ScrollFade } from './ScrollFade';
import { SidebarWidthControl } from "./SidebarWidthControl";
import { useSidebarWidth } from '../hooks/useSidebarWidth';

// Define NavigationItem interface
interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  level: number;
  subsections?: NavigationItem[];
}

// Generate hierarchical numbering for sidebar items (scientific numbering system)
const generateSidebarNumbers = (navigation: NavigationItem[], config: AppConfig) => {
  if (!config.navigation.enableNumberedSidebar) return {};
  
  const numbers: Record<string, string> = {};
  const breakingPointLevel = getBreakingPointLevel(config.navigation.breakingPoint);
  
  // Filter navigation to only include items that will actually be shown in sidebar
  const visibleNavigation = navigation.filter(item => {
    // Hide H1 items if showH1InSidebar is false
    if (item.level === 1 && !config.navigation.showH1InSidebar) {
      return false;
    }
    return true;
  });
  
  // Counters for each level
  let h1Counter = 0;
  let h2Counter = 0;
  let h3Counter = 0;
  let h4Counter = 0;
  
  // Process each VISIBLE navigation item
  visibleNavigation.forEach((item) => {
    // Only number items at the breaking point level and below
    if (item.level >= breakingPointLevel) {
      
      // Reset subsection counters when we encounter a new main section
      if (item.level === breakingPointLevel) {
        h3Counter = 0;
        h4Counter = 0;
      }
      
      // Build the number based on level
      let number = '';
      
      if (breakingPointLevel === 1) {
        // h1 breaking point
        if (item.level === 1) {
          h1Counter++;
          number = `${h1Counter}.`;
        } else if (item.level === 2) {
          h2Counter++;
          number = `${h2Counter + 1}.`;
        } else if (item.level === 3) {
          h3Counter++;
          number = `${h2Counter + 1}.${h3Counter}.`;
        } else if (item.level === 4) {
          h4Counter++;
          number = `${h2Counter + 1}.${h3Counter}.${h4Counter}.`;
        }
      } else if (breakingPointLevel === 2) {
        // h2 breaking point
        if (item.level === 2) {
          h2Counter++;
          h3Counter = 0; // Reset H3 counter for new H2 section
          number = `${h2Counter}.`;
        } else if (item.level === 3) {
          h3Counter++;
          number = `${h2Counter}.${h3Counter}.`;
        } else if (item.level === 4) {
          h4Counter++;
          number = `${h2Counter}.${h3Counter}.${h4Counter}.`;
        }
      } else if (breakingPointLevel === 3) {
        // h3 breaking point
        if (item.level === 3) {
          h3Counter++;
          h4Counter = 0;
          number = `${h3Counter}.`;
        } else if (item.level === 4) {
          h4Counter++;
          number = `${h3Counter}.${h4Counter}.`;
        }
      } else if (breakingPointLevel === 4) {
        // h4 breaking point
        if (item.level === 4) {
          h4Counter++;
          number = `${h4Counter}.`;
        }
      }
      
      numbers[item.id] = number;
      
      // Recursively number all subsections
      if (item.subsections && item.subsections.length > 0) {
        // CRITICAL FIX: Pass a snapshot of counters at this point, not the final values!
        const counterSnapshot = { 
          h1Counter, 
          h2Counter, // Use current h2Counter value for this section
          h3Counter: 0, // Reset for this section's subsections
          h4Counter: 0 
        };
        numberSubsections(item.subsections, counterSnapshot, breakingPointLevel, numbers);
      }
    }
  });
  
  return numbers;
};

// Recursively number subsections maintaining the counter state
const numberSubsections = (
  subsections: NavigationItem[], 
  counters: { h1Counter: number; h2Counter: number; h3Counter: number; h4Counter: number },
  breakingPointLevel: number, 
  numbers: Record<string, string>
) => {
  subsections.forEach((sub) => {
    // Build the number based on level
    let number = '';
    
    if (breakingPointLevel === 1) {
      // h1 breaking point
      if (sub.level === 2) {
        counters.h2Counter++;
        number = `${counters.h2Counter + 1}.`;
      } else if (sub.level === 3) {
        counters.h3Counter++;
        number = `${counters.h2Counter + 1}.${counters.h3Counter}.`;
      } else if (sub.level === 4) {
        counters.h4Counter++;
        number = `${counters.h2Counter + 1}.${counters.h3Counter}.${counters.h4Counter}.`;
      }
    } else if (breakingPointLevel === 2) {
      // h2 breaking point
      if (sub.level === 3) {
        counters.h3Counter++;
        number = `${counters.h2Counter}.${counters.h3Counter}.`;
      } else if (sub.level === 4) {
        counters.h4Counter++;
        number = `${counters.h2Counter}.${counters.h3Counter}.${counters.h4Counter}.`;
      }
    } else if (breakingPointLevel === 3) {
      // h3 breaking point
      if (sub.level === 4) {
        counters.h4Counter++;
        number = `${counters.h3Counter}.${counters.h4Counter}.`;
      }
    }
    
    numbers[sub.id] = number;
    
    // Recursively number deeper subsections if they exist
    if (sub.subsections && sub.subsections.length > 0) {
      numberSubsections(sub.subsections, counters, breakingPointLevel, numbers);
    }
  });
};

// Helper function to get numeric level from breaking point
const getBreakingPointLevel = (breakingPoint: string): number => {
  switch (breakingPoint) {
    case 'h1': return 1;
    case 'h2': return 2;
    case 'h3': return 3;
    case 'h4': return 4;
    default: return 2;
  }
};

interface SidebarProps {
  title: string;
  navigation: NavigationItem[];
  currentSection: string | null;
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  currentFile?: string | null; // Current file slug for building URLs
}

const SidebarComponent = memo(({ navigation, currentSection, isOpen, onClose, config, currentFile }: SidebarProps) => {
  console.log(`[DEBUG] Sidebar received navigation for ${currentFile}:`, navigation.length, 'items');
  navigation.forEach((item, idx) => {
    console.log(`  Sidebar ${idx + 1}: "${item.title}" (Level ${item.level}, Slug: ${item.slug})`);
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { width, setWidth, resetWidth, canResize } = useSidebarWidth(config);
  
  // Generate sidebar numbers with proper dependencies
  const sidebarNumbers = useMemo(() => {
    return generateSidebarNumbers(navigation, config);
  }, [navigation, config.navigation.enableNumberedSidebar, config.navigation.breakingPoint, config.navigation.showH1InSidebar]);

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
        style={{ 
          width: `${width}px`,
        }}
        className={`
          fixed md:sticky top-[40px] left-0 h-[calc(100vh-40px)]
          w-0 md:w-auto
          ${config.theme.isSidebarTransparent ? 'bg-transparent' : 'theme-bg'}
          ${config.theme.isSidebarTransparent ? '' : 'sidebar-container'}
          overflow-y-auto overflow-x-hidden z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0 shadow-none"}
          ${config.theme.isSidebarTransparent ? 'hover:sidebar-container' : ''}
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
                        ? "sidebar-item-active" 
                        : "theme-text-secondary hover:theme-text"
                      }
                    `}>
                    <span className="block truncate">
                      {sidebarNumbers[item.id] && (
                        <span className="inline-block mr-2 font-mono text-xs opacity-75">
                          {sidebarNumbers[item.id]}
                        </span>
                      )}
                      {item.title}
                    </span>
                  </Link>

                  {/* Show subsections based on config or active state */}
                  {((config.navigation.expandAllSections) || (activeId === item.slug)) && item.subsections && item.subsections.length > 0 && (
                    <div className="space-y-1">
                      {item.subsections.map((sub: NavigationItem) => (
                        <div key={sub.id}>
                          <Link
                            to={currentFile ? `/${currentFile}/${item.slug}#${sub.slug}` : `/${item.slug}#${sub.slug}`}
                            onClick={handleClose}
                            aria-label={`Navigate to ${sub.title}`}
                            className={`
                              block text-left py-1.5 my-1 rounded text-xs
                              transition-all duration-200 ease-in-out transform
                              theme-text-secondary hover:theme-text
                              truncate min-w-0
                              ${sub.level === 3 ? "ml-6 mr-3 px-3" : ""}
                              ${sub.level === 4 ? "ml-9 mr-3 px-3" : ""}
                              ${sub.level === 5 ? "ml-12 mr-3 px-3" : ""}
                              ${sub.level === 6 ? "ml-16 mr-3 px-3" : ""}
                            `}>
                            <span className="block truncate">
                              {sidebarNumbers[sub.id] && (
                                <span className="inline-block mr-2 font-mono text-xs opacity-75">
                                  {sidebarNumbers[sub.id]}
                                </span>
                              )}
                              {sub.title}
                            </span>
                          </Link>
                          
                          {/* Recursively render nested subsections */}
                          {sub.subsections && sub.subsections.length > 0 && (
                            <div className="space-y-1">
                              {sub.subsections.map((nestedSub: NavigationItem) => (
                                <Link
                                  key={nestedSub.id}
                                  to={currentFile ? `/${currentFile}/${item.slug}#${nestedSub.slug}` : `/${item.slug}#${nestedSub.slug}`}
                                  onClick={handleClose}
                                  aria-label={`Navigate to ${nestedSub.title}`}
                                  className={`
                                    block text-left py-1.5 my-1 rounded text-xs
                                    transition-all duration-200 ease-in-out transform
                                    theme-text-secondary hover:theme-text
                                    truncate min-w-0
                                    ${nestedSub.level === 4 ? "ml-9 mr-3 px-3" : ""}
                                    ${nestedSub.level === 5 ? "ml-12 mr-3 px-3" : ""}
                                    ${nestedSub.level === 6 ? "ml-16 mr-3 px-3" : ""}
                                  `}>
                                  <span className="block truncate">
                                    {sidebarNumbers[nestedSub.id] && (
                                      <span className="inline-block mr-2 font-mono text-xs opacity-75">
                                        {sidebarNumbers[nestedSub.id]}
                                      </span>
                                    )}
                                    {nestedSub.title}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
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
});

// Export the memoized Sidebar component
export const Sidebar = SidebarComponent;
