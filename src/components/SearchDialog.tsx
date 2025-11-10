import { useEffect, useRef, memo } from 'react';
import { Search, FileText, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MarkdownFile } from '../types';
import type { AppConfig } from '../config/app.config';
import { useDocumentSearch } from '../hooks/useDocumentSearch';

interface SearchDialogProps {
  files: MarkdownFile[];
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

const SearchDialogComponent = ({ files, isOpen, onClose, config }: SearchDialogProps) => {
  const { searchQuery, setSearchQuery, searchResults } = useDocumentSearch(files, config);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Generate proper URL for navigation with breaking point support
  const getResultUrl = (result: any) => {
    const baseUrl = `/${result.file.slug}`;
    
    // If it's just the file (level 1), link to file only
    if (result.section.level === 1 || result.section.slug === result.file.slug) {
      return baseUrl;
    }
    
    // For sections, consider breaking points
    if (result.section.slug && result.section.slug !== result.file.slug) {
      if (config.navigation.breakingPoint === 'h2') {
        if (result.section.level === 2) {
          // H2 sections get their own route segment: /file/breakpoint
          return `${baseUrl}/${result.section.slug}`;
        } else if (result.section.level > 2) {
          // H3+ sections need parent H2 + anchor: /file/breakpoint#headline
          // For now, just use anchor until we can find parent H2
          return `${baseUrl}#${result.section.slug}`;
        }
      }
      return `${baseUrl}#${result.section.slug}`;
    }
    
    return baseUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative z-[10000] mx-4 max-w-2xl w-full mx-4 search-dialog theme-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center border-b theme-border px-4">
          <Search className="mr-3 h-4 w-4 theme-text-secondary" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none theme-text placeholder:theme-text-secondary disabled:cursor-not-allowed disabled:opacity-50 theme-input"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
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
                className="block px-3 py-2 cursor-pointer hover:theme-active-bg transition-colors rounded-md mx-2"
              >
                {/* Main title/heading - Make this bigger */}
                <div className="text-base font-medium theme-text mb-1">
                  {result.section.level > 1 ? result.section.title : result.file.title}
                </div>
                
                {/* Search content - Make this smaller and less prominent */}
                <div className="space-y-1">
                  {result.matches.map((match, matchIndex) => (
                    <div 
                      key={matchIndex}
                      className="text-xs theme-text-secondary opacity-75 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: match.highlight }}
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
            <kbd className="px-1.5 py-0.5 rounded border theme-border">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-1.5 py-0.5 rounded border theme-border">↵</kbd>
            <span>select</span>
            <kbd className="px-1.5 py-0.5 rounded border theme-border">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize SearchDialog to prevent unnecessary re-renders
export const SearchDialog = memo(SearchDialogComponent);
