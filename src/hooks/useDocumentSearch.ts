import { useMemo, useState } from 'react';
import { createFuzzySearch } from 'fuzzyfindjs';
import type { MarkdownFile } from '../types';

interface SearchResult {
  file: MarkdownFile;
  section: {
    title: string;
    level: number;
    slug: string;
    content: string;
  };
  matches: {
    text: string;
    highlight: string;
  }[];
  score?: number;
}

interface SearchableItem {
  id: string;
  file: MarkdownFile;
  section: {
    title: string;
    level: number;
    slug: string;
    content: string;
  };
  searchableText: string;
}

export const useDocumentSearch = (files: MarkdownFile[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Create searchable items and fuzzy search instance
  const { searchableItems, fuzzySearch } = useMemo(() => {
    const items: SearchableItem[] = [];

    files.forEach(file => {
      // Split content into sections
      const lines = file.content.split('\n');
      let currentSection = {
        title: file.title,
        level: 1,
        slug: file.slug,
        content: ''
      };
      let sectionContent: string[] = [];

      lines.forEach(line => {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        
        if (headingMatch && headingMatch[1] && headingMatch[2]) {
          // Save previous section
          if (sectionContent.length > 0) {
            currentSection.content = sectionContent.join('\n').trim();
            const searchableText = `${currentSection.title} ${currentSection.content}`;
            items.push({
              id: `${file.slug}-${currentSection.slug}`,
              file,
              section: { ...currentSection },
              searchableText
            });
          }

          // Start new section
          const level = headingMatch[1].length;
          const title = headingMatch[2].trim();
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          currentSection = { title, level, slug, content: '' };
          sectionContent = [];
        } else {
          sectionContent.push(line);
        }
      });

      // Save last section
      if (sectionContent.length > 0) {
        currentSection.content = sectionContent.join('\n').trim();
        const searchableText = `${currentSection.title} ${currentSection.content}`;
        items.push({
          id: `${file.slug}-${currentSection.slug}`,
          file,
          section: { ...currentSection },
          searchableText
        });
      }
    });

    // Create fuzzy search instance with searchable text array
    const searchTexts = items.map(item => item.searchableText);
    const fuzzySearchInstance = createFuzzySearch(searchTexts, {
      languages: ['english'], // Auto-detect or specify languages
      performance: 'comprehensive', // Good balance of speed and accuracy
      maxResults: 20
    });

    return { searchableItems: items, fuzzySearch: fuzzySearchInstance };
  }, [files]);

  // Fuzzy search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !fuzzySearch) return [];

    try {
      // Use fuzzyfindjs for fuzzy search with typo tolerance
      const fuzzyResults = fuzzySearch.search(searchQuery, 20);

      // Convert fuzzy results to our SearchResult format
      const results: SearchResult[] = fuzzyResults.map((result: any) => {
        // Find the corresponding searchable item by matching the display text
        const item = searchableItems.find(item => item.searchableText === result.display);
        
        if (!item) {
          return null;
        }

        const matches: { text: string; highlight: string }[] = [];

        // Create matches from the search result
        // Check if title contains the query
        if (item.section.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches.push({
            text: item.section.title,
            highlight: highlightText(item.section.title, searchQuery)
          });
        }

        // Extract context from content that matches the query
        const contentLines = item.section.content.split('\n');
        contentLines.forEach((line, index) => {
          if (line.toLowerCase().includes(searchQuery.toLowerCase()) && line.trim()) {
            // Get context (previous and next lines)
            const contextStart = Math.max(0, index - 1);
            const contextEnd = Math.min(contentLines.length - 1, index + 1);
            const context = contentLines.slice(contextStart, contextEnd + 1).join(' ').trim();
            
            if (context && matches.length < 3) { // Limit to 3 matches per section
              matches.push({
                text: context,
                highlight: highlightText(context, searchQuery)
              });
            }
          }
        });

        // If no specific matches found, create a basic match from title
        if (matches.length === 0) {
          matches.push({
            text: item.section.title,
            highlight: highlightText(item.section.title, searchQuery)
          });
        }

        return {
          file: item.file,
          section: item.section,
          matches: matches.slice(0, 3), // Limit to 3 matches per section
          score: result.score
        };
      }).filter(Boolean) as SearchResult[];

      // Sort by score (higher is better in fuzzyfindjs)
      return results.sort((a, b) => (b.score || 0) - (a.score || 0));
    } catch (error) {
      console.error('Fuzzy search error:', error);
      // Fallback to basic search if fuzzy search fails
      return basicSearch(searchQuery, searchableItems);
    }
  }, [searchableItems, searchQuery, fuzzySearch]);

  // Fallback basic search function
  const basicSearch = (query: string, items: SearchableItem[]): SearchResult[] => {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    items.forEach(item => {
      const searchableText = item.searchableText.toLowerCase();
      
      if (searchableText.includes(lowerQuery)) {
        const matches: { text: string; highlight: string }[] = [];
        
        // Search in title
        if (item.section.title.toLowerCase().includes(lowerQuery)) {
          matches.push({
            text: item.section.title,
            highlight: highlightText(item.section.title, query)
          });
        }

        // Search in content
        const contentLines = item.section.content.split('\n');
        contentLines.forEach((line, index) => {
          if (line.toLowerCase().includes(lowerQuery) && line.trim() && matches.length < 3) {
            const contextStart = Math.max(0, index - 1);
            const contextEnd = Math.min(contentLines.length - 1, index + 1);
            const context = contentLines.slice(contextStart, contextEnd + 1).join(' ').trim();
            
            matches.push({
              text: context,
              highlight: highlightText(context, query)
            });
          }
        });

        if (matches.length > 0) {
          results.push({
            file: item.file,
            section: item.section,
            matches: matches.slice(0, 3),
            score: 0.8 // Default score for basic search
          });
        }
      }
    });

    return results.slice(0, 20);
  };

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isOpen,
    openSearch,
    closeSearch
  };
};

// Helper function to highlight matching text
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
