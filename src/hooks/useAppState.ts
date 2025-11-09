import { useState, useEffect, useCallback } from 'react';
import type { AppState } from '../types';
import { saveState, loadState } from '../utils/storage';
import { updateUrlHash, getInitialState, parseUrlHash } from '../utils/url';

/**
 * Hook to manage app state with URL and localStorage sync
 * Priority: URL > localStorage > defaults
 */
export const useAppState = (defaultFile: string | null) => {
  const [state, setState] = useState<AppState>(() => {
    const localStorageState = loadState();
    return getInitialState(localStorageState, defaultFile);
  });

  // Sync state to URL and localStorage whenever it changes
  useEffect(() => {
    updateUrlHash(state);
    saveState(state);
  }, [state]);

  // Sync state from URL on mount and when URL changes
  useEffect(() => {
    const syncFromUrl = () => {
      const urlState = parseUrlHash();
      if (urlState.currentFile || urlState.currentSection) {
        setState((prev) => ({
          currentFile: urlState.currentFile ?? prev.currentFile,
          currentSection: urlState.currentSection ?? null,
        }));
      }
    };

    // Check URL on mount
    syncFromUrl();

    // Use focus event instead of polling for manual URL changes
    const handleFocus = () => {
      syncFromUrl();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlState = parseUrlHash();
      setState((prev) => ({
        currentFile: urlState.currentFile ?? prev.currentFile,
        currentSection: urlState.currentSection ?? prev.currentSection,
      }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const urlState = parseUrlHash();
      setState((prev) => ({
        currentFile: urlState.currentFile ?? prev.currentFile,
        currentSection: urlState.currentSection ?? prev.currentSection,
      }));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentFile = useCallback((file: string | null) => {
    setState((prev) => ({
      ...prev,
      currentFile: file,
      currentSection: null, // Reset section when changing files
    }));
  }, []);

  const setCurrentSection = useCallback((section: string | null) => {
    setState((prev) => ({
      ...prev,
      currentSection: section,
    }));
  }, []);

  return {
    state,
    setCurrentFile,
    setCurrentSection,
  };
};
