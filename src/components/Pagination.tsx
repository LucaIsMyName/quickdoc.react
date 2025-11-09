import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentSection } from "../types";
import type { AppConfig } from "../config/app.config";

interface PaginationProps {
  sections: ContentSection[];
  currentSection: string | null;
  currentFile: string | null;
  showOnTop: boolean;
  showOnBottom: boolean;
  config: AppConfig;
}

export const Pagination = ({ sections, currentSection, currentFile, showOnTop, showOnBottom, config }: PaginationProps) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = sections.findIndex((section) => section.slug === currentSection);
    setCurrentIndex(index);
  }, [currentSection, sections]);

  if (sections.length <= 1) return null;

  // Helper functions to build URLs
  const buildSectionUrl = (sectionSlug: string) => {
    return currentFile ? `/${currentFile}/${sectionSlug}` : `/${sectionSlug}`;
  };

  const getPreviousSection = () => {
    return currentIndex > 0 ? sections[currentIndex - 1] : null;
  };

  const getNextSection = () => {
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  };

  return (
    <>
      {showOnTop && (
        <div
          ref={containerRef}
          className="sticky top-0 z-30  backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div 
            className="flex items-center justify-between px-0 mx-auto"
            style={{ maxWidth: config.content.maxWidth }}
          >
            {getPreviousSection() ? (
              <Link
                to={buildSectionUrl(getPreviousSection()!.slug)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                aria-label="Previous section">
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Previous</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Previous</span>
              </div>
            )}

            <div className="flex items-center gap-1">
               <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} of {sections.length}
              </span>
              {sections.map((section, index) => (
                <Link
                  key={section.slug}
                  to={buildSectionUrl(section.slug)}
                  className={`
                    w-2 h-2 transition-all duration-200 rounded-full
                    ${index === currentIndex ? "bg-gray-900 dark:bg-white w-6" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
                  `}
                  aria-label={`Go to ${section.title}`}
                  title={section.title}
                />
              ))}
            </div>

            {getNextSection() ? (
              <Link
                to={buildSectionUrl(getNextSection()!.slug)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                aria-label="Next section">
                <span className="sr-only">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}

      {showOnBottom && (
         <div
          ref={containerRef}
          style={{ maxWidth: config.content.maxWidth }}
          className="sticky top-0 z-30  backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div 
            className="flex items-center justify-between px-0 mx-0 w-full flex-1"
            
          >
            {getPreviousSection() ? (
              <Link
                to={buildSectionUrl(getPreviousSection()!.slug)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                aria-label="Previous section">
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Previous</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Previous</span>
              </div>
            )}

            <div className="flex items-center gap-1">
               <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} of {sections.length}
              </span>
              {sections.map((section, index) => (
                <Link
                  key={section.slug}
                  to={buildSectionUrl(section.slug)}
                  className={`
                    w-2 h-2 transition-all duration-200 rounded-full
                    ${index === currentIndex ? "bg-gray-900 dark:bg-white w-6" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
                  `}
                  aria-label={`Go to ${section.title}`}
                  title={section.title}
                />
              ))}
            </div>

            {getNextSection() ? (
              <Link
                to={buildSectionUrl(getNextSection()!.slug)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                aria-label="Next section">
                <span className="sr-only">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
