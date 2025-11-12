# File Structure

```
quickdoc.react/
├── src/
│   ├── components/          # React components
│   │   ├── MarkdownContent.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── config/             # Configuration files
│   │   └── app.config.ts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Your documentation files
│   │   ├── Quick-Start.md
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── App.tsx
├── public/
└── package.json
```

## Key Directories

### `/src/pages/`
Place your Markdown files here. Each folder becomes a documentation section.

### `/src/config/`
Configuration files for customizing QuickDoc behavior.

### `/src/components/`
React components that make up the QuickDoc interface.
