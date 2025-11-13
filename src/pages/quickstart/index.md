# Quick Start

Get up and running with QuickDoc in minutes.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/LucaIsMyName/quickdoc.react.git
cd quickdoc.react
npm install
```

## Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your documentation site.

## Add Your Content

Create Markdown files in `src/pages/`:

```bash
# Create a new section
mkdir src/pages/my-docs
echo "# My Documentation

Welcome to my docs!" > src/pages/my-docs/index.md
```

## Basic Configuration

Edit `src/config/app.config.ts`:

```typescript
export const defaultConfig: AppConfig = {
  site: {
    title: 'My Documentation',
    description: 'Project documentation',
    author: 'Your Name',
  },
  theme: {
    colors: {
      accent: "blue",     // Accent color
      light: "gray",      // Light mode base
      dark: "slate"       // Dark mode base
    }
  }
}
```

## File Structure

```
src/pages/
├── my-docs/
│   ├── index.md         # Main page
│   └── guide.md         # Additional pages
└── api/
    └── index.md
```

Each folder becomes a navigation tab, files become sidebar items.

## Build & Deploy

```bash
npm run build           # Creates dist/ folder
```

Deploy the `dist/` folder to any static hosting service.

## What's Next?

**For detailed configuration and advanced features:**
- **[QuickDoc Guide](/quickdoc)** - Complete documentation
- **[Markdown Guide](/markdown-guide)** - Writing and formatting
- **[Configuration](/quickdoc/configuration)** - All options
- **[File Structure](/quickdoc/file-structure)** - Organization
- **[Deployment](/quickdoc/deployment)** - Publishing options
