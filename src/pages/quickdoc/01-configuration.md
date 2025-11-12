# Configuration

All configuration is managed through `src/config/app.config.ts`.

## Basic Settings

```typescript
export const defaultConfig: AppConfig = {
  // Site metadata
  site: {
    title: 'QuickDoc',
    description: 'Fast and beautiful documentation',
    author: 'Your Name',
    url: 'https://yourdomain.com',
  },
  
  // Navigation settings
  navigation: {
    breakingPoint: 'h2', // h1, h2, h3, or h4
    showH1InSidebar: false, // Hide H1 headings in sidebar
    collapsible: false,
    expandAllSections: false, // Keep all sidebar sections collapsed by default
  }
}
```

## Advanced Configuration

### Theme Settings
Configure colors, fonts, and visual appearance.

### Navigation Options
Control sidebar behavior and page breaking points.

### Content Settings
Manage how content is processed and displayed.
