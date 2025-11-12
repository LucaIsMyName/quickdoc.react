# Quick Start

Get up and running with QuickDoc in minutes and start creating beautiful, interactive documentation.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/quickdoc.react.git
cd quickdoc.react
npm install
```

## Start Development Server

Run the development server to see QuickDoc in action:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see your documentation site with:
- ✅ **Floating toolbar** with export, search, and theme controls
- ✅ **Hierarchical numbered sidebar** navigation
- ✅ **Theme-aware code blocks** with copy buttons
- ✅ **Enhanced search** with fuzzy matching
- ✅ **Dark/light mode** toggle

## Add Your Documentation

Create Markdown or MDX files in the `src/pages/` directory:

### Basic Markdown
```bash
# Create a new documentation section
mkdir src/pages/my-docs
echo "# My Documentation

Welcome to my documentation!" > src/pages/my-docs/index.md
```

### Interactive MDX
```bash
# Create interactive documentation with React components
echo "import React from 'react';

# Interactive Guide

<Counter />

export const Counter = () => {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
};" > src/pages/my-docs/interactive.mdx
```

## Customize Your Site

Edit `src/config/app.config.ts` to personalize your documentation:

### Basic Configuration
```typescript
export const defaultConfig: AppConfig = {
  site: {
    title: 'My Documentation',
    description: 'Comprehensive project documentation',
    author: 'Your Name',
    url: 'https://yourdomain.com',
  },
  
  // Choose your theme colors
  theme: {
    colors: {
      accent: "emerald",  // or "blue", "purple", "red", etc.
      light: "gray",      // Base color for light mode
      dark: "slate"       // Base color for dark mode
    }
  }
}
```

### Advanced Features
```typescript
navigation: {
  enableNumberedSidebar: true,        // 1., 1.1., 1.2. numbering
  enableUserSidebarWidthChange: true, // Resizable sidebar
  breakingPoint: "h2",                // Split content at H2 headings
  expandAllSections: false            // Start with collapsed sections
},

search: {
  enableFuzzySearch: true             // Typo-tolerant search
},

content: {
  enableMDX: true,                    // Support React components
  syntaxHighlighting: true,           // Code syntax highlighting
  copyCodeButton: true                // Copy buttons on code blocks
}
```

## File Organization

QuickDoc automatically organizes your content:

```
src/pages/
├── quickstart/           # This quick start guide
├── my-docs/             # Your documentation section
│   ├── index.md         # Main page
│   ├── getting-started.md
│   └── advanced.mdx     # With React components
└── api-reference/       # Another section
    ├── index.md
    └── endpoints.md
```

Each folder becomes a **tab** in the navigation, and files within folders become **sidebar items**.

## Key Features Overview

### 🎨 **Theme System**
- **Simplified colors**: Use Tailwind color names (`emerald`, `blue`, `purple`)
- **Auto dark mode**: Automatic light/dark theme switching
- **Consistent styling**: All components respect your theme

### 🧭 **Smart Navigation**
- **Hierarchical numbering**: Optional 1., 1.1., 1.2. sidebar numbering
- **Breaking points**: Split long content into manageable pages
- **Cross-page linking**: Link directly to any section with `[text](/page#section)`

### 🔍 **Enhanced Search**
- **Fuzzy search**: Find content even with typos
- **Smart navigation**: Search results link directly to sections
- **Keyboard shortcuts**: Quick access with `/` key

### 📱 **Modern UI**
- **Floating toolbar**: Clean, modern action buttons
- **Responsive design**: Perfect on desktop and mobile
- **Resizable sidebar**: Users can adjust sidebar width

### ⚡ **Interactive Content**
- **MDX support**: Embed React components in documentation
- **Live examples**: Show working code alongside explanations
- **Theme-aware components**: Everything matches your color scheme

## Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to:
- **Netlify**: Automatic deployments from Git
- **Vercel**: Zero-config deployments
- **GitHub Pages**: Free hosting for open source
- **Any static host**: Upload the `dist/` folder

## Testing

Run the test suite to ensure everything works:

```bash
npm test                 # Run all tests
npm run test:ui          # Interactive test UI
npm run type-check       # TypeScript validation
```

## What's Next?

- 📖 **[QuickDoc Guide](/quickdoc)**: Comprehensive configuration and customization
- ✍️ **[Markdown Guide](/markdown-guide)**: Learn advanced markdown and MDX features  
- 🎨 **Customize themes**: Experiment with different color combinations
- 🧪 **Add interactive content**: Create engaging MDX components
- 🚀 **Deploy**: Share your documentation with the world

**Pro Tip**: Use the floating search button (🔍) or press `/` to quickly find any content in your documentation!
