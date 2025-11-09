import type { AppState } from '../types';

const STORAGE_KEY = 'quickdoc-state';

/**
 * Save app state to localStorage
 */
export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

/**
 * Load app state from localStorage
 */
export const loadState = (): AppState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};

/**
 * Clear app state from localStorage
 */
export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
};
