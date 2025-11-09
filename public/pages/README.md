# QuickDoc

Welcome to QuickDoc - a modern, fast, and beautiful Markdown-based documentation framework built with React, TypeScript, and Tailwind CSS.

## Features

QuickDoc provides everything you need to create beautiful documentation:

- **Auto-discovery** - Automatically loads all `.md` and `.mdx` files from the pages folder
- **Tab Navigation** - Each file becomes a tab for easy switching
- **Smart Sidebar** - H2 headings (configurable) become navigation items
- **URL Sync** - State syncs with URL and localStorage (URL > localStorage > defaults)
- **Mobile First** - Fully responsive with smooth mobile experience
- **Syntax Highlighting** - Beautiful code blocks with highlight.js
- **MDX Support** - Use React components in your markdown
- **Configurable** - Customize colors, fonts, navigation behavior, and more

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Adding Documentation

1. Create `.md` or `.mdx` files in `/public/pages/`
2. Files are automatically discovered and added as tabs
3. The first H1 becomes the tab title
4. H2 headings become sidebar navigation items

### Configuration

Edit `src/config/app.config.ts` to customize:

```typescript
export const defaultConfig: AppConfig = {
  navigation: {
    breakingPoint: 'h2', // h1, h2, h3, or h4
    showH1InSidebar: true,
    collapsible: false,
  },
  theme: {
    colors: { /* ... */ },
    fonts: { /* ... */ },
  },
  content: {
    maxWidth: '800px',
    enableMDX: true,
    syntaxHighlighting: true,
    copyCodeButton: true,
  },
};
```

## Code Examples

### JavaScript

```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

greet('World');
```

### TypeScript

```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

## Lists

### Unordered List

- First item
- Second item
- Third item
  - Nested item
  - Another nested item

### Ordered List

1. First step
2. Second step
3. Third step

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown | Full markdown support | ✅ |
| MDX | React components in markdown | ✅ |
| Syntax Highlighting | Code blocks with highlighting | ✅ |
| Mobile Responsive | Works great on mobile | ✅ |

## Blockquotes

> This is a blockquote. It can contain **bold text**, *italic text*, and even `code`.
>
> Multiple paragraphs are supported too!

## Links

Check out the [Quick Start](/#quick-start) guide to get started quickly.

Visit [GitHub](https://github.com) for more information.

## Images

You can add images using standard markdown syntax:

```markdown
![Alt text](/path/to/image.png)
```

## Horizontal Rules

---

## Next Steps

Check out the other tabs to learn more about QuickDoc's features and configuration options!
