# Configuration

Customize QuickDoc to match your needs and brand.

## Configuration File

All configuration is in `src/config/app.config.ts`:

```typescript
export interface AppConfig {
  navigation: NavigationConfig;
  theme: ThemeConfig;
  content: ContentConfig;
  pagesPath: string;
}
```

## Navigation Settings

### Breaking Point

Control which heading level creates navigation items:

```typescript
navigation: {
  breakingPoint: 'h2', // 'h1' | 'h2' | 'h3' | 'h4'
}
```

**Options:**

- `h1` - Every H1 becomes a nav item
- `h2` - Every H2 becomes a nav item (recommended)
- `h3` - Every H3 becomes a nav item
- `h4` - Every H4 becomes a nav item

### Show H1 in Sidebar

Display the page title (H1) in the sidebar:

```typescript
navigation: {
  showH1InSidebar: true, // true | false
}
```

### Collapsible Sections

Enable collapsible navigation sections:

```typescript
navigation: {
  collapsible: false, // true | false
}
```

## Theme Settings

### Colors

Customize the color scheme:

```typescript
theme: {
  colors: {
    primary: '#111827',        // Main text color
    secondary: '#374151',      // Secondary text
    background: '#ffffff',     // Page background
    backgroundSecondary: '#f9fafb', // Sidebar background
    text: '#111827',          // Text color
    textSecondary: '#6b7280', // Muted text
    border: '#e5e7eb',        // Border color
    accent: '#2563eb',        // Links, active states
  },
}
```

### Fonts

Configure typography:

```typescript
theme: {
  fonts: {
    sans: 'Geist, -apple-system, sans-serif',
    mono: 'Geist Mono, Courier New, monospace',
    size: 'medium', // 'small' | 'medium' | 'large'
  },
}
```

**Font Sizes:**

- `small` - Compact, more content visible
- `medium` - Balanced (default)
- `large` - Larger text, better readability

### Spacing

Control layout density:

```typescript
theme: {
  spacing: {
    compact: false, // true | false
  },
}
```

## Content Settings

### Max Width

Set maximum content width:

```typescript
content: {
  maxWidth: '800px', // Any CSS width value
}
```

**Recommended values:**

- `800px` - Default, good for reading
- `1000px` - Wider, more space
- `100%` - Full width

### Enable MDX

Support React components in markdown:

```typescript
content: {
  enableMDX: true, // true | false
}
```

### Syntax Highlighting

Enable code syntax highlighting:

```typescript
content: {
  syntaxHighlighting: true, // true | false
}
```

### Copy Code Button

Add copy button to code blocks:

```typescript
content: {
  copyCodeButton: true, // true | false
}
```

## Pages Path

Set the folder containing markdown files:

```typescript
pagesPath: '/pages', // Relative to /public
```

## Complete Example

Here's a complete configuration example:

```typescript
export const defaultConfig: AppConfig = {
  navigation: {
    breakingPoint: 'h2',
    showH1InSidebar: true,
    collapsible: false,
  },
  theme: {
    colors: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      background: '#ffffff',
      backgroundSecondary: '#f5f5f5',
      text: '#1a1a1a',
      textSecondary: '#6a6a6a',
      border: '#e0e0e0',
      accent: '#0066cc',
    },
    fonts: {
      sans: 'Inter, -apple-system, sans-serif',
      mono: 'Fira Code, monospace',
      size: 'medium',
    },
    spacing: {
      compact: false,
    },
  },
  content: {
    maxWidth: '900px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
  },
  pagesPath: '/pages',
};
```

## Dark Mode

QuickDoc automatically supports dark mode based on system preferences. Colors are automatically adjusted using Tailwind's dark mode utilities.

## Custom Styling

### Override CSS

Add custom styles in `src/index.css`:

```css
.markdown-content h1 {
  @apply text-5xl font-extrabold;
}

.markdown-content code {
  @apply bg-purple-100 text-purple-900;
}
```

### Custom Components

Create custom components for MDX:

```typescript
// src/components/CustomButton.tsx
export const CustomButton = ({ children }) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded">
    {children}
  </button>
);
```

Use in MDX files:

```mdx
import { CustomButton } from '../components/CustomButton';

# My Page

<CustomButton>Click me!</CustomButton>
```

## Environment Variables

Use environment variables for configuration:

```typescript
// .env
VITE_PAGES_PATH=/docs
VITE_MAX_WIDTH=1000px
```

```typescript
// app.config.ts
export const defaultConfig: AppConfig = {
  pagesPath: import.meta.env.VITE_PAGES_PATH || '/pages',
  content: {
    maxWidth: import.meta.env.VITE_MAX_WIDTH || '800px',
    // ...
  },
};
```

## Best Practices

### Navigation

- Use H2 for main sections (default breaking point)
- Keep section titles concise (< 40 characters)
- Use descriptive, searchable titles

### Theme

- Maintain sufficient color contrast (WCAG AA minimum)
- Test dark mode thoroughly
- Use system fonts for better performance

### Content

- Set appropriate max-width for readability (800-900px)
- Enable syntax highlighting for technical docs
- Use copy buttons for code examples

## Troubleshooting

### Navigation not updating

Check that your heading levels match the `breakingPoint` setting.

### Colors not applying

Ensure you're using valid CSS color values (hex, rgb, hsl).

### MDX not working

Verify `enableMDX: true` and install required dependencies.
