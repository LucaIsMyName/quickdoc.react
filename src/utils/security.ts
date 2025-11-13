import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to remove potentially dangerous elements and attributes
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Configure DOMPurify to allow common markdown elements
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'b', 'i', 'u', 's', 'mark',
      'ul', 'ol', 'li',
      'blockquote',
      'pre', 'code',
      'a',
      'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src',
      'class', 'id',
      'data-*',
      'aria-*',
    ],
    ALLOW_DATA_ATTR: true,
    ALLOW_ARIA_ATTR: true,
    // Remove script tags and event handlers
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  };

  return DOMPurify.sanitize(html, config);
};

/**
 * Validate file paths to prevent path traversal attacks
 * Ensures paths are within allowed directories
 */
export const validateFilePath = (path: string, allowedPaths: string[] = ['/pages/', '/src/pages/']): string => {
  if (!path || typeof path !== 'string') {
    throw new Error('Invalid path: path must be a non-empty string');
  }

  // Normalize path separators
  const normalizedPath = path.replace(/\\/g, '/');

  // Check for path traversal attempts
  if (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
    throw new Error('Invalid path: path traversal detected');
  }

  // Check if path starts with an allowed prefix
  const isAllowed = allowedPaths.some(allowedPath => 
    normalizedPath.startsWith(allowedPath)
  );

  if (!isAllowed) {
    throw new Error(`Invalid path: path must start with one of: ${allowedPaths.join(', ')}`);
  }

  // Additional security checks
  const suspiciousPatterns = [
    /\0/,           // Null bytes
    /%00/,          // URL encoded null bytes
    /%2e%2e/i,      // URL encoded ..
    /%2f/i,         // URL encoded /
    /%5c/i,         // URL encoded \\
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(normalizedPath)) {
      throw new Error('Invalid path: suspicious characters detected');
    }
  }

  return normalizedPath;
};

/**
 * Sanitize search highlight HTML to prevent XSS in search results
 * More restrictive than general HTML sanitization
 */
export const sanitizeSearchHighlight = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const config = {
    ALLOWED_TAGS: ['mark', 'strong', 'em', 'span'],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'href', 'src'],
  };

  return DOMPurify.sanitize(html, config);
};
