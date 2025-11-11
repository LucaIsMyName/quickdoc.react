# QuickDoc.React

A modern, fast, and beautiful documentation framework built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Automatic Navigation**: Generates sidebar navigation from Markdown headings
- **Breaking Points**: Split long documents into sub-pages (default: H2 headings)
- **Dark Mode**: Built-in dark mode with localStorage persistence
- **Syntax Highlighting**: Code blocks with copy-to-clipboard functionality
- **Responsive Design**: Mobile-first with collapsible sidebar
- **SEO Optimized**: Dynamic meta tags and document titles
- **Type-Safe**: Full TypeScript support
- **Custom File Ordering**: Configure tab order via `app.config.ts`
- **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- 📁 **Auto-Discovery** - Automatically loads all `.md` and `.mdx` files from `/public/pages`
- 📑 **Tab Navigation** - Each markdown file becomes a tab
- 🗂️ **Smart Sidebar** - H2 headings (configurable) become navigation items
- 🔗 **URL Sync** - State syncs with URL and localStorage (URL > localStorage > defaults)
- 📱 **Mobile First** - Fully responsive with smooth mobile experience
- 🎨 **Syntax Highlighting** - Beautiful code blocks with highlight.js and horizontal scroll
- ⚛️ **MDX Support** - Use React components in your markdown
- ⚙️ **Configurable** - Customize colors, fonts, navigation behavior, and more
- 🌓 **Dark Mode** - Automatic dark mode support
- 🚀 **Fast** - Built with Vite for lightning-fast development
- 🛡️ **Error Resilient** - Multiple error boundaries prevent crashes

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` and you'll see the documentation site with example pages!

### Adding Your Documentation

1. **Create markdown or MDX files** in `/src/pages/`:
   ```bash
   # Markdown file
   touch src/pages/My-Guide.md
   
   # Or MDX file with React components
   touch src/pages/Interactive-Demo.mdx
   ```

2. **Write your content**:
   
   **Markdown (.md):**
   ```markdown
   # My Guide
   
   ## Getting Started
   
   Your content here...
   
   ## Advanced Topics
   
   More content...
   ```
   
   **MDX (.mdx) with React components:**
   ```mdx
   import React from 'react';
   
   # Interactive Demo
   
   ## Counter Example
   
   export const Counter = () => {
     const [count, setCount] = React.useState(0);
     return (
       <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount(count + 1)}>Increment</button>
       </div>
     );
   };
   
   <Counter />
   ```

3. **Refresh** - Your new page appears as a tab automatically!

## 📁 Project Structure

```
quickdoc.react/
├── src/
│   ├── pages/              # 📝 Your markdown/MDX files go here!
│   │   ├── Quick-Start.md
│   │   ├── QuickDoc.md
│   │   ├── Markdown-Guide.md
│   │   └── MDX-Example.mdx  # Example with React components
│   ├── components/         # React components
│   │   ├── TabNavigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MarkdownContent.tsx
│   │   ├── MDXProvider.tsx  # MDX component provider
│   │   └── MobileMenuButton.tsx
│   ├── config/
│   │   └── app.config.ts   # ⚙️ Configuration
│   ├── hooks/              # Custom React hooks
│   │   ├── useMarkdownFiles.ts
│   │   └── useAppState.ts
│   ├── utils/              # Utility functions
│   │   ├── markdown.ts
│   │   ├── contentSplitter.ts
│   │   ├── storage.ts
│   │   └── url.ts
│   ├── types/              # TypeScript types
│   ├── mdx.d.ts            # MDX type declarations
│   ├── App.tsx             # Main app
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── __tests__/              # Tests
└── package.json
```

## ⚙️ Configuration

Edit `src/config/app.config.ts` to customize QuickDoc:

```typescript
export const defaultConfig: AppConfig = {
  // Navigation settings
  navigation: {
    breakingPoint: 'h2',      // 'h1' | 'h2' | 'h3' | 'h4'
    showH1InSidebar: true,
    collapsible: false,
    sidebarWidth: { min: '200px', default: '280px', max: '400px' },
    enableUserSidebarWidthChange: false,  // Allow users to resize sidebar
    pagination: {
      enabled: false,         // Enable pagination between sections
      showOnTop: true,        // Show pagination at top of content
      showOnBottom: true,     // Show pagination at bottom of content
    },
  },
  
  // Theme settings
  theme: {
    colors: {
      primary: '#111827',
      accent: '#2563eb',
      // ... more colors
    },
    fonts: {
      // System fonts (fallback) - optimized for each platform
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"SF Mono", "Monaco", "Consolas", monospace',
      size: 'medium',         // 'small' | 'medium' | 'large'
      
      // Google Fonts (default: Work Sans + JetBrains Mono)
      googleFonts: {
        sans: 'Work Sans:300,400,500,600,700',       // Professional, clean sans-serif
        mono: 'JetBrains Mono:400,500,600,700',      // Developer-friendly monospace
        preconnect: true                             // Add preconnect links for performance
      }
    },
    spacing: {
      compact: false,
    },
    border: {
      radius: 'md',        // 'none' | 'sm' | 'md' | 'xl'
      size: 1,             // 'none' | 1 | 2 | 3
    },
  },
  
  // Content settings
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
    align: 'left',           // 'left' | 'center' | 'right' (desktop only)
    spacing: 'normal',        // 'compact' | 'normal' | 'relaxed'
  },
  
  pagesPath: '/pages',
};
```

### Key Configuration Options

- **`breakingPoint`** - Which heading level creates sidebar navigation items
- **`expandAllSections`** - Keep all sidebar subsections (h2-h6) expanded at all times (default: false)
- **`fileOrder`** - Custom tab order (array of slugs), defaults to alphabetical
- **`maxWidth`** - Maximum content width for optimal readability
- **`enableMDX`** - Enable React components in markdown
- **`syntaxHighlighting`** - Enable code syntax highlighting
- **`copyCodeButton`** - Add copy buttons to code blocks
- **`align`** - Content alignment for desktop only (`left`, `center`, `right`)
- **`spacing`** - Content spacing (`compact`, `normal`, `relaxed`)
- **`border.radius`** - Global border radius (`none`, `sm`, `md`, `xl`)
- **`border.size`** - Border thickness (`none`, `1`, `2`, `3`) - also affects inline code borders
- **`enableUserSidebarWidthChange`** - Allow users to resize sidebar (`true`, `false`)
- **`enableNumberedSidebar`** - Enable hierarchical numbering for sidebar items (`true`, `false`)
- **`pagination.enabled`** - Enable pagination between sections (`true`, `false`)
- **`pagination.showOnTop`** - Show pagination at top of content (`true`, `false`)
- **`pagination.showOnBottom`** - Show pagination at bottom of content (`true`, `false`)

### Custom File Ordering

By default, tabs are sorted alphabetically. To customize the order:

```typescript
navigation: {
  breakingPoint: 'h2',
  fileOrder: ['quick-start', 'quickdoc', 'markdown-guide', 'license'],
  // Files not in the list will appear after, sorted alphabetically
}
```

### Numbered Sidebar

Enable hierarchical numbering for sidebar navigation items:

```typescript
navigation: {
  enableNumberedSidebar: true, // Enable numbered sidebar items
  breakingPoint: 'h2',        // Start numbering from this level
}
```

**Numbering Examples:**

- **Breaking point `h2`** (default):
  ```
  1. First Section
     1.1. First Subsection
     1.2. Second Subsection
  2. Second Section
     2.1. Another Subsection
  ```

- **Breaking point `h1`**:
  ```
  1. Document Title
  2. First Section
     2.1. First Subsection
     2.2. Second Subsection
  3. Second Section
     3.1. Another Subsection
  ```

The numbering automatically adapts to your breaking point configuration and supports up to 4 levels deep (e.g., `2.3.4.1.`).

## 📝 Writing Documentation

### File Naming

- Use descriptive names: `Getting-Started.md` not `page1.md`
- Hyphens become spaces in tabs: `Quick-Start.md` → "Quick Start"
- Files are sorted alphabetically

### Markdown Structure

```markdown
# Page Title

