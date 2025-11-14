# Mermaid Diagram Implementation

## Overview

QuickDoc now supports Mermaid diagrams in both Markdown (.md) and MDX (.mdx) files. Diagrams are automatically detected and rendered with full theme support.

## Implementation Details

### 1. Dependencies
- **Package**: `mermaid` (v11.4.1)
- **Installation**: `npm install mermaid`

### 2. Components

#### Mermaid Component (`src/components/Mermaid.tsx`)
- Standalone React component for rendering Mermaid diagrams
- Props: `chart` (string), `id` (optional string)
- Features:
  - Automatic theme detection (light/dark)
  - Error handling with user-friendly messages
  - Unique ID generation for multiple diagrams
  - Re-renders on theme change

#### Integration in MarkdownContent (`src/components/MarkdownContent.tsx`)
- Automatic detection of code blocks with `language-mermaid` class
- Dynamic import of mermaid library (code splitting)
- Replaces code blocks with rendered diagrams
- Error handling for invalid syntax

### 3. Usage

#### In Markdown Files (.md)
```markdown
# My Document

\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`
```

#### In MDX Files (.mdx)
Two methods:

**Method 1: Code block (same as MD)**
```markdown
\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`
```

**Method 2: Direct component**
```mdx
import { Mermaid } from '../components';

<Mermaid chart={`
graph TD
    A[Start] --> B[End]
`} />
```

### 4. Features

- **Automatic rendering**: Detects and renders on page load
- **Theme support**: Adapts to light/dark mode
- **Error handling**: Shows helpful error messages for invalid syntax
- **Responsive**: Diagrams scale appropriately
- **All diagram types**: Supports all Mermaid diagram types:
  - Flowcharts
  - Sequence diagrams
  - Class diagrams
  - State diagrams
  - Git graphs
  - Pie charts
  - ER diagrams
  - Journey diagrams
  - And more

### 5. Technical Details

#### Rendering Process
1. MarkdownContent component detects `pre code.language-mermaid` elements
2. Dynamically imports mermaid library
3. Initializes with current theme
4. Renders diagram with unique ID
5. Replaces code block with rendered SVG
6. Handles errors gracefully

#### Theme Integration
- Checks `document.documentElement.classList.contains('dark')`
- Uses `theme: 'dark'` or `theme: 'default'`
- Re-renders when theme changes (via useEffect in component)

#### Performance
- Dynamic import for code splitting
- Only loads when mermaid blocks are present
- Lazy rendering with requestAnimationFrame
- Prevents duplicate rendering with `data-mermaid-rendered` attribute

### 6. Files Modified

- `src/components/Mermaid.tsx` (NEW)
- `src/components/MarkdownContent.tsx` (MODIFIED)
- `src/pages/components/index.ts` (MODIFIED)
- `src/pages/markdown-guide/04-mermaid-diagrams.md` (NEW)
- `package.json` (MODIFIED)

### 7. Documentation

Created comprehensive guide at `src/pages/markdown-guide/04-mermaid-diagrams.md` with:
- Examples of all major diagram types
- Usage instructions
- Tips and best practices
- External resources

## Testing

To test Mermaid support:

1. Navigate to "Markdown Guide" → "Mermaid Diagrams"
2. View various diagram examples
3. Toggle dark mode to see theme adaptation
4. Try creating your own diagrams in MD or MDX files

## Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live)
- [Syntax Reference](https://mermaid.js.org/intro/syntax-reference.html)
