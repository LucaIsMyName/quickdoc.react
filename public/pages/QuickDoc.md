# QuickDoc

Complete developer documentation for customizing and deploying QuickDoc.

## Overview

QuickDoc is a modern, fast, and beautiful documentation framework built with React, TypeScript, and Tailwind CSS. It automatically generates a navigable documentation site from your Markdown files.

### Key Features

- **Automatic Navigation**: Generates sidebar navigation from your Markdown headings
- **Breaking Points**: Split long documents into sub-pages (default: H2 headings)
- **Dark Mode**: Built-in dark mode with localStorage persistence
- **Syntax Highlighting**: Code blocks with copy-to-clipboard functionality
- **Responsive**: Mobile-first design with collapsible sidebar
- **SEO Optimized**: Dynamic meta tags and document titles
- **Type-Safe**: Full TypeScript support

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
    sidebarWidth: {
      default: '280px',
      min: '200px',
      max: '400px',
    },
  },
  
  // Content settings
  content: {
    maxWidth: '800px',
    syntaxHighlighting: true,
    copyCodeButton: true,
  },
  
  // Theme colors
  theme: {
    colors: {
      primary: '#111827',
      accent: '#111827',
      activeBackground: '#f3f4f6',
      activeText: '#111827',
      // ... more colors
    },
  },
};
```

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

## Section 2 (New page)

Content for section 2...
```

### Theme Customization

#### Colors

Customize the color scheme in `app.config.ts`:

```typescript
theme: {
  colors: {
    primary: '#111827',        // Main text color
    secondary: '#374151',      // Secondary text
    background: '#ffffff',     // Page background
    accent: '#111827',         // Accent color
    activeBackground: '#f3f4f6', // Active nav item background
    activeText: '#111827',     // Active nav item text
  }
}
```

#### Fonts

Change the font family:

```typescript
theme: {
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, monospace',
    size: 'medium', // 'small' | 'medium' | 'large'
  }
}
```

#### Spacing

Adjust content density:

```typescript
theme: {
  spacing: {
    compact: false, // Set to true for tighter spacing
  }
}
```

## File Structure

```
quickdoc.react/
├── public/
│   └── pages/           # Your Markdown files go here
│       ├── Quick-Start.md
│       ├── QuickDoc.md
│       └── ...
├── src/
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   │   └── app.config.ts
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
└── package.json
```

## Adding Documentation Files

### File Naming

- Use descriptive names with hyphens: `Getting-Started.md`, `API-Reference.md`
- Files are automatically sorted alphabetically in the tab navigation
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
```

## Markdown Features

### Code Blocks

Code blocks support syntax highlighting and copy buttons:

````markdown
```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```
````

### Tables

```markdown
| Feature | Supported |
|---------|-----------|
| Tables  | ✅        |
| Lists   | ✅        |
| Images  | ✅        |
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### Lists

```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
```

### Links

```markdown
[External link](https://example.com)
[Anchor link](#section-name)
```

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

- **React 18**: UI framework
- **TypeScript 5**: Type safety
- **Vite 5**: Build tool and dev server
- **Tailwind CSS 3**: Styling
- **React Router 6**: Client-side routing
- **marked**: Markdown parsing
- **highlight.js**: Syntax highlighting
- **Vitest**: Testing framework

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

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/quickdoc.react/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/quickdoc.react/discussions)
