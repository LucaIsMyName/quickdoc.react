import type { AppConfig } from '../config/app.config';
import { getTailwindColor, type TailwindColorName } from './colorStyles';

/**
 * Applies code block background styles based on theme configuration
 * Makes both inline code and fenced code blocks use the same background
 * that's slightly darker than the content background
 */
export const applyCodeBlockStyles = (config: AppConfig) => {
  const root = document.documentElement;
  
  // Determine if we're using the new simplified color system or legacy
  const isNewColorSystem = 'accent' in config.theme.colors;
  
  let lightCodeBg: string;
  let darkCodeBg: string;
  
  if (isNewColorSystem) {
    // New simplified color system
    const colors = config.theme.colors as { accent: TailwindColorName; light: TailwindColorName; dark: TailwindColorName };
    
    // Get the light color palette for backgrounds
    const lightColor = colors.light;
    const darkColor = colors.dark;
    
    // Use a noticeably darker shade for code blocks to create clear contrast
    // Light mode: use 200 weight (much darker than 50 which is used for secondary bg)
    lightCodeBg = getTailwindColor(lightColor, 50);
    
    // Dark mode: use 800 weight (slightly lighter than 900 which is used for secondary bg)
    darkCodeBg = getTailwindColor(darkColor, 800);
  } else {
    // Legacy color system - use backgroundSecondary as base and make it slightly darker
    const colors = config.theme.colors as {
      background: string;
      backgroundSecondary: string;
      primary: string;
    };
    
    // For legacy system, we'll darken the backgroundSecondary slightly
    // This is a fallback - ideally users should migrate to the new system
    lightCodeBg = colors.backgroundSecondary;
    darkCodeBg = colors.backgroundSecondary;
  }
  
  // Debug: Log the colors being applied
  console.log('[CodeBlockStyles] Applying colors:', { lightCodeBg, darkCodeBg });
  
  // Set CSS variables for code block backgrounds
  root.style.setProperty('--code-block-bg-light', lightCodeBg);
  root.style.setProperty('--code-block-bg-dark', darkCodeBg);
  
  // Create dynamic styles for code blocks
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --code-block-bg: var(--code-block-bg-light);
    }
    
    .dark {
      --code-block-bg: var(--code-block-bg-dark);
    }
    
    /* Inline code styling - matches fenced code blocks */
    .markdown-content code:not(pre code) {
      background-color: var(--code-block-bg, ${lightCodeBg}) !important;
      padding: 0.125rem 0.375rem !important;
      border-radius: 0.25rem !important;
      font-size: 0.875rem !important;
      color: var(--current-text) !important;
    }
    
    /* Dark mode inline code fallback */
    .dark .markdown-content code:not(pre code) {
      background-color: var(--code-block-bg, ${darkCodeBg}) !important;
    }
    
    /* Fenced code blocks (pre) - higher specificity */
    .markdown-content pre,
    .prose pre {
      background-color: var(--code-block-bg, ${lightCodeBg}) !important;
      padding: 1rem !important;
      border-radius: 0.5rem !important;
      overflow-x: auto !important;
      margin: 1rem 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
      position: relative !important;
    }
    
    /* Dark mode fallback */
    .dark .markdown-content pre,
    .dark .prose pre {
      background-color: var(--code-block-bg, ${darkCodeBg}) !important;
    }
    
    /* Code inside pre blocks - transparent background */
    .markdown-content pre code {
      background-color: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      color: var(--current-text) !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
    }
    
    /* Ensure proper text color in both light and dark modes */
    .markdown-content code,
    .markdown-content pre code {
      color: var(--current-text) !important;
    }
  `;
  
  // Remove existing code block style if it exists
  const existingStyle = document.getElementById('code-block-theme-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  style.id = 'code-block-theme-style';
  document.head.appendChild(style);
};
