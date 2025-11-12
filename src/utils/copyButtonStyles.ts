import type { AppConfig } from '../config/app.config';

/**
 * Applies copy button styles based on theme configuration
 * Handles border radius and border size according to theme settings
 */
export const applyCopyButtonStyles = (config: AppConfig) => {
  const { border } = config.theme;
  
  // Map border radius values to CSS
  const getBorderRadius = () => {
    switch (border.radius) {
      case "none": return "0";
      case "sm": return "0.25rem";
      case "md": return "0.375rem";
      case "lg": return "0.5rem";
      default: return "0.25rem";
    }
  };
  
  // Map border size values to CSS
  const getBorderWidth = () => {
    switch (border.size) {
      case "none": return "0";
      case 1: return "1px";
      case 2: return "2px";
      case 3: return "3px";
      default: return "0";
    }
  };
  
  // Determine if borders should be applied
  const shouldShowBorder = border.size !== "none" && border.size > 0;
  
  const borderRadius = getBorderRadius();
  const borderWidth = getBorderWidth();
  
  // Create dynamic styles for copy button
  const style = document.createElement('style');
  style.textContent = `
    /* Copy button styling based on theme configuration */
    .copy-button {
      border-radius: ${borderRadius} !important;
      ${shouldShowBorder ? `
        border: ${borderWidth} solid var(--current-border) !important;
      ` : `
        border: none !important;
      `}
      background-color: var(--current-bg-secondary) !important;
      color: var(--current-text) !important;
      padding: 0.5rem !important;
      transition: all 0.2s ease !important;
      opacity: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
    }
    
    .copy-button:hover {
      background-color: var(--current-accent) !important;
      color: var(--current-bg) !important;
      opacity: 1 !important;
    }
    
    .markdown-content pre:hover .copy-button,
    .prose pre:hover .copy-button {
      opacity: 1 !important;
    }
    
    .copy-button.copied {
      opacity: 1 !important;
      background-color: var(--current-accent) !important;
      color: var(--current-bg) !important;
    }
    
    .copy-button svg {
      width: 1rem !important;
      height: 1rem !important;
    }
    
    .copy-button-container {
      position: absolute !important;
      top: 0.5rem !important;
      right: 0.5rem !important;
      z-index: 10 !important;
    }
  `;
  
  // Remove existing copy button style if it exists
  const existingStyle = document.getElementById('copy-button-theme-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  style.id = 'copy-button-theme-style';
  document.head.appendChild(style);
};
