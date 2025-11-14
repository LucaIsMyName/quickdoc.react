# Configuration

All configuration is managed through `src/config/app.config.ts`.

## Basic Settings

```typescript
export const defaultConfig: AppConfig = {
  // Site metadata
  site: {
    title: 'QuickDoc',
    description: 'Fast and beautiful documentation',
    author: 'Your Name',
    url: 'https://yourdomain.com',
    language: 'en',        // Language code for SEO (en, de, fr, etc.)
    indexable: true,       // Allow search engines to index (true/false)
  },
  
  // Navigation settings
  navigation: {
    breakingPoint: 'h2', // buggy, dont change for now
    showH1InSidebar: false, // Hide H1 headings in sidebar
    collapsible: false,
    expandAllSections: true, // Keep all sidebar sections expanded by default
    enableNumberedSidebar: true, // Enable hierarchical numbering (1., 1.1., 1.2.)
    enableUserSidebarWidthChange: true, // Allow users to resize sidebar
    sidebarWidth: {
      min: "200px",
      default: "280px", 
      max: "350px"
    },
    pagination: {
      enabled: false,
      showOnTop: false,
      showOnBottom: true
    },
    fileOrder: ["quickstart", "quickdoc", "markdown-guide", "license", "changelog"]
  }
}
```

## Advanced Configuration

### Theme Settings

Configure colors, fonts, and visual appearance with the new simplified color system:

```typescript
theme: {
  // New simplified color system using Tailwind color names
  colors: {
    accent: "sky",    // Accent color for links, buttons, active states
    light: "gray",    // Light theme base color
    dark: "gray"      // Dark theme base color
  },
  
  // Font configuration
  fonts: {
    sans: "system-ui, -apple-system, sans-serif",
    mono: "Monaco, Consolas, monospace",
    size: "medium", // "small" | "medium" | "large"
    googleFonts: {
      sans: "Inter:400,500,600,700",
      mono: "JetBrains Mono:400,500,600,700",
      preconnect: true
    }
  },
  
  // Border and spacing
  border: {
    radius: "sm", // "none" | "sm" | "md" | "lg"
    size: 1       // "none" | 1 | 2 | 3
  },
  
  spacing: {
    compact: false
  },
  
  isSidebarTransparent: false
}
```

### Content Settings

```typescript
content: {
  maxWidth: "800px",            // The Max-Width of the MD(X) content, any valid CSS value
  enableMDX: true,              // Enable MDX support
  syntaxHighlighting: true,     // Code syntax highlighting
  copyCodeButton: true,         // Copy buttons on code blocks
  align: "left",                // "left" | "center" | "right"
  spacing: "normal"             // "compact" | "normal" | "relaxed"
}
```

### Search Configuration

```typescript
search: {
  enableFuzzySearch: false  // Enable fuzzy search with typo tolerance
}
```

**Search Features:**
- **Weighted results**: H1 matches weighted 6x, H2-H6 progressively lower, content 0.5x
- **Smart highlighting**: Matches shown in accent color with bold weight
- **Keyboard shortcut**: Cmd+K / Ctrl+K to open search
- **No duplicate text**: Title matches appear in heading only, not repeated below

## Color System

The new simplified color system uses Tailwind color names:

- **Available colors**: `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`
- **Automatic weight mapping**: Light/dark backgrounds and text colors are automatically calculated
- **Theme-aware components**: All UI elements including code blocks, copy buttons, and borders respect the theme

## SEO Configuration

### Language Setting
- **Purpose**: Sets the HTML `lang` attribute and language meta tags
- **Format**: ISO 639-1 language codes (e.g., `en`, `de`, `fr`, `es`, `ja`)
- **Impact**: Improves accessibility and search engine understanding

### Indexability Control
- **`indexable: true`**: Allows search engines to index your documentation
  - Sets `robots` meta tag to `"index, follow"`
  - Recommended for public documentation
- **`indexable: false`**: Prevents search engine indexing
  - Sets `robots` meta tag to `"noindex, nofollow"`
  - Useful for internal/private documentation

### SEO Features
- **Dynamic meta tags**: Title, description, author automatically set
- **Open Graph tags**: Social media preview support
- **Twitter Card tags**: Enhanced Twitter sharing
- **Canonical URLs**: Proper URL canonicalization
- **Language declaration**: HTML lang attribute for accessibility

## Navigation Options

- **Breaking Points**: Control how content is split into pages
- **Numbered Sidebar**: Hierarchical numbering system (1., 1.1., 1.2.)
- **Resizable Sidebar**: Users can adjust sidebar width within configured limits
- **File Ordering**: Custom order for navigation items
- **Pagination**: Optional pagination controls
