import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

describe('App', () => {
  it('renders the app without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // App should render (either loading, error, or content state)
    expect(document.querySelector('div')).toBeTruthy();
  });

  it('renders mobile menu button', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const menuButton = screen.getByLabelText(/Toggle menu/i);
    expect(menuButton).toBeDefined();
  });
});
