import type { TailwindColorName } from "../utils/colorStyles";

export interface AppConfig {
  // Site metadata
  site: {
    title: string;
    description: string;
    author: string;
    url: string;
    language?: string;
    indexable?: boolean;
  };

  // Navigation settings
  navigation: {
    showH1InSidebar: boolean;
    collapsible: boolean;
    expandAllSections: boolean; // Keep all sidebar sections expanded (h2-h6)
    sidebarWidth: {
      min: string;
      default: string;
      max: string;
    };
    enableUserSidebarWidthChange: boolean;
    enableNumberedSidebar: boolean;
    pagination: {
      enabled: boolean;
      showOnTop: boolean;
      showOnBottom: boolean;
    };
    fileOrder?: string[]; // Optional: Custom file order by slug
  };

  // Style tokens
  theme: {
    colors: // New simplified color system
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
    maxWidth: string; // Any valid CSS max-width value: "800px", "100%", "80rem", "none", etc.
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
    title: "QuickDoc",
    description: "Fast and beautiful documentation",
    author: "LucaIsMyName",
    url: "https://lucamack.at",
    language: "en",
    indexable: false,
  },
  search: {
    enableFuzzySearch: false, // Default to plain search
  },
  pagesPath: "/pages",
  navigation: {
    showH1InSidebar: true, // deprecated
    collapsible: false, // depracated
    expandAllSections: false, // Keep all sidebar sections collapsed by default
    sidebarWidth: {
      min: "160px",
      default: "280px",
      max: "480px",
    },
    enableUserSidebarWidthChange: true,
    enableNumberedSidebar: false, // Enable numbered sidebar items
    pagination: {
      enabled: false,
      showOnTop: false,
      showOnBottom: true,
    },
    fileOrder: [
      //
      "quickstart",
      "quickdoc",
      "markdown-guide",
      "changelog",
      "license",
    ],
  },
  theme: {
    isSidebarTransparent: false,
    colors: {
      accent: "teal",
      light: "slate",
      dark: "slate",
    },
    fonts: {
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      mono: "'Geist Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
      size: "medium",
      // Google Fonts: Work Sans + JetBrains Mono
      googleFonts: {
        // sans: "Work Sans:300,400,500,600,700",
        mono: "Geist Mono:400,500,600,700",
        preconnect: true,
      },
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: "sm",
      size: 1,
    },
  },
  content: {
    maxWidth: "768px",
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
    align: "left",
    spacing: "normal",
  },
};
