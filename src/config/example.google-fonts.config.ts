import type { AppConfig } from './app.config';

/**
 * Example configuration showing how to use Google Fonts and expanded sidebar
 * Copy this configuration to app.config.ts and modify as needed
 */
export const googleFontsConfig: Pick<AppConfig, 'theme' | 'navigation'> = {
  navigation: {
    breakingPoint: "h2",
    showH1InSidebar: true,
    collapsible: false,
    expandAllSections: true, // Show all subsections expanded at all times
    sidebarWidth: {
      min: "200px",
      default: "280px",
      max: "350px",
    },
    enableUserSidebarWidthChange: false,
    pagination: {
      enabled: true,
      showOnTop: false,
      showOnBottom: true,
    },
    fileOrder: ["quick-start", "quickdoc", "markdown-guide", "license"],
  },
  theme: {
    colors: {
      primary: "#111827",
      secondary: "#374151", 
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      text: "#111827",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      accent: "#111827",
      activeBackground: "#f3f4f6",
      activeText: "#111827",
    },
    isSidebarTransparent: false,
    fonts: {
      // System fonts as fallback
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
      size: "medium",
      
      // Google Fonts: Work Sans + JetBrains Mono (Default)
      googleFonts: {
        sans: "Work Sans:300,400,500,600,700",        // Clean, professional sans-serif
        mono: "JetBrains Mono:400,500,600,700",       // Developer-friendly monospace
        preconnect: true                              // Optimize loading performance
      }
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: "sm",
      size: 2, // Adds borders to inline code elements (1=light, 2=medium, 3=dark)
    },
  }
};

/**
 * Alternative Google Font combinations:
 */

// Option 1: Work Sans + Fira Code (Code-focused)
export const workSansWithFiraCode = {
  googleFonts: {
    sans: "Work Sans:300,400,500,600,700",
    mono: "Fira Code:400,500,600",
    preconnect: true
  }
};

// Option 2: Work Sans + Source Code Pro (Classic)
export const workSansWithSourceCode = {
  googleFonts: {
    sans: "Work Sans:300,400,500,600,700",
    mono: "Source Code Pro:400,500,600",
    preconnect: true
  }
};

// Option 3: Inter + JetBrains Mono (Modern)
export const interWithJetBrains = {
  googleFonts: {
    sans: "Inter:400,500,600,700",
    mono: "JetBrains Mono:400,500,600,700",
    preconnect: true
  }
};

// Option 4: Poppins + Space Mono (Stylish)
export const poppinsWithSpaceMono = {
  googleFonts: {
    sans: "Poppins:400,500,600,700",
    mono: "Space Mono:400,700",
    preconnect: true
  }
};

// Option 5: IBM Plex Sans + IBM Plex Mono (Technical)
export const ibmPlexFamily = {
  googleFonts: {
    sans: "IBM Plex Sans:400,500,600,700",
    mono: "IBM Plex Mono:400,500,600",
    preconnect: true
  }
};
