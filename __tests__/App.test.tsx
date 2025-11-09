import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
});
