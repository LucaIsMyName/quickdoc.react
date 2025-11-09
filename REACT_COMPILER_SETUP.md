# React Compiler Setup

## Overview

The React Compiler is an experimental build-time tool that automatically optimizes React components by generating memoization code. It's currently disabled due to compatibility issues but can be enabled when stable.

## Installation

The React Compiler is already installed as a dev dependency:

```bash
npm install --save-dev babel-plugin-react-compiler
```

## Configuration

To enable the React Compiler, uncomment the babel configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}],
        ],
      },
    }),
  ],
  // ... rest of config
});
```

## Current Status

**Status**: Disabled (commented out)
**Reason**: Build compatibility issues with current React version
**Error**: Missing "./compiler-runtime" specifier in "react" package

## When to Enable

Enable the React Compiler when:
1. React 19+ is stable and widely adopted
2. The compiler-runtime is included in React core
3. All dependencies are compatible

## Benefits (When Working)

- **Automatic Memoization**: Eliminates need for manual `useMemo`, `useCallback`
- **Performance Optimization**: Reduces unnecessary re-renders
- **Bundle Size**: May reduce bundle size by optimizing component code
- **Developer Experience**: Less boilerplate memoization code

## Alternative Optimizations

While the React Compiler is disabled, use these manual optimizations:

1. **React.memo()** for component memoization
2. **useMemo()** for expensive calculations
3. **useCallback()** for stable function references
4. **React Scan** for performance monitoring (already enabled in dev)

## React Scan Integration

React Scan is enabled in development mode for performance monitoring:

```typescript
// In main.tsx
if (process.env.NODE_ENV === 'development') {
  import('react-scan').then(({ scan }) => {
    scan({
      enabled: true,
      log: true,
      showToolbar: true,
    });
  });
}
```

This provides:
- Performance metrics in console
- Visual toolbar showing render information
- Component re-render tracking
- Performance bottleneck identification

## Future Updates

Monitor these resources for React Compiler updates:
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [React Compiler GitHub](https://github.com/facebook/react/tree/main/compiler)
- React team announcements and blog posts
