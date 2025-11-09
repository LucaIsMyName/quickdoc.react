# QuickDoc

Complete developer documentation for customizing and deploying QuickDoc.

## Overview

QuickDoc is a modern, fast, and beautiful documentation framework built with React, TypeScript, and Tailwind CSS. It automatically generates a navigable documentation site from your Markdown files with advanced features like cross-page navigation, hash scrolling, and comprehensive error handling.

### Key Features

- **Automatic Navigation**: Generates sidebar navigation from your Markdown headings
- **Breaking Points**: Split long documents into sub-pages (default: H2 headings)
- **Cross-Page Navigation**: Navigate directly between pages and sections with proper hash scrolling
- **Expandable Sidebar**: Option to keep all sections expanded or collapsed
- **Dark Mode**: Built-in dark mode with localStorage persistence
- **Syntax Highlighting**: Code blocks with copy-to-clipboard functionality and full-width overflow
- **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- **Responsive**: Mobile-first design with collapsible sidebar and overflow protection
- **SEO Optimized**: Dynamic meta tags and document titles
- **Type-Safe**: Full TypeScript support
- **Font System**: System fonts with Google Fonts override capability
- **Configurable Footer**: Optional sidebar footer with title, author, and year

## Configuration

All configuration is managed through `src/config/app.config.ts`.

### Basic Settings

```typescript
export const defaultConfig: AppConfig = {
  // Site metadata
  site: {
    title: 'QuickDoc',
    description: 'Fast and beautiful documentation',
    author: 'Your Name',
    url: 'https://yourdomain.com',
  },
  
  // Navigation settings
  navigation: {
    breakingPoint: 'h2', // h1, h2, h3, or h4
    showH1InSidebar: true,
    collapsible: false,
    expandAllSections: false, // Keep all sidebar sections expanded
    sidebarWidth: {
      default: '280px',
      min: '200px',
      max: '350px',
    },
    enableUserSidebarWidthChange: false,
    pagination: {
      enabled: true,
      showOnTop: false,
      showOnBottom: true,
    },
    fileOrder: ["quick-start", "quickdoc", "markdown-guide", "license"],
    footer: {
      enabled: true,
      title: "QuickDoc.React",
      author: "Your Name", // optional
      showYear: true,
    },
  },
  
  // Content settings
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
    align: 'left', // 'left' | 'center' | 'right'
    spacing: 'normal', // 'compact' | 'normal' | 'relaxed'
  },
  
  // Theme colors and styling
  theme: {
    colors: {
      primary: '#111827',
      secondary: '#374151',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#111827',
      activeBackground: '#f3f4f6',
      activeText: '#111827',
    },
    fonts: {
      // System fonts as fallback
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
      size: "medium", // 'small' | 'medium' | 'large'
      
      // Google Fonts override (optional)
      googleFonts: {
        sans: "Work Sans:300,400,500,600,700",
        mono: "JetBrains Mono:400,500,600,700",
        preconnect: true,
      }
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: "sm", // 'none' | 'sm' | 'md' | 'xl'
      size: 1, // 'none' | 1 | 2 | 3 (also affects inline code borders)
    },
  },
  
  pagesPath: '/pages',
};
```

### Navigation Configuration

#### Expand All Sections

Control whether sidebar sections are always expanded:

```typescript
navigation: {
  expandAllSections: true, // Show all subsections (h3-h6) at all times
}
```

- **`false`** (default): Sections collapse/expand based on current page
- **`true`**: All subsections visible for better navigation overview

#### Sidebar Footer

Add a footer to the sidebar with project info:

```typescript
navigation: {
  footer: {
    enabled: true,
    title: "My Documentation",
    author: "John Doe", // optional
    showYear: true,
  }
}
```

#### File Ordering

Customize the tab order instead of alphabetical:

```typescript
navigation: {
  fileOrder: ["introduction", "getting-started", "api-reference", "examples"]
}
```

### Font System

#### System Fonts (Default)

Uses system fonts for optimal performance and native feel:

```typescript
fonts: {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, Consolas, monospace",
}
```

#### Google Fonts Override

Add Google Fonts while keeping system fonts as fallback:

```typescript
fonts: {
  // System fonts (always present as fallback)
  sans: "system font stack...",
  mono: "system mono stack...",
  
  // Google Fonts (loaded dynamically)
  googleFonts: {
    sans: "Inter:300,400,500,600,700",
    mono: "Fira Code:400,500,600,700",
    preconnect: true, // Performance optimization
  }
}
```

