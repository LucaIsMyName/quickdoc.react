import type { AppState } from '../types';

/**
 * Parse URL hash to extract file and section
 * Format: #filename or #filename/section
 */
export const parseUrlHash = (): Partial<AppState> => {
  const hash = window.location.hash.slice(1); // Remove #
  
  if (!hash) {
    return {};
  }

  const [file, section] = hash.split('/');
  
  return {
    currentFile: file || null,
    currentSection: section || null,
  };
};

/**
 * Update URL hash based on app state
 */
export const updateUrlHash = (state: AppState): void => {
  const { currentFile, currentSection } = state;
  
  if (!currentFile) {
    window.history.replaceState(null, '', window.location.pathname);
    return;
  }

  const hash = currentSection 
    ? `#${currentFile}/${currentSection}`
    : `#${currentFile}`;
  
  window.history.replaceState(null, '', hash);
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
