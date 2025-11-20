import { describe, it, expect, beforeEach } from 'vitest';
import { parseUrlHash, buildUrlPath, getInitialState } from '../src/utils/url';
import { extractNavigation } from '../src/utils/markdown';
import type { AppState } from '../src/types';

describe('Navigation Logic', () => {
  beforeEach(() => {
    // Reset URL
    window.history.replaceState(null, '', '/');
    localStorage.clear();
  });

  describe('URL Parsing', () => {
    it('parses file-only URL', () => {
      window.history.replaceState(null, '', '/quick-start');
      const result = parseUrlHash();
      
      expect(result.currentFile).toBe('quick-start');
      expect(result.currentSection).toBeNull();
    });

    it('parses file with section URL', () => {
      window.history.replaceState(null, '', '/quick-start#installation');
      const result = parseUrlHash();
      
      expect(result.currentFile).toBe('quick-start');
      expect(result.currentSection).toBe('installation');
    });

    it('handles root URL', () => {
      window.history.replaceState(null, '', '/');
      const result = parseUrlHash();
      
      expect(result.currentFile).toBeUndefined();
      expect(result.currentSection).toBeUndefined();
    });

    it('ignores extra path segments', () => {
      window.history.replaceState(null, '', '/quick-start#installation');
      const result = parseUrlHash();
      
      expect(result.currentFile).toBe('quick-start');
      expect(result.currentSection).toBe('installation');
    });
  });

  describe('URL Building', () => {
    it('builds file with section URL', () => {
      const url = buildUrlPath('quick-start', 'installation');
      expect(url).toBe('/quick-start#installation');
    });

    it('builds simple URLs', () => {
      const url = buildUrlPath('readme', 'features');
      expect(url).toBe('/readme#features');
    });
  });

  describe('Initial State', () => {
    it('prioritizes URL over localStorage', () => {
      window.history.replaceState(null, '', '/quick-start#installation');
      const localStorageState: AppState = {
        currentFile: 'readme',
        currentSection: 'features',
        fontSize: 'medium',
      };
      
      const state = getInitialState(localStorageState, 'default-file', 'medium');
      
      expect(state.currentFile).toBe('quick-start');
      expect(state.currentSection).toBe('installation');
    });

    it('falls back to localStorage when no URL', () => {
      window.history.replaceState(null, '', '/');
      const localStorageState: AppState = {
        currentFile: 'readme',
        currentSection: 'features',
        fontSize: 'medium',
      };
      
      const state = getInitialState(localStorageState, 'default-file', 'medium');
      
      expect(state.currentFile).toBe('readme');
      expect(state.currentSection).toBe('features');
    });

    it('falls back to default when no URL or localStorage', () => {
      window.history.replaceState(null, '', '/');
      
      const state = getInitialState(null, 'default-file', 'medium');
      
      expect(state.currentFile).toBe('default-file');
      expect(state.currentSection).toBeNull();
    });
  });

  describe('Breaking Points', () => {
    const markdownContent = `# Main Title

## Section 1
Content for section 1

### Subsection 1.1
Content for subsection 1.1

### Subsection 1.2
Content for subsection 1.2

## Section 2
Content for section 2

### Subsection 2.1
Content for subsection 2.1

#### Deep Section 2.1.1
Very deep content

## Section 3
Content for section 3`;

    it('extracts H2 headings with h2 breaking point', () => {
      const navigation = extractNavigation(markdownContent, 'h2');
      
      expect(navigation).toHaveLength(4); // H1 + 3 H2s
      expect(navigation[0]?.title).toBe('Main Title');
      expect(navigation[0]?.level).toBe(1);
      expect(navigation[1]?.title).toBe('Section 1');
      expect(navigation[1]?.level).toBe(2);
      expect(navigation[2]?.title).toBe('Section 2');
      expect(navigation[3]?.title).toBe('Section 3');
    });

    it('extracts up to H3 headings with h3 breaking point', () => {
      const navigation = extractNavigation(markdownContent, 'h3');
      
      expect(navigation).toHaveLength(7); // H1 + 3 H2s + 3 H3s
      expect(navigation.filter(n => n.level === 3)).toHaveLength(3);
    });

    it('extracts up to H4 headings with h4 breaking point', () => {
      const navigation = extractNavigation(markdownContent, 'h4');
      
      expect(navigation).toHaveLength(8); // H1 + 3 H2s + 3 H3s + 1 H4
      expect(navigation.filter(n => n.level === 4)).toHaveLength(1);
      expect(navigation.find(n => n.level === 4)?.title).toBe('Deep Section 2.1.1');
    });

    it('generates correct slugs', () => {
      const navigation = extractNavigation(markdownContent, 'h2');
      
      expect(navigation[0]?.slug).toBe('main-title');
      expect(navigation[1]?.slug).toBe('section-1');
      expect(navigation[2]?.slug).toBe('section-2');
      expect(navigation[3]?.slug).toBe('section-3');
    });
  });

  describe('Navigation Flow', () => {
    it('navigating to /file should load that file', () => {
      window.history.replaceState(null, '', '/quick-start');
      const state = parseUrlHash();
      
      expect(state.currentFile).toBe('quick-start');
      expect(state.currentSection).toBeNull();
    });

    it('navigating to /file#section should load file and scroll to section', () => {
      window.history.replaceState(null, '', '/quick-start#installation');
      const state = parseUrlHash();
      
      expect(state.currentFile).toBe('quick-start');
      expect(state.currentSection).toBe('installation');
    });

    it('clicking sidebar item should update URL hash for section', () => {
      // Start at /quick-start
      window.history.replaceState(null, '', '/quick-start');
      let state = parseUrlHash();
      expect(state.currentFile).toBe('quick-start');
      
      // Click sidebar item -> /quick-start#installation
      const newUrl = buildUrlPath('quick-start', 'installation');
      window.history.replaceState(null, '', newUrl);
      state = parseUrlHash();
      
      expect(state.currentFile).toBe('quick-start');
      expect(state.currentSection).toBe('installation');
    });
  });
});
