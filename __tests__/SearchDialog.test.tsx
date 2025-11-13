import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { SearchDialog } from '../src/components/SearchDialog';
import { defaultConfig } from '../src/config/app.config';
import { vi } from 'vitest';

// Mock the document search hook
vi.mock('../src/hooks/useDocumentSearch', () => ({
  useDocumentSearch: () => ({
    searchQuery: 'next',
    setSearchQuery: vi.fn(),
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

  test('should generate correct anchor URLs for sections', () => {
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={vi.fn()}
        config={defaultConfig}
      />
    );

    // Find the search result link
    const searchLink = screen.getByRole('link');
    
    // Should link to /quickstart#what-s-next, not /quickstart/what-s-next
    expect(searchLink).toHaveAttribute('href', '/quickstart#what-s-next');
  });

  test('should display section title in search results', () => {
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

  test('should show file and section hierarchy in header', () => {
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

  test('should close dialog when link is clicked', () => {
    const mockOnClose = vi.fn();
    
    renderWithProviders(
      <SearchDialog
        files={mockFiles}
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const searchLink = screen.getByRole('link');
    fireEvent.click(searchLink);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
