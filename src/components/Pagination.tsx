import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentSection } from "../types";

interface PaginationProps {
  sections: ContentSection[];
  currentSection: string | null;
  onSectionChange: (slug: string) => void;
  showOnTop: boolean;
  showOnBottom: boolean;
}

export const Pagination = ({ sections, currentSection, onSectionChange, showOnTop, showOnBottom }: PaginationProps) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = sections.findIndex((section) => section.slug === currentSection);
    setCurrentIndex(index);
  }, [currentSection, sections]);

  if (sections.length <= 1) return null;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      if (prevSection) {
        onSectionChange(prevSection.slug);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      if (nextSection) {
        onSectionChange(nextSection.slug);
      }
    }
  };

  const goToSection = (index: number) => {
    if (sections[index]) {
      onSectionChange(sections[index].slug);
    }
  };

  return (
    <>
      {showOnTop && (
        <div
          ref={containerRef}
          className="sticky top-0 z-30  backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between px-0 mx-auto">
            <button
              onClick={goToPrevious}
              disabled={currentIndex <= 0}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${currentIndex <= 0 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
              `}
              aria-label="Previous section">
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </button>

            <div className="flex items-center gap-1">
               <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} of {sections.length}
              </span>
              {sections.map((section, index) => (
                <button
                  key={section.slug}
                  onClick={() => goToSection(index)}
                  className={`
                    w-2 h-2 transition-all duration-200 rounded-full
                    ${index === currentIndex ? "bg-gray-900 dark:bg-white w-6" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
                  `}
                  aria-label={`Go to ${section.title}`}
                  title={section.title}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex >= sections.length - 1}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${currentIndex >= sections.length - 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
              `}
              aria-label="Next section">
              <span className="sr-only">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showOnBottom && (
         <div
          ref={containerRef}
          className="sticky top-0 z-30  backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between px-0 mx-auto">
            <button
              onClick={goToPrevious}
              disabled={currentIndex <= 0}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${currentIndex <= 0 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
              `}
              aria-label="Previous section">
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </button>

            <div className="flex items-center gap-1">
               <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} of {sections.length}
              </span>
              {sections.map((section, index) => (
                <button
                  key={section.slug}
                  onClick={() => goToSection(index)}
                  className={`
                    w-2 h-2 transition-all duration-200 rounded-full
                    ${index === currentIndex ? "bg-gray-900 dark:bg-white w-6" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
                  `}
                  aria-label={`Go to ${section.title}`}
                  title={section.title}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex >= sections.length - 1}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${currentIndex >= sections.length - 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
              `}
              aria-label="Next section">
              <span className="sr-only">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
