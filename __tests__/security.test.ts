import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock DOMPurify - must be hoisted to top level
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html),
  },
}));

import { sanitizeHTML, validateFilePath, sanitizeSearchHighlight } from '../src/utils/security';
import DOMPurify from 'dompurify';

// Get the mocked sanitize function
const mockSanitize = vi.mocked(DOMPurify.sanitize);

describe('Security Utils', () => {
  beforeEach(() => {
    mockSanitize.mockClear();
  });

  describe('sanitizeHTML', () => {
    it('should sanitize HTML content', () => {
      const maliciousHTML = '<script>alert("xss")</script><p>Safe content</p>';
      
      sanitizeHTML(maliciousHTML);
      
      expect(mockSanitize).toHaveBeenCalledWith(maliciousHTML, expect.objectContaining({
        ALLOWED_TAGS: expect.arrayContaining(['p', 'h1', 'h2', 'strong', 'em']),
        FORBID_TAGS: expect.arrayContaining(['script', 'object', 'embed', 'iframe']),
        FORBID_ATTR: expect.arrayContaining(['onerror', 'onload', 'onclick', 'onmouseover']),
      }));
    });

    it('should handle empty or invalid input', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null as any)).toBe('');
      expect(sanitizeHTML(undefined as any)).toBe('');
      expect(sanitizeHTML(123 as any)).toBe('');
    });

    it('should allow safe markdown elements', () => {
      const safeHTML = '<h1>Title</h1><p>Content</p><code>code</code>';
      
      sanitizeHTML(safeHTML);
      
      expect(mockSanitize).toHaveBeenCalledWith(safeHTML, expect.objectContaining({
        ALLOWED_TAGS: expect.arrayContaining(['h1', 'p', 'code', 'pre', 'strong', 'em']),
      }));
    });
  });

  describe('sanitizeSearchHighlight', () => {
    it('should use restrictive sanitization for search highlights', () => {
      const highlightHTML = '<mark>search term</mark><script>alert("xss")</script>';
      
      sanitizeSearchHighlight(highlightHTML);
      
      expect(mockSanitize).toHaveBeenCalledWith(highlightHTML, expect.objectContaining({
        ALLOWED_TAGS: ['mark', 'strong', 'em', 'span'],
        ALLOWED_ATTR: ['class'],
        FORBID_TAGS: expect.arrayContaining(['script', 'iframe', 'object', 'embed']),
        FORBID_ATTR: expect.arrayContaining(['onerror', 'onload', 'onclick', 'href', 'src']),
      }));
    });

    it('should handle empty input', () => {
      expect(sanitizeSearchHighlight('')).toBe('');
      expect(sanitizeSearchHighlight(null as any)).toBe('');
    });
  });

  describe('validateFilePath', () => {
    it('should allow valid paths', () => {
      const validPaths = [
        '/pages/test.md',
        '/src/pages/folder/file.mdx',
        '/pages/subfolder/document.md',
      ];

      validPaths.forEach(path => {
        expect(() => validateFilePath(path)).not.toThrow();
        expect(validateFilePath(path)).toBe(path);
      });
    });

    it('should reject path traversal attempts', () => {
      const maliciousPaths = [
        '/pages/../../../etc/passwd',
        '/src/pages/../config.json',
        '../pages/file.md',
        '/pages/folder/../../secret.txt',
      ];

      maliciousPaths.forEach(path => {
        expect(() => validateFilePath(path)).toThrow('path traversal detected');
      });
    });

    it('should reject paths outside allowed directories', () => {
      const unauthorizedPaths = [
        '/etc/passwd',
        '/home/user/secret.txt',
        '/config/database.json',
        '/src/components/Component.tsx',
      ];

      unauthorizedPaths.forEach(path => {
        expect(() => validateFilePath(path)).toThrow('path must start with one of');
      });
    });

    it('should reject suspicious characters', () => {
      const suspiciousPaths = [
        '/pages/file\0.md',           // Null byte
        '/pages/file%00.md',          // URL encoded null byte
        '/pages/%2e%2e/file.md',      // URL encoded ..
        '/pages/file%2ftest.md',      // URL encoded /
        '/pages/file%5ctest.md',      // URL encoded \\
      ];

      suspiciousPaths.forEach(path => {
        expect(() => validateFilePath(path)).toThrow('suspicious characters detected');
      });
    });

    it('should handle empty or invalid input', () => {
      expect(() => validateFilePath('')).toThrow('path must be a non-empty string');
      expect(() => validateFilePath(null as any)).toThrow('path must be a non-empty string');
      expect(() => validateFilePath(undefined as any)).toThrow('path must be a non-empty string');
    });

    it('should normalize path separators', () => {
      const windowsPath = '/pages\\folder\\file.md';
      expect(() => validateFilePath(windowsPath)).not.toThrow();
      expect(validateFilePath(windowsPath)).toBe('/pages/folder/file.md');
    });

    it('should work with custom allowed paths', () => {
      const customAllowedPaths = ['/docs/', '/content/'];
      
      expect(() => validateFilePath('/docs/file.md', customAllowedPaths)).not.toThrow();
      expect(() => validateFilePath('/content/article.md', customAllowedPaths)).not.toThrow();
      expect(() => validateFilePath('/pages/file.md', customAllowedPaths)).toThrow('path must start with one of');
    });
  });
});

describe('Security Integration Tests', () => {
  it('should prevent XSS in markdown content', () => {
    const maliciousMarkdown = `
      # Title
      <script>alert('xss')</script>
      <p onclick="alert('click')">Click me</p>
      <img src="x" onerror="alert('error')">
    `;

    sanitizeHTML(maliciousMarkdown);

    expect(mockSanitize).toHaveBeenCalledWith(
      maliciousMarkdown,
      expect.objectContaining({
        FORBID_TAGS: expect.arrayContaining(['script']),
        FORBID_ATTR: expect.arrayContaining(['onclick', 'onerror']),
      })
    );
  });

  it('should prevent path traversal in file access', () => {
    const maliciousPaths = [
      '/pages/../../../etc/passwd',
      '/src/pages/../../config/secrets.json',
      '../pages/file.md',
    ];

    maliciousPaths.forEach(path => {
      expect(() => validateFilePath(path)).toThrow();
    });
  });

  it('should allow legitimate content and paths', () => {
    const safeHTML = '<h1>Title</h1><p>Safe <strong>content</strong></p>';
    const safePath = '/pages/documentation/guide.md';

    expect(() => sanitizeHTML(safeHTML)).not.toThrow();
    expect(() => validateFilePath(safePath)).not.toThrow();
  });
});
