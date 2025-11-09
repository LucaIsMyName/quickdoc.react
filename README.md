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
- 📁 **Auto-Discovery** - Automatically loads all `.md` and `.mdx` files from `/public/pages`
- 📑 **Tab Navigation** - Each markdown file becomes a tab
- 🗂️ **Smart Sidebar** - H2 headings (configurable) become navigation items
- 🔗 **URL Sync** - State syncs with URL and localStorage (URL > localStorage > defaults)
- 📱 **Mobile First** - Fully responsive with smooth mobile experience
- 🎨 **Syntax Highlighting** - Beautiful code blocks with highlight.js
- ⚛️ **MDX Support** - Use React components in your markdown
- ⚙️ **Configurable** - Customize colors, fonts, navigation behavior, and more
- 🌓 **Dark Mode** - Automatic dark mode support
- 🚀 **Fast** - Built with Vite for lightning-fast development

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

1. **Create markdown files** in `/public/pages/`:
   ```bash
   touch public/pages/My-Guide.md
   ```

2. **Write your content**:
   ```markdown
   # My Guide
   
   ## Getting Started
   
   Your content here...
   
   ## Advanced Topics
   
   More content...
   ```

3. **Refresh** - Your new page appears as a tab automatically!

## 📁 Project Structure

```
quickdoc.react/
├── public/
│   └── pages/              # 📝 Your markdown files go here!
│       ├── README.md
│       ├── Quick-Start.md
│       └── Configuration.md
├── src/
│   ├── components/         # React components
│   │   ├── TabNavigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MarkdownContent.tsx
│   │   └── MobileMenuButton.tsx
│   ├── config/
│   │   └── app.config.ts   # ⚙️ Configuration
│   ├── hooks/              # Custom React hooks
│   │   ├── useMarkdownFiles.ts
│   │   └── useAppState.ts
│   ├── utils/              # Utility functions
│   │   ├── markdown.ts
│   │   ├── storage.ts
│   │   └── url.ts
│   ├── types/              # TypeScript types
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
  },
  
  // Theme settings
  theme: {
    colors: {
      primary: '#111827',
      accent: '#2563eb',
      // ... more colors
    },
    fonts: {
      sans: 'Geist, sans-serif',
      mono: 'Geist Mono, monospace',
      size: 'medium',         // 'small' | 'medium' | 'large'
    },
  },
  
  // Content settings
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
  },
  
  pagesPath: '/pages',
};
```

### Key Configuration Options

- **`breakingPoint`** - Which heading level creates sidebar navigation items
- **`fileOrder`** - Custom tab order (array of slugs), defaults to alphabetical
- **`maxWidth`** - Maximum content width for optimal readability
- **`enableMDX`** - Enable React components in markdown
- **`syntaxHighlighting`** - Enable code syntax highlighting
- **`copyCodeButton`** - Add copy buttons to code blocks

### Custom File Ordering

By default, tabs are sorted alphabetically. To customize the order:

```typescript
navigation: {
  breakingPoint: 'h2',
  fileOrder: ['quick-start', 'quickdoc', 'markdown-guide', 'license'],
  // Files not in the list will appear after, sorted alphabetically
}
```

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
- Geist fonts by Vercel

