# Quick Start

Get up and running with QuickDoc in minutes!

## Installation

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Setup

```bash
# Clone or create your project
npm create vite@latest my-docs -- --template react-ts

# Navigate to project
cd my-docs

# Install QuickDoc dependencies
npm install marked highlight.js react-router-dom
```

## Project Structure

```
my-docs/
├── public/
│   └── pages/           # Your markdown files go here
│       ├── README.md
│       ├── Guide.md
│       └── API.md
├── src/
│   ├── components/      # QuickDoc components
│   ├── config/          # Configuration
│   ├── hooks/           # React hooks
│   ├── utils/           # Utilities
│   └── App.tsx
└── package.json
```

## Creating Your First Page

### Step 1: Create a Markdown File

Create a new file in `/public/pages/Getting-Started.md`:

```markdown
# Getting Started

Welcome to my documentation!

## Introduction

This is my first documentation page.

## Installation

Follow these steps...
```

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: View Your Docs

Open `http://localhost:5173` in your browser. You should see your new page as a tab!

## Writing Documentation

### Headings

Use H1 for the page title (appears in tab):

```markdown
# My Page Title
```

Use H2 for main sections (appears in sidebar):

```markdown
## Section Title
```

Use H3-H6 for subsections:

```markdown
### Subsection
#### Sub-subsection
```

### Code Blocks

Use triple backticks with language for syntax highlighting:

````markdown
```javascript
const hello = () => console.log('Hello!');
```
````

### Links

Internal links (to sections):

```markdown
[Go to Installation](#installation)
```

External links:

```markdown
[Visit GitHub](https://github.com)
```

### Images

```markdown
![Screenshot](/images/screenshot.png)
```

## Configuration

### Basic Configuration

Edit `src/config/app.config.ts`:

```typescript
export const defaultConfig: AppConfig = {
  navigation: {
    breakingPoint: 'h2',  // Which heading level creates nav items
    showH1InSidebar: true,
    collapsible: false,
  },
  theme: {
    colors: {
      primary: '#111827',
      accent: '#2563eb',
      // ... more colors
    },
  },
};
```

### Navigation Breakpoints

Choose which heading level creates navigation items:

- `h1` - Every H1 is a nav item (not recommended)
- `h2` - Every H2 is a nav item (default, recommended)
- `h3` - Every H3 is a nav item
- `h4` - Every H4 is a nav item

### Theme Customization

Customize colors, fonts, and spacing:

```typescript
theme: {
  colors: {
    primary: '#your-color',
    accent: '#your-accent',
  },
  fonts: {
    sans: 'Your Font, sans-serif',
    mono: 'Your Mono Font, monospace',
    size: 'medium', // small, medium, large
  },
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Tips & Tricks

### File Naming

- Use descriptive names: `Getting-Started.md` instead of `page1.md`
- Hyphens become spaces in tabs: `Quick-Start.md` → "Quick Start"
- Files are sorted alphabetically

### URL Structure

- Files: `#filename`
- Sections: `#filename/section-slug`
- Example: `#quick-start/installation`

### Mobile Navigation

- Tap the floating button (bottom-left) to open the sidebar
- Tap outside to close
- Smooth scrolling on all devices

## Next Steps

Now that you're set up, explore:

- Advanced configuration options
- MDX support for interactive components
- Custom styling and theming
- API documentation best practices
