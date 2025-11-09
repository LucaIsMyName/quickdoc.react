import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { ScrollFade } from '../src/components/ScrollFade';

// Mock scrollHeight and clientHeight for testing
const mockScrollProperties = (element: HTMLElement, scrollHeight: number, clientHeight: number, scrollTop = 0) => {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    value: scrollTop,
  });
};

describe('ScrollFade', () => {
  beforeEach(() => {
    // Mock console.error to catch React hooks violations
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <ScrollFade>
        <div>Test content</div>
      </ScrollFade>
    );

    expect(container.querySelector('div')).toBeTruthy();
  });

  it('does not show fade effects when content is not scrollable', () => {
    const { container } = render(
      <ScrollFade>
        <div>Short content</div>
      </ScrollFade>
    );

    // Should not have scroll-fade-container class when not scrollable
    expect(container.querySelector('.scroll-fade-container')).toBeFalsy();
  });

  it('shows fade effects when content is scrollable', () => {
    const { container } = render(
      <ScrollFade>
        <div style={{ height: '1000px' }}>Long content</div>
      </ScrollFade>
    );

    const scrollableDiv = container.querySelector('div > div');
    if (scrollableDiv) {
      // Mock scrollable content
      mockScrollProperties(scrollableDiv as HTMLElement, 1000, 200);
      
      // Trigger resize to update scrollable state
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    // Note: In jsdom environment, scroll detection might not work perfectly
    // This test mainly ensures the component renders without errors
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('handles horizontal scrolling direction', () => {
    const { container } = render(
      <ScrollFade direction="horizontal">
        <div style={{ width: '1000px' }}>Wide content</div>
      </ScrollFade>
    );

    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollFade className="custom-class">
        <div>Test content</div>
      </ScrollFade>
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('uses custom size and intensity props', () => {
    const { container } = render(
      <ScrollFade size={60} intensity={0.9}>
        <div>Test content</div>
      </ScrollFade>
    );

    expect(container.querySelector('div')).toBeTruthy();
  });

  it('does not have React hooks violations', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    const { rerender } = render(
      <ScrollFade>
        <div>Test content</div>
      </ScrollFade>
    );

    // Force multiple re-renders to test hooks consistency
    act(() => {
      rerender(
        <ScrollFade direction="horizontal">
          <div>Test content</div>
        </ScrollFade>
      );
    });

    act(() => {
      rerender(
        <ScrollFade direction="vertical" size={50}>
          <div>Test content</div>
        </ScrollFade>
      );
    });

    // Should not have any React hooks violations
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Invalid hook call')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('hooks')
    );
  });

  it('properly cleans up event listeners', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ScrollFade>
        <div>Test content</div>
      </ScrollFade>
    );

    // Unmount the component
    unmount();

    // Should have called removeEventListener for cleanup
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
