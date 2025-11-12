# Development

## Project Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## Dependencies

### Core Dependencies
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### UI Libraries
- **Base UI**: Accessible, unstyled React components (Popover)
- **Lucide React**: Modern icon library with consistent design

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Add content**: Create/edit Markdown files in `src/pages/`
3. **Configure**: Modify `src/config/app.config.ts`
4. **Test**: Verify functionality in browser
5. **Build**: `npm run build` before deployment

## Hot Reload

The development server supports hot reload for:
- Markdown content changes
- Configuration updates
- Component modifications
