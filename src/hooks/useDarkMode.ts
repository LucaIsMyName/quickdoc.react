import { useState, useEffect } from "react";

const STORAGE_KEY = "quickdoc-dark-mode";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Priority: localStorage > system preference
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) {
      // User has explicitly set a preference before
      return stored === "true";
    }

    // First visit - use system preference (don't save yet)
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // console.log("useDarkMode useEffect triggered, isDark:", isDark);
    // console.log("Current HTML classes before change:", document.documentElement.className);

    // Always update document class when state changes
    if (isDark) {
      document.documentElement.classList.add("dark");
      // console.log("Added dark class to document");
    } else {
      document.documentElement.classList.remove("dark");
      // console.log("Removed dark class from document");
    }

    // console.log("Current HTML classes after change:", document.documentElement.className);

    // Save user preference to localStorage
    localStorage.setItem(STORAGE_KEY, String(isDark));
    // console.log("Saved to localStorage:", isDark);
  }, [isDark]);

  const toggle = () => {
    // console.log("Dark mode toggle clicked, current isDark:", isDark);
    // console.log("About to call setIsDark with:", !isDark);
    setIsDark((prev) => {
      const newValue = !prev;
      // console.log("setIsDark callback executed. prev:", prev, "newValue:", newValue);
      return newValue;
    });
  };

  return { isDark, toggle };
};