This becomes the tab title.

## Section 1

This becomes a sidebar navigation item (default).

### Subsection

Regular content.

## Section 2

Another sidebar item.
```

### Code Blocks

Use triple backticks with language for syntax highlighting:

````markdown
```typescript
const hello = (name: string) => {
  console.log(`Hello, ${name}!`);
};
```
````

### Internal Links

Link to sections:
```markdown
[Go to Installation](#installation)
```

Link to other pages:
```markdown
[See Quick Start](/#quick-start)
```

## ⚛️ MDX Support

MDX allows you to use React components directly in your documentation. This enables interactive examples, custom UI components, and dynamic content.

### Enabling MDX

MDX is enabled by default. To disable it:

```typescript
// src/config/app.config.ts
content: {
  enableMDX: false,  // Disable MDX support
}
```

### Creating MDX Files

1. **Create an `.mdx` file** in `src/pages/`:
   ```bash
   touch src/pages/Interactive-Guide.mdx
   ```

2. **Import React** at the top:
   ```mdx
   import React from 'react';
   ```

3. **Write markdown** as usual:
   ```mdx
   # My Interactive Guide
   
   This is regular markdown content.
   ```

4. **Add React components**:
   ```mdx
   export const MyButton = () => {
     const [clicked, setClicked] = React.useState(false);
     return (
       <button onClick={() => setClicked(true)}>
         {clicked ? 'Clicked!' : 'Click me'}
       </button>
     );
   };
   
   <MyButton />
   ```

### MDX Features

- **Inline Components**: Define and use React components directly in your docs
- **Import External Components**: Import components from your codebase
- **Full JSX Support**: Use any valid JSX syntax
- **Consistent Styling**: Components automatically match your theme
- **Code Highlighting**: Code blocks work the same as in Markdown

### MDX Example

See `src/pages/MDX-Example.mdx` for a complete example with:
- Interactive counter component
- Custom alert components
- Styled inline components
- Mixed markdown and JSX content

### MDX vs Markdown

| Feature | Markdown (.md) | MDX (.mdx) |
|---------|---------------|------------|
| Static content | ✅ | ✅ |
| Code blocks | ✅ | ✅ |
| React components | ❌ | ✅ |
| Interactive demos | ❌ | ✅ |
| Import statements | ❌ | ✅ |
| JSX syntax | ❌ | ✅ |

**When to use MDX:**
- Interactive tutorials
- Live code examples
- Custom UI components
- Data visualizations
- Dynamic content

**When to use Markdown:**
- Static documentation
- Simple guides
- API references
- Changelogs

## 🎨 Styling

### Custom CSS

Add custom styles in `src/index.css`:

```css
.markdown-content h1 {
  @apply text-5xl font-extrabold;
}

.markdown-content code {
  @apply bg-purple-100 text-purple-900;
}
```

### Theme Colors

Customize colors in `app.config.ts`:

```typescript
theme: {
  colors: {
    primary: '#1a1a1a',
    accent: '#0066cc',
    background: '#ffffff',
    // ...
  },
}
```

## 📱 Mobile Experience

- Fully responsive design
- Floating menu button (bottom-left)
- Smooth scrolling
- Touch-friendly navigation
- Optimized for all screen sizes

## 🔗 URL & State Management

### Priority System

1. **URL** - `#filename/section` (highest priority)
2. **localStorage** - Persisted state
3. **Defaults** - First file, no section

### URL Format

- File only: `#readme`
- File + section: `#quick-start/installation`
- Shareable links maintain state

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type check
npm run type-check
```

## 🚢 Deployment

### Build

```bash
npm run build
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 📚 Tech Stack

- **Build Tool**: Vite 5
- **Framework**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **Markdown**: marked
- **MDX**: @mdx-js/rollup + @mdx-js/react
- **Syntax Highlighting**: highlight.js
- **Testing**: Vitest + React Testing Library
- **Fonts**: Geist & Geist Mono

## 🎯 Use Cases

- **Project Documentation** - Document your code projects
- **API Documentation** - Create API references
- **Knowledge Base** - Build internal wikis
- **Guides & Tutorials** - Write step-by-step guides
- **Product Docs** - Document your products

## 💡 Tips

1. **Keep sections focused** - Each H2 should be a distinct topic
2. **Use descriptive titles** - Make navigation clear
3. **Add code examples** - Show, don't just tell
4. **Test on mobile** - Ensure good mobile experience
5. **Use consistent naming** - Follow a naming convention

## 🤝 Contributing

Contributions are welcome! This is a template/framework you can customize for your needs.

## 📄 License

MIT

## 🙏 Acknowledgments

- Inspired by modern documentation sites
- Built with amazing open-source tools
- System fonts for optimal performance and native feel

