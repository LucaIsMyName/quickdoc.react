import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { SearchDialog } from '../src/components/SearchDialog';
import { defaultConfig } from '../src/config/app.config';
import { describe, expect, it, vi } from 'vitest';

// Mock the document search hook
const setSearchQueryMock = vi.fn();

vi.mock('../src/hooks/useDocumentSearch', () => ({
  useDocumentSearch: () => ({
    searchQuery: 'next',
    setSearchQuery: setSearchQueryMock,
    searchResults: [
      {
        file: {
          slug: 'quickstart',
          title: 'Quick Start',
          content: '# Quick Start\n\n## What\'s Next?\n\nThis is the next section.'
        },
        section: {
          slug: 'what-s-next',
          title: 'What\'s Next?',
          level: 2
        },
        matches: [
          {
            highlight: 'This is the <mark>next</mark> section.'
          }
        ]
      },
      // Second result for keyboard navigation tests
      {
        file: {
          slug: 'quickdoc',
          title: 'QuickDoc Overview',
          content: '# QuickDoc Overview\n\n## Getting Started\n\nSome content.'
        },
        section: {
          slug: 'getting-started',
          title: 'Getting Started',
          level: 2
        },
        matches: [
          {
            highlight: 'Some <mark>content</mark> about getting started.'
          }
        ]
      }
    ]
  })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('SearchDialog URL Generation', () => {
  const mockFiles = [
    {
      slug: 'quickstart',
      title: 'Quick Start',
      content: '# Quick Start\n\n## What\'s Next?\n\nThis is the next section.',
      path: '/pages/quickstart/index.md',
      isMDX: false
    }
  ];

  it('should generate correct anchor URLs for sections', () => {
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={vi.fn()}
        config={defaultConfig}
      />
    );

    // Find the first search result link
    const [searchLink] = screen.getAllByRole('link');
    
    // Should link to /quickstart#what-s-next, not /quickstart/what-s-next
    expect(searchLink).toHaveAttribute('href', '/quickstart#what-s-next');
  });

  it('should display section title in search results', () => {
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={vi.fn()}
        config={defaultConfig}
      />
    );

    // Should show the section title
    expect(screen.getByText('What\'s Next?')).toBeInTheDocument();
  });

  it('should show file and section hierarchy in header', () => {
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={vi.fn()}
        config={defaultConfig}
      />
    );

    // Should show file title
    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    
    // Should show section title in hierarchy
    expect(screen.getByText('What\'s Next?')).toBeInTheDocument();
  });

  it('should close dialog when link is clicked', () => {
    const mockOnClose = vi.fn();
    
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const [firstLink] = screen.getAllByRole('link');
    fireEvent.click(firstLink);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('supports keyboard navigation with arrow keys and enter', () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const input = screen.getByPlaceholderText('Search documentation...');

    // ArrowDown should move active index from first to second result (handled internally)
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(1);

    // Press Enter should activate the current item and close dialog
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