Popular Google Font combinations:
- **Work Sans + JetBrains Mono** (default)
- **Inter + Fira Code**
- **Roboto + Source Code Pro**
- **Poppins + JetBrains Mono**

### Theme Customization

#### Border System

Control borders and inline code styling:

```typescript
border: {
  radius: "md", // Global border radius
  size: 2, // Border thickness (1=light, 2=medium, 3=dark)
}
```

The `size` setting affects:
- Global border thickness
- Inline code border intensity (when enabled)

#### Inline Code Borders

Inline code elements (`<code>` inside paragraphs) get subtle borders based on the `border.size` setting:

- **`size: 1`**: Light gray borders
- **`size: 2`**: Medium gray borders  
- **`size: 3`**: Darker gray borders
- **`size: "none"`**: No borders

### Breaking Points

Breaking points determine how your documentation is split into sub-pages:

- **h1**: Each H1 creates a new page (not recommended for most docs)
- **h2**: Each H2 creates a new page (default, works well for most cases)
- **h3**: Each H3 creates a new page (for very detailed documentation)
- **h4**: Each H4 creates a new page (for extremely granular navigation)

Example with `breakingPoint: 'h2'`:

```markdown
# Main Title (Introduction page)

Content before first H2...

## Section 1 (New page)

Content for section 1...

### Subsection 1.1 (Same page, in sidebar)

Content...

#### Sub-subsection (Same page, in sidebar if expandAllSections: true)

## Section 2 (New page)

Content for section 2...
```

### URL Structure

QuickDoc uses a clear URL structure for navigation:

- **Landing pages**: `domain.com/filename`
- **Subpages**: `domain.com/filename/section-name`  
- **Hash anchors**: `domain.com/filename/section-name#subsection-id`

Examples:
- `/quickdoc` - QuickDoc main page
- `/quickdoc/configuration` - Configuration section
- `/quickdoc/configuration#fonts` - Fonts subsection

## File Structure

```
quickdoc.react/
├── public/
│   └── pages/           # Your Markdown files go here
│       ├── Quick-Start.md
│       ├── QuickDoc.md
│       ├── Markdown-Guide.md
│       └── License.md
├── src/
│   ├── components/      # React components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── config/          # Configuration files
│   │   ├── app.config.ts
│   │   └── example.google-fonts.config.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── useAppState.ts
│   │   ├── useErrorBoundary.ts
│   │   └── ...
│   ├── utils/           # Utility functions
│   │   ├── scrollHash.ts
│   │   ├── fontStyles.ts
│   │   ├── inlineCodeStyles.ts
│   │   └── ...
│   └── types/           # TypeScript types
└── package.json
```

## Adding Documentation Files

### File Naming

- Use descriptive names with hyphens: `Getting-Started.md`, `API-Reference.md`
- Files are sorted by the `fileOrder` config or alphabetically
- The filename becomes the tab title (hyphens converted to spaces)

### File Format

Each Markdown file should start with an H1 heading:

```markdown
# Your Document Title

Introduction content...

## First Section

Section content...

### Subsection

Subsection content...

#### Sub-subsection

More detailed content...
```

## Markdown Features

### Code Blocks

Code blocks support syntax highlighting, copy buttons, and full-width overflow:

````markdown
```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
// Long lines will scroll horizontally instead of wrapping
const veryLongVariableName = "This is a very long line that demonstrates horizontal scrolling in code blocks";
```
````

**Features:**
- ✅ Full width with horizontal scroll
- ✅ Syntax highlighting with highlight.js
- ✅ Copy-to-clipboard buttons
- ✅ Custom scrollbars that match theme
- ✅ No min-width constraints

### Inline Code

Inline `code` elements get subtle borders based on your theme configuration:

```markdown
Use the `useState` hook to manage component state.
Configure the `border.size` setting to control border intensity.
```

### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables  | ✅        | Full responsive support |
| Lists   | ✅        | Nested lists supported |
| Images  | ✅        | Auto-responsive |
| Links   | ✅        | Internal and external |

### Blockquotes

> This is a blockquote.
> It can span multiple lines and supports **formatting**.

### Lists

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item

### Links

```markdown
[External link](https://example.com)
[Internal page link](/quickdoc/configuration)
[Anchor link](#section-name)
[Cross-page anchor](/quickdoc/configuration#fonts)
```

