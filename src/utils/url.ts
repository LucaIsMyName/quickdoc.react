import type { AppState } from '../types';

/**
 * Parse URL path to extract file and section path
 * Format: /filename or /filename/section-slug
 * First segment is ALWAYS the file, second segment (if exists) is the section
 */
export const parseUrlHash = (): Partial<AppState> => {
  const path = window.location.pathname.slice(1); // Remove leading /
  
  if (!path || path === '') {
    return {};
  }

  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) {
    return {};
  }
  
  // First segment is the file slug
  const file = segments[0] || null;
  // Second segment (if exists) is the section slug within that file
  const section = segments.length > 1 ? segments[1] : null;
  
  return {
    currentFile: file,
    currentSection: section || null,
  };
};

/**
 * Build URL path from file and section
 * @param file - Current file slug
 * @param headingId - Target heading ID (section slug)
 */
export const buildUrlPath = (file: string, headingId: string): string => {
  // Simple format: /filename/section-slug
  return `/${file}/${headingId}`;
};

/**
 * Update URL path based on app state while preserving hash
 * @param state - Current app state
 */
export const updateUrlHash = (state: AppState): void => {
  const { currentFile, currentSection } = state;
  const currentHash = window.location.hash; // Preserve existing hash
  
  if (!currentFile) {
    window.history.replaceState(null, '', `/${currentHash}`);
    return;
  }

  if (!currentSection) {
    window.history.replaceState(null, '', `/${currentFile}${currentHash}`);
    return;
  }

  const path = buildUrlPath(currentFile, currentSection);
  window.history.replaceState(null, '', `${path}${currentHash}`);
};

/**
 * Get state from URL with fallback to localStorage and defaults
 * Priority: URL > localStorage > defaults
 */
export const getInitialState = (
  localStorageState: AppState | null,
  defaultFile: string | null
): AppState => {
  const urlState = parseUrlHash();
  
  return {
    currentFile: urlState.currentFile ?? localStorageState?.currentFile ?? defaultFile,
    currentSection: urlState.currentSection ?? localStorageState?.currentSection ?? null,
  };
};

// Removed getHeadingPath - not needed for simple file/section URLs
