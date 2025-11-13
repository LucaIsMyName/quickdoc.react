# File Structure

```
quickdoc.react/
├── src/
│   ├── components/          # React components
│   │   ├── DarkModeToggle.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ExportButton.tsx
│   │   ├── FloatingToolbar.tsx    # New: Floating action toolbar
│   │   ├── MarkdownContent.tsx
│   │   ├── MobileMenuButton.tsx
│   │   ├── NotFound.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchButton.tsx
│   │   ├── SearchDialog.tsx       # Enhanced: Better navigation
│   │   ├── Sidebar.tsx            # Enhanced: Numbered navigation
│   │   └── TabNavigation.tsx
│   ├── config/             # Configuration files
│   │   ├── app.config.ts          # Main configuration
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAppState.ts
│   │   ├── useDocumentSearch.ts   # Enhanced: Fuzzy search
│   │   └── useMarkdownFiles.ts    # Enhanced: MDX support
│   ├── pages/              # Your documentation files
│   │   ├── quickdoc/              # QuickDoc documentation
│   │   ├── changelog/             # Version history
│   │   ├── Quick-Start.md
│   │   ├── Markdown-Guide.md
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── borderStyles.ts        # Border theme utilities
│   │   ├── codeBlockStyles.ts     # New: Theme-aware code styling
│   │   ├── colorStyles.ts         # Enhanced: Simplified color system
│   │   ├── contentStyles.ts
│   │   ├── copyButtonStyles.ts    # New: Theme-aware copy buttons
│   │   ├── fontStyles.ts
│   │   ├── inlineCodeStyles.ts
│   │   ├── mdxCompiler.ts         # MDX compilation utilities
│   │   ├── mdxParser.ts
│   │   ├── metaNavStyles.ts
│   │   ├── parseMarkdown.ts
│   │   └── scrollHash.ts
│   └── App.tsx
├── __tests__/              # Test files
│   ├── extractTOCFromContent.test.ts  # New: Heading extraction tests
│   └── ...
├── public/
│   ├── pages/              # Static documentation pages
│   └── _redirects          # Netlify redirects
├── package.json
├── vite.config.ts          # Enhanced: MDX plugin support
└── vitest.config.ts        # Testing configuration
```

## Key Directories

### `/src/pages/`
Place your Markdown and MDX files here. Each folder becomes a documentation section.
- Supports both `.md` and `.mdx` files
- Automatic navigation generation from headings
- Cross-page linking with hash navigation

### `/src/config/`
Configuration files for customizing QuickDoc behavior.
- `app.config.ts`: Main application configuration

### `/src/components/`
React components that make up the QuickDoc interface.
- **FloatingToolbar**: Modern floating action toolbar
- **SearchDialog**: Enhanced search with fuzzy matching
- **Sidebar**: Hierarchical numbered navigation
- All components are theme-aware and responsive

### `/src/utils/`
Theme and styling utilities that make QuickDoc highly customizable.
- **Color system**: Simplified Tailwind-based theming
- **Code styling**: Theme-aware code blocks and copy buttons
- **Border system**: Configurable borders and radius
- **MDX support**: Runtime MDX compilation and parsing

### `/__tests__/`
Test files ensuring QuickDoc functionality works correctly.
- Unit tests for core features
- Regression tests for bug fixes
