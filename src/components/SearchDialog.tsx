import { useEffect, useRef, useState, memo } from 'react';
import { Search, FileText, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MarkdownFile } from '../types';
import type { AppConfig } from '../config/app.config';
import { useDocumentSearch } from '../hooks/useDocumentSearch';
import { sanitizeSearchHighlight } from '../utils/security';

interface SearchDialogProps {
  files: MarkdownFile[];
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

const SearchDialogComponent = ({ files, isOpen, onClose, config }: SearchDialogProps) => {
  const { searchQuery, setSearchQuery, searchResults } = useDocumentSearch(files, config);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();

      // Initialize active index when dialog opens and results are available
      if (searchResults.length > 0) {
        setActiveIndex(0);
      } else {
        setActiveIndex(null);
      }
    } else {
      // Reset active index when dialog closes
      setActiveIndex(null);
    }
  }, [isOpen, searchResults.length]);

  // When search results change (e.g., new query), reset active index
  useEffect(() => {
    if (searchResults.length > 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [searchResults]);

  // Generate proper URL for navigation - all sections use anchor links
  const getResultUrl = (result: any) => {
    const baseUrl = `/${result.file.slug}`;
    
    // Debug logging
    // // console.log('URL Generation Debug:', {
    //   fileSlug: result.file.slug,
    //   sectionSlug: result.section.slug,
    //   sectionLevel: result.section.level,
    //   sectionTitle: result.section.title
    // });
    
    // If it's just the file (level 1), link to file only
    if (result.section.level === 1 || result.section.slug === result.file.slug) {
      // console.log('-> File level, returning:', baseUrl);
      return baseUrl;
    }
    
    // For all sections (H2-H6), use anchor links: /file#section
    if (result.section.slug && result.section.slug !== result.file.slug) {
      const url = `${baseUrl}#${result.section.slug}`;
      // console.log('-> Section anchor, returning:', url);
      return url;
    }
    
    // console.log('-> Final fallback, returning:', baseUrl);
    return baseUrl;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }

    if (!searchResults.length) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      setActiveIndex((prev) => {
        if (prev === null) {
          return 0;
        }

        const maxIndex = searchResults.length - 1;

        if (e.key === 'ArrowDown') {
          return prev === maxIndex ? 0 : prev + 1; // wrap
        }

        // ArrowUp
        return prev === 0 ? maxIndex : prev - 1; // wrap
      });

      return;
    }

    if (e.key === 'Enter' && activeIndex !== null) {
      const target = itemRefs.current[activeIndex];
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-20"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative z-[10000] mx-4 max-w-2xl w-full mx-4 search-dialog theme-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center border-b theme-border px-4">
          <h2 id="search-dialog-title" className="sr-only">Search documentation</h2>
          <Search className="mr-3 h-4 w-4 theme-text-secondary" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex h-12 w-full bg-transparent py-2 text-sm !outline-none !border-none !focus:outline-none !focus:border-none theme-text placeholder:theme-text-secondary disabled:cursor-not-allowed disabled:opacity-50 theme-input"
            onKeyDown={handleInputKeyDown}
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2" aria-label="Search results">
          {searchQuery.length === 0 && (
            <div className="py-6 text-center text-sm theme-text-secondary">
              Start typing to search documentation...
            </div>
          )}

          {searchQuery.length > 0 && searchResults.length === 0 && (
            <div className="py-6 text-center text-sm theme-text-secondary">
              No results found for "{searchQuery}"
            </div>
          )}

          {searchResults.map((result, index) => (
            <div key={`${result.file.slug}-${result.section.slug}-${index}`} className="border-b theme-border last:border-b-0 pb-3 mb-3 last:pb-2 last:mb-0">
              {/* File/Section Header - Original Layout */}
              <div className="flex items-center px-3 py-1 text-xs font-medium theme-text-secondary">
                <FileText className="mr-2 h-3 w-3" />
                {result.file.title}
                {result.section.level > 1 && (
                  <>
                    <span className="mx-1">→</span>
                    <Hash className="mr-1 h-3 w-3" />
                    {result.section.title}
                  </>
                )}
              </div>
              
              {/* Main Link - Bigger and more prominent */}
              <Link
                to={getResultUrl(result)}
                onClick={onClose}
                ref={(el) => {
                  if (el) {
                    itemRefs.current[index] = el;
                  }
                }}
                className="block px-3 py-2 cursor-pointer hover:theme-active-bg transition-colors theme-radius-base mx-2 text-left"
              >
                {/* Main title/heading with highlighted matches */}
                <div 
                  className="text-base font-medium theme-text mb-1 text-left search-result-title"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeSearchHighlight(
                      result.matches.find(m => m.type === 'title')?.highlight || 
                      (result.section.level > 1 ? result.section.title : result.file.title)
                    )
                  }}
                />
                
                {/* Search content - Only show content matches, not title matches */}
                <div className="space-y-1 text-left">
                  {result.matches
                    .filter(match => match.type === 'content')
                    .map((match, matchIndex) => (
                      <div 
                        key={matchIndex}
                        className="text-xs theme-text-secondary opacity-75 leading-relaxed text-left search-result-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeSearchHighlight(match.highlight) }}
                      />
                    ))}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t theme-border px-4 py-2">
          <div className="text-xs theme-text-secondary">
            {searchResults.length} results
          </div>
          <div className="flex items-center gap-2 text-xs theme-text-secondary">
            <kbd className="px-1.5 py-0.5 theme-radius-small theme-border-small">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-1.5 py-0.5 theme-radius-small theme-border-small">↵</kbd>
            <span>select</span>
            <kbd className="px-1.5 py-0.5 theme-radius-small theme-border-small">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize SearchDialog to prevent unnecessary re-renders
export const SearchDialog = memo(SearchDialogComponent);
