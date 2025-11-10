import type { TailwindColorName } from '../utils/colorStyles';

export interface AppConfig {
  // Site metadata
  site: {
    title: string;
    description: string;
    author: string;
    url: string;
  };

  // Navigation settings
  navigation: {
    breakingPoint: "h1" | "h2" | "h3" | "h4";
    showH1InSidebar: boolean;
    collapsible: boolean;
    expandAllSections: boolean; // Keep all sidebar sections expanded (h2-h6)
    sidebarWidth: {
      min: string;
      default: string;
      max: string;
    };
    enableUserSidebarWidthChange: boolean;
    pagination: {
      enabled: boolean;
      showOnTop: boolean;
      showOnBottom: boolean;
    };
    fileOrder?: string[]; // Optional: Custom file order by slug
  };

  // Style tokens
  theme: {
    colors: 
      // New simplified color system
      | {
          accent: TailwindColorName;
          light: TailwindColorName;
          dark: TailwindColorName;
        }
      // Legacy color system (for backward compatibility)
      | {
          primary: string;
          secondary: string;
          background: string;
          backgroundSecondary: string;
          text: string;
          textSecondary: string;
          border: string;
          accent: string;
          activeBackground: string;
          activeText: string;
        };
    isSidebarTransparent: boolean;
    fonts: {
      sans: string;
      mono: string;
      size: "small" | "medium" | "large";
      // Optional: Override with Google Fonts
      googleFonts?: {
        sans?: string; // e.g., "Inter:400,500,600,700"
        mono?: string; // e.g., "JetBrains Mono:400,500,600,700"
        preconnect?: boolean; // Auto-add preconnect links
      };
    };
    spacing: {
      compact: boolean;
    };
    border: {
      radius: "none" | "sm" | "md" | "lg";
      size: "none" | 1 | 2 | 3;
    };
  };

  // Content settings
  content: {
    maxWidth: string;
    enableMDX: boolean;
    syntaxHighlighting: boolean;
    copyCodeButton: boolean;
    align: "left" | "center" | "right";
    spacing: "compact" | "normal" | "relaxed";
  };

  // Search configuration
  search: {
    enableFuzzySearch: boolean;
  };

  // Pages folder path (relative to public)
  pagesPath: string;
}

export const defaultConfig: AppConfig = {
  site: {
    title: 'QuickDoc',
    description: 'Fast and beautiful documentation',
    author: 'Your Name',
    url: 'https://lucamack.at',
  },
  navigation: {
    breakingPoint: "h2",
    showH1InSidebar: false,
    collapsible: false,
    expandAllSections: false, // Keep all sidebar sections collapsed by default
    sidebarWidth: {
      min: "200px",
      default: "280px",
      max: "350px",
    },
    enableUserSidebarWidthChange: true,
    pagination: {
      enabled: false,
      showOnTop: false,
      showOnBottom: true,
    },
    // Optional: Specify custom file order (by slug)
    // If not specified, files are sorted alphabetically
    // Example: fileOrder: ['quick-start', 'quickdoc', 'markdown-guide', 'license']
    fileOrder: ["quick-start", "quickdoc", "markdown-guide", "license", "changelog"],
  },
  theme: {
    colors: {
      accent: "blue",
      light: "gray",
      dark: "gray",
    },
    isSidebarTransparent: false,
    // Legacy colors (commented out, will be automatically migrated)
    // colors: {
    //   primary: "#111827",
    //   secondary: "#374151",
    //   background: "#ffffff",
    //   backgroundSecondary: "#f9fafb",
    //   text: "#111827",
    //   textSecondary: "#6b7280",
    //   border: "#e5e7eb",
    //   accent: "#111827",
    //   activeBackground: "#f3f4f6",
    //   activeText: "#111827",
    // },
    fonts: {
      sans: "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
      size: "medium",
      // Google Fonts: Work Sans + JetBrains Mono
      // googleFonts: {
      //   sans: "Work Sans:300,400,500,600,700",
      //   mono: "JetBrains Mono:400,500,600,700",
      //   preconnect: true,
      // },
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: "none",
      size: 1,
    },
  },
  content: {
    maxWidth: "800px",
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
    align: "left",
    spacing: "compact",
  },
  search: {
    enableFuzzySearch: false, // Default to plain search
  },
  pagesPath: "/pages",
};
