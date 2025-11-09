import { useMemo, useState } from 'react';
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
}

export const useDocumentSearch = (files: MarkdownFile[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Index all documents for search
  const searchIndex = useMemo(() => {
    const index: SearchResult[] = [];

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
            index.push({
              file,
              section: { ...currentSection },
              matches: []
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
        index.push({
          file,
          section: { ...currentSection },
          matches: []
        });
      }
    });

    return index;
  }, [files]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    searchIndex.forEach(item => {
      const { section, file } = item;
      const searchableText = `${section.title} ${section.content}`.toLowerCase();
      
      if (searchableText.includes(query)) {
        // Find all matches and highlight them
        const matches: { text: string; highlight: string }[] = [];
        
        // Search in title
        if (section.title.toLowerCase().includes(query)) {
          matches.push({
            text: section.title,
            highlight: highlightText(section.title, query)
          });
        }

        // Search in content and find surrounding context
        const contentLines = section.content.split('\n');
        contentLines.forEach((line, index) => {
          if (line.toLowerCase().includes(query) && line.trim()) {
            // Get context (previous and next lines)
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
            file,
            section,
            matches: matches.slice(0, 3) // Limit to 3 matches per section
          });
        }
      }
    });

    return results.slice(0, 20); // Limit total results
  }, [searchIndex, searchQuery]);

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
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
