import type { AppState } from '../types';

/**
 * Parse URL path to extract file and section path
 * Format: /folder or /folder/filename
 * For folder/file structure: segments[0] is folder, segments[1] is file (if exists)
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
  
  // For folder/file structure: combine segments to create full file slug
  const file = segments.length > 1 ? `${segments[0]}/${segments[1]}` : segments[0] || null;
  // Section is now handled by hash, not URL segments
  const section = null;
  
  return {
    currentFile: file,
    currentSection: section,
  };
};

/**
 * Build URL path from file and section
 * @param file - Current file slug (may include folder/file format)
 * @param headingId - Target heading ID (section slug) - now handled by hash
 */
export const buildUrlPath = (file: string, headingId: string): string => {
  // For folder/file structure, file already contains the full path
  // Sections are now handled by hash, not URL segments
  return `/${file}#${headingId}`;
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
