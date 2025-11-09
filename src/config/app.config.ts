export interface AppConfig {
  // Navigation settings
  navigation: {
    breakingPoint: "h1" | "h2" | "h3" | "h4";
    showH1InSidebar: boolean;
    collapsible: boolean;
    sidebarWidth: {
      min: string;
      default: string;
      max: string;
    };
    fileOrder?: string[]; // Optional: Custom file order by slug
  };

  // Style tokens
  theme: {
    colors: {
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
    fonts: {
      sans: string;
      mono: string;
      size: "small" | "medium" | "large";
    };
    spacing: {
      compact: boolean;
    };
    border: {
      radius: "none" | "sm" | "md" | "xl";
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

  // Pages folder path (relative to public)
  pagesPath: string;
}

export const defaultConfig: AppConfig = {
  navigation: {
    breakingPoint: "h2",
    showH1InSidebar: true,
    collapsible: false,
    sidebarWidth: {
      min: "200px",
      default: "280px",
      max: "400px",
    },
    // Optional: Specify custom file order (by slug)
    // If not specified, files are sorted alphabetically
    // Example: fileOrder: ['quick-start', 'quickdoc', 'markdown-guide', 'license']
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
    fonts: {
      sans: "Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      mono: "Geist Mono, Courier New, monospace",
      size: "medium",
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: "md",
      size: "none",
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
  pagesPath: "/pages",
};
