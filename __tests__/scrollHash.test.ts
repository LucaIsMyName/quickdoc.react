import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollToHeading } from '../src/utils/scrollHash';

// Basic jsdom-based test to ensure scrollToHeading applies the heading-flash class

describe('scrollToHeading', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // jsdom does not implement scrollTo by default
    (window as any).scrollTo = vi.fn();
  });

  it('applies heading-flash class to target heading', () => {
    const heading = document.createElement('h2');
    heading.id = 'steps-component';
    document.body.appendChild(heading);

    scrollToHeading('steps-component');

    expect(heading.classList.contains('heading-flash')).toBe(true);
  });
});
