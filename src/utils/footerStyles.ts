import type { AppConfig } from '../config/app.config';

/**
 * Applies footer styles based on theme configuration
 * Handles borders, colors, and spacing according to theme settings
 */
export const applyFooterStyles = (config: AppConfig) => {
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
      default: return "1px";
    }
  };
  
  // Determine if borders should be applied
  const shouldShowBorder = border.size !== "none" && border.size > 0;
  
  const borderRadius = getBorderRadius();
  const borderWidth = getBorderWidth();
  
  // Create dynamic styles for document footer
  const style = document.createElement('style');
  style.textContent = `
    /* Document footer styling based on theme configuration */
    .document-footer {
      margin-top: 3rem !important;
      margin-bottom: 2rem !important;
      padding-top: 1.5rem !important;
      ${shouldShowBorder ? `
        border-top: ${borderWidth} solid var(--current-border) !important;
      ` : `
        border-top: 1px solid var(--current-border) !important;
      `}
    }
    
    .document-footer .theme-border {
      ${shouldShowBorder ? `
        border-color: var(--current-border) !important;
        border-width: ${borderWidth} !important;
      ` : `
        border-color: var(--current-border) !important;
        border-width: 1px !important;
      `}
    }
    
    .document-footer code {
      border-radius: ${borderRadius} !important;
      ${shouldShowBorder ? `
        border: ${borderWidth} solid var(--current-border) !important;
      ` : `
        border: none !important;
      `}
    }
    
    .document-footer a:hover {
      text-decoration: underline !important;
    }
    
    /* Responsive behavior for single row layout */
    @media (max-width: 640px) {
      .document-footer {
        margin-top: 2rem !important;
        padding-top: 1rem !important;
      }
      
      .document-footer > div {
        gap: 0.75rem !important;
      }
    }
  `;
  
  // Remove existing footer style if it exists
  const existingStyle = document.getElementById('footer-theme-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  style.id = 'footer-theme-style';
  document.head.appendChild(style);
};