## Error Handling

QuickDoc includes comprehensive error boundaries:

### Error Boundary Features

- **Graceful fallbacks**: App continues working even if components fail
- **User-friendly messages**: Clear error messages with recovery options
- **Development details**: Full error stack traces in development mode
- **Component isolation**: Errors in one component don't crash the entire app
- **Recovery options**: "Try Again" and "Go Home" buttons

### Error Boundary Locations

- Top-level app wrapper
- Individual components (Sidebar, Content, Pagination, etc.)
- Search dialog and navigation components

### Custom Error Handling

Use the error boundary hooks for custom error handling:

```typescript
import { useErrorBoundary, useAsyncError } from './hooks/useErrorBoundary';

// Manual error triggering
const { throwError } = useErrorBoundary();

// Async error handling
const { catchAsync } = useAsyncError();
```

## Navigation System

### Cross-Page Navigation

Navigate between any page and section using the sidebar:

- **Same page navigation**: Smooth scroll to sections
- **Cross-page navigation**: Load new page and scroll to section
- **Hash preservation**: URLs maintain hash anchors for bookmarking

### Hash Scrolling

Automatic scrolling to hash anchors:

- **Initial load**: Scrolls to hash on page load
- **Route changes**: Scrolls to hash after navigation
- **Hash-only changes**: Smooth scroll within same page
- **Header offset**: Accounts for sticky header height

### URL Synchronization

- **Browser history**: Back/forward buttons work correctly
- **Bookmarkable**: All sections have unique URLs
- **Shareable**: Direct links to specific content
- **SEO friendly**: Search engines can index specific sections

## Deployment

### Build

Create a production build:

```bash
npm run build
```

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

1. Update `vite.config.ts` with your base path:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

2. Build and deploy:

```bash
npm run build
npx gh-pages -d dist
```

## Development

### Project Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm test            # Run tests
npm run lint        # Run ESLint
```

### Tech Stack

- **React 18**: UI framework with hooks and error boundaries
- **TypeScript 5**: Type safety and modern JavaScript features
- **Vite 5**: Build tool and dev server with HMR
- **Tailwind CSS 3**: Utility-first styling with dark mode
- **React Router 6**: Client-side routing with hash support
- **marked**: Markdown parsing with extensions
- **highlight.js**: Syntax highlighting for code blocks
- **React Helmet Async**: SEO and meta tag management

## Troubleshooting

### Dark Mode Not Working

Make sure `darkMode: 'class'` is set in `tailwind.config.js`:

```javascript
export default {
  darkMode: 'class',
  // ...
}
```

### Navigation Not Updating

Clear your browser's localStorage:

```javascript
localStorage.clear();
```

Then refresh the page.

### Hash Navigation Not Working

Check that:
1. Elements have proper IDs
2. React Router is properly configured
3. No JavaScript errors in console

### Font Loading Issues

For Google Fonts problems:
1. Check network connectivity
2. Verify font names and weights
3. Check browser console for CORS errors
4. Ensure `preconnect: true` is set

### Code Block Overflow

If code blocks don't scroll properly:
1. Check CSS for conflicting styles
2. Verify Tailwind prose overrides are applied
3. Ensure container has proper width constraints

### Build Errors

1. Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. Run type check:

```bash
npm run type-check
```

3. Check for missing dependencies:

```bash
npm audit
```

### Error Boundary Issues

If error boundaries aren't catching errors:
1. Check that errors occur during render
2. Verify error boundaries are properly placed
3. Use error boundary hooks for async errors

## Performance

### Optimization Tips

- **Font loading**: Use system fonts for best performance
- **Code splitting**: Consider dynamic imports for large components
- **Image optimization**: Use appropriate image formats and sizes
- **Bundle analysis**: Use `npm run build` to check bundle sizes

### Bundle Size

Current bundle sizes (gzipped):
- **CSS**: ~6.7KB
- **JavaScript**: ~412KB (includes React, Router, highlight.js)
- **Individual pages**: ~1-3KB each

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests: `npm test`
6. Update documentation
7. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add error boundaries for new components
- Update configuration interfaces for new options
- Test cross-page navigation scenarios
- Ensure mobile responsiveness

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/quickdoc.react/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/quickdoc.react/discussions)
- **Documentation**: This QuickDoc instance serves as living documentation
