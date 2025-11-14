# Development

## Project Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm test             # Run test suite with Vitest
npm run test:ui      # Run tests with UI interface
```

## Dependencies

### Core Dependencies
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server with MDX plugin support
- **Tailwind CSS**: Utility-first CSS framework with dynamic theming

### UI Libraries
- **Base UI**: Accessible, unstyled React components (Popover, transitions)
- **Lucide React**: Modern icon library with consistent design
- **React Helmet Async**: Dynamic document head management

### MDX and Content
- **@mdx-js/mdx**: MDX compilation and runtime support
- **@mdx-js/react**: React integration for MDX
- **marked**: Markdown parsing and rendering
- **highlight.js**: Syntax highlighting for code blocks

### Development and Testing
- **Vitest**: Fast unit testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Additional Jest matchers
- **ESLint**: Code linting with React and TypeScript rules

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Add content**: Create/edit Markdown or MDX files in `src/pages/`
3. **Configure**: Modify `src/config/app.config.ts` for theming and behavior
4. **Test**: Run `npm test` to ensure functionality works
5. **Verify**: Check browser for visual and functional correctness
6. **Build**: `npm run build` before deployment

## Testing

QuickDoc includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test extractTOCFromContent.test.ts
```

### Test Coverage
- **Heading extraction**: Tests for proper markdown parsing and TOC generation
- **Theme utilities**: Tests for color system and styling functions
- **Component rendering**: Tests for React component functionality
- **Regression tests**: Tests to prevent previously fixed bugs

## Hot Reload

The development server supports hot reload for:
- Markdown and MDX content changes
- Configuration updates (theme, navigation, etc.)
- Component modifications
- Utility function changes
- CSS and styling updates

## Custom Vite Plugin

QuickDoc includes a custom Vite plugin for MDX support:
- **Raw MDX loading**: Loads MDX source for runtime compilation
- **Path resolution**: Resolves `/pages/` to `src/pages/`
- **Query parameters**: Uses `?mdx-raw` for raw content loading

## Theme Development

When developing custom themes:
1. **Use CSS variables**: All theme utilities use CSS custom properties
2. **Test both modes**: Verify light and dark mode appearance
3. **Check responsiveness**: Test on mobile and desktop
4. **Validate accessibility**: Ensure proper contrast ratios
5. **Test all components**: Verify sidebar, toolbar, search, etc.
