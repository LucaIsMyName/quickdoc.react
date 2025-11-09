import type { AppConfig } from '../config/app.config';

/**
 * Applies inline code border styles based on theme configuration
 */
export const applyInlineCodeStyles = (config: AppConfig) => {
  const root = document.documentElement;
  const { border } = config.theme;

  // Determine if borders should be applied
  const shouldShowBorder = border.size !== "none" && border.size > 0;

  if (shouldShowBorder) {
    // Set border width (always 1px for inline code)
    root.style.setProperty('--inline-code-border-width', '1px');
    
    // Set border color based on border size (darker for higher values)
    let borderColor: string;
    
    switch (border.size) {
      case 1:
        borderColor = '#e5e7eb'; // Light gray (border-gray-200)
        break;
      case 2:
        borderColor = '#d1d5db'; // Medium gray (border-gray-300)
        break;
      case 3:
        borderColor = '#9ca3af'; // Darker gray (border-gray-400)
        break;
      default:
        borderColor = '#e5e7eb'; // Default to light gray
    }

    // Set CSS variables for light mode
    root.style.setProperty('--inline-code-border-color', borderColor);
    
    // Dark mode colors (darker variants)
    const darkBorderColor = border.size === 1 ? '#374151' : 
                           border.size === 2 ? '#4b5563' : 
                           '#6b7280';
    
    // Apply dark mode styles via CSS custom properties
    root.style.setProperty('--inline-code-border-color-dark', darkBorderColor);
    
    // Update the CSS to use dark mode colors
    const style = document.createElement('style');
    style.textContent = `
      .dark .markdown-content p code,
      .dark .markdown-content li code,
      .dark .markdown-content td code,
      .dark .markdown-content th code,
      .dark .markdown-content blockquote code {
        border-color: var(--inline-code-border-color-dark);
      }
    `;
    
    // Remove existing inline code style if it exists
    const existingStyle = document.getElementById('inline-code-border-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.id = 'inline-code-border-style';
    document.head.appendChild(style);
  } else {
    // Remove borders
    root.style.setProperty('--inline-code-border-width', '0');
    
    // Remove the dynamic style
    const existingStyle = document.getElementById('inline-code-border-style');
    if (existingStyle) {
      existingStyle.remove();
    }
  }
};
