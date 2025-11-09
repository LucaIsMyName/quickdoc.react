import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../src/App';

describe('App', () => {
  it('renders the app without crashing', () => {
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    );

    // App should render (either loading, error, or content state)
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Should show loading text
    expect(getByText(/Loading documentation/i)).toBeTruthy();
  });

  it('maintains consistent hooks order across renders', () => {
    // Mock console.error to catch React hooks violations
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    let rerender: any;
    
    act(() => {
      const result = render(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      );
      rerender = result.rerender;
    });

    // Force multiple re-renders to test hooks consistency
    act(() => {
      rerender(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      );
    });

    act(() => {
      rerender(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
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
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Simulate route changes that could trigger different render paths
    act(() => {
      // Change location programmatically
      window.history.pushState({}, '', '/some-page');
      rerender(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      );
    });

    act(() => {
      window.history.pushState({}, '', '/');
      rerender(
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
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
