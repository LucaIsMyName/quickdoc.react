import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import App from '../src/App';

describe('App', () => {
  it('renders the app without crashing', () => {
    const { container } = render(
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    );

    // App should render (either loading, error, or content state)
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    );

    // Should show loading text
    expect(getByText(/Loading documentation/i)).toBeTruthy();
  });

  it('maintains consistent hooks order across renders', () => {
    // Mock console.error to catch React hooks violations
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    let rerender: (ui: React.ReactElement) => void;
    
    act(() => {
      const result = render(
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      );
      rerender = result.rerender;
    });

    // Force multiple re-renders to test hooks consistency
    act(() => {
      rerender(
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      );
    });

    act(() => {
      rerender(
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      );
    });

    // Should not have any React hooks violations
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Rendered more hooks than during the previous render')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Rendered fewer hooks than expected')
    );

    consoleSpy.mockRestore();
  });

  it('handles state changes without hooks violations', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { rerender } = render(
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    );

    // Simulate route changes that could trigger different render paths
    act(() => {
      // Change location programmatically
      window.history.pushState({}, '', '/some-page');
      rerender(
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      );
    });

    act(() => {
      window.history.pushState({}, '', '/');
      rerender(
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      );
    });

    // Should not have any React hooks violations
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('hooks')
    );

    consoleSpy.mockRestore();
  });
});
