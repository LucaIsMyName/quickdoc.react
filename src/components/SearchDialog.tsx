import { useEffect, useRef, memo } from 'react';
import { Search, FileText, Hash, ArrowRight } from 'lucide-react';
import type { MarkdownFile } from '../types';
import { useAppState } from '../hooks/useAppState';
import { useDocumentSearch } from '../hooks/useDocumentSearch';
import { scrollToHeading } from '../utils/scrollHash';

interface SearchDialogProps {
  files: MarkdownFile[];
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialogComponent = ({ files, isOpen, onClose }: SearchDialogProps) => {
  const { searchQuery, setSearchQuery, searchResults } = useDocumentSearch(files);
  const { setCurrentFile, setCurrentSection } = useAppState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (result: any) => {
    setCurrentFile(result.file.slug);
    
    // Set the current section
    if (result.section.slug !== result.file.slug) {
      setCurrentSection(result.section.slug);
    }
    
    // Scroll to the specific anchor if it's a section
    if (result.section.slug && result.section.slug !== result.file.slug) {
      // Create anchor from section title
      const anchor = result.section.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Use scroll utility with a delay to ensure content is loaded
      setTimeout(() => {
        scrollToHeading(anchor);
      }, 100);
    }
    
    onClose();
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
            <div key={`${result.file.slug}-${result.section.slug}-${index}`}>
              {/* File/Section Header */}
              <div className="flex items-center px-2 py-1 text-xs font-medium theme-text-secondary">
                <FileText className="mr-2 h-3 w-3" />
                {result.file.title}
                {result.section.level > 1 && (
                  <>
                    <ArrowRight className="mx-1 h-3 w-3" />
                    <Hash className="mr-1 h-3 w-3" />
                    {result.section.title}
                  </>
                )}
              </div>
              
              {/* Search Results */}
              <div
                onClick={() => handleSelect(result)}
                className="flex flex-col px-2 py-2 text-sm rounded cursor-pointer hover:theme-active-bg"
              >
                {result.matches.map((match, matchIndex) => (
                  <div 
                    key={matchIndex}
                    className="theme-text-secondary"
                    dangerouslySetInnerHTML={{ __html: match.highlight }}
                  />
                ))}
              </div>
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
