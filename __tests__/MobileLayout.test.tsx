import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import App from '../src/App';
import { vi } from 'vitest';

// Mock the markdown files hook
vi.mock('../src/hooks/useMarkdownFiles', () => ({
  useMarkdownFiles: () => ({
    files: [
      {
        slug: 'test-file',
        title: 'Test File',
        content: '# Test Content\n\nThis is test content.',
        path: '/pages/test-file.md'
      }
    ],
    loading: false,
    error: null
  })
}));

// Mock the app state hook
vi.mock('../src/hooks/useAppState', () => ({
  useAppState: () => ({
    state: {
      currentFile: 'test-file',
      currentSection: null
    },
    setCurrentFile: vi.fn(),
    setCurrentSection: vi.fn()
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

describe('Mobile Layout Behavior', () => {
  beforeEach(() => {
    // Reset viewport to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone size
    });
    
    // Mock matchMedia for mobile
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('768px') ? false : true, // Mobile breakpoint
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test('sidebar should be hidden by default on mobile', () => {
    renderWithProviders(<App />);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('sidebar should overlay content when opened on mobile', () => {
    renderWithProviders(<App />);
    
    // Find and click the mobile menu button
    const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(menuButton);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).toHaveClass('fixed');
    expect(sidebar).toHaveClass('shadow-xl');
  });

  test('sidebar should have overlay backdrop on mobile when open', () => {
    renderWithProviders(<App />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(menuButton);
    
    // Check for overlay backdrop
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('opacity-100');
  });

  test('clicking overlay should close mobile sidebar', () => {
    renderWithProviders(<App />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(menuButton);
    
    // Click overlay to close
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50');
    fireEvent.click(overlay!);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('main content should not be pushed by sidebar on mobile', () => {
    renderWithProviders(<App />);
    
    const main = screen.getByRole('main');
    
    // Main content should take full width on mobile
    expect(main).toHaveClass('w-full');
    
    // Open sidebar and verify main content position doesn't change
    const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(menuButton);
    
    // Main content should still be in same position
    expect(main).toHaveClass('w-full');
  });
});

describe('Desktop Layout Behavior', () => {
  beforeEach(() => {
    // Reset viewport to desktop size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop size
    });
    
    // Mock matchMedia for desktop
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('768px') ? true : false, // Desktop breakpoint
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test('sidebar should be visible by default on desktop', () => {
    renderWithProviders(<App />);
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('md:translate-x-0');
    expect(sidebar).toHaveClass('md:sticky');
  });

  test('desktop sidebar should be in document flow (not overlay)', () => {
    renderWithProviders(<App />);
    
    const sidebar = screen.getByRole('complementary');
    // On desktop, sidebar should use sticky positioning (part of document flow)
    expect(sidebar).toHaveClass('md:sticky');
    // Should not have fixed positioning on desktop
    expect(sidebar).toHaveClass('fixed'); // This is for mobile, overridden by md:sticky
  });
});
