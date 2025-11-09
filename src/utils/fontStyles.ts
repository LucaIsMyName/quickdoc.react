import type { AppConfig } from '../config/app.config';

/**
 * Applies font styles from the app configuration
 * Handles both system fonts and Google Font overrides
 */
export const applyFontStyles = (config: AppConfig) => {
  const root = document.documentElement;
  const { fonts } = config.theme;

  // Check if Google Fonts are configured
  if (fonts.googleFonts?.sans || fonts.googleFonts?.mono) {
    loadGoogleFonts(fonts.googleFonts, fonts);
  } else {
    // Use system fonts only and apply immediately
    applyFontVariables(fonts, false);
  }

  // Apply font size
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px'
  };
  
  root.style.setProperty('--font-size-base', fontSizeMap[fonts.size]);
};

/**
 * Loads Google Fonts dynamically
 */
const loadGoogleFonts = (googleFonts: NonNullable<AppConfig['theme']['fonts']['googleFonts']>, fonts: AppConfig['theme']['fonts']) => {
  // Add preconnect links if enabled
  if (googleFonts.preconnect !== false) {
    addPreconnectLinks();
  }

  // Build Google Fonts URL with correct format for API v2
  const fontFamilies: string[] = [];
  
  if (googleFonts.sans) {
    // Convert "Work Sans:300,400,500,600,700" to "Work+Sans:wght@300;400;500;600;700"
    const [family, weights] = googleFonts.sans.split(':');
    if (family) {
      if (weights) {
        fontFamilies.push(`family=${family.replace(/\s+/g, '+')}:wght@${weights.replace(/,/g, ';')}`);
      } else {
        fontFamilies.push(`family=${family.replace(/\s+/g, '+')}`);
      }
    }
  }
  
  if (googleFonts.mono) {
    // Convert "JetBrains Mono:400,500,600,700" to "JetBrains+Mono:wght@400;500;600;700"
    const [family, weights] = googleFonts.mono.split(':');
    if (family) {
      if (weights) {
        fontFamilies.push(`family=${family.replace(/\s+/g, '+')}:wght@${weights.replace(/,/g, ';')}`);
      } else {
        fontFamilies.push(`family=${family.replace(/\s+/g, '+')}`);
      }
    }
  }

  if (fontFamilies.length === 0) return;

  const fontsUrl = `https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap`;

  // Check if font link already exists
  const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`);
  if (existingLink) {
    existingLink.remove(); // Remove old link to replace with new one
  }

  // Create and append font link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontsUrl;
  
  // Add error handling
  link.onload = () => {
    // Apply fonts after successful load
    applyFontVariables(fonts, true);
  };
  
  link.onerror = (error) => {
    console.error('Failed to load Google Fonts:', error);
    console.error('Font URL:', fontsUrl);
    // Apply system fonts as fallback
    applyFontVariables(fonts, false);
  };
  
  document.head.appendChild(link);
};

/**
 * Apply font CSS variables
 */
const applyFontVariables = (fonts: AppConfig['theme']['fonts'], useGoogleFonts: boolean) => {
  const root = document.documentElement;
  
  if (useGoogleFonts && fonts.googleFonts) {
    // Build font stacks with Google Fonts as primary
    const sansStack = fonts.googleFonts.sans 
      ? `"${extractFontFamily(fonts.googleFonts.sans)}", ${fonts.sans}`
      : fonts.sans;
      
    const monoStack = fonts.googleFonts.mono
      ? `"${extractFontFamily(fonts.googleFonts.mono)}", ${fonts.mono}`
      : fonts.mono;

    root.style.setProperty('--font-sans', sansStack);
    root.style.setProperty('--font-mono', monoStack);
  } else {
    // Use system fonts only
    root.style.setProperty('--font-sans', fonts.sans);
    root.style.setProperty('--font-mono', fonts.mono);
  }
};

/**
 * Adds preconnect links for Google Fonts performance
 */
const addPreconnectLinks = () => {
  const preconnectUrls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnectUrls.forEach(url => {
    // Check if preconnect already exists
    const existing = document.querySelector(`link[rel="preconnect"][href="${url}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    // Only add crossorigin for gstatic
    if (url.includes('gstatic')) {
      link.crossOrigin = '';
    }
    document.head.appendChild(link);
  });
};

/**
 * Extracts font family name from Google Fonts string
 * e.g., "Inter:400,500,600,700" -> "Inter"
 */
const extractFontFamily = (googleFontString: string): string => {
  return googleFontString.split(':')[0] || googleFontString;
};

/**
 * Removes all Google Font links and preconnects from the document
 * Useful for cleaning up when switching configurations
 */
export const removeGoogleFonts = () => {
  // Remove Google Fonts stylesheets
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  fontLinks.forEach(link => link.remove());

  // Remove preconnect links
  const preconnectLinks = document.querySelectorAll('link[rel="preconnect"][href*="fonts.g"]');
  preconnectLinks.forEach(link => link.remove());
};
