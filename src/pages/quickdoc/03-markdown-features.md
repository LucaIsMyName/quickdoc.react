# Markdown Features

## Code Blocks

QuickDoc supports syntax highlighting with theme-aware styling:

```javascript
function example() {
  console.log("Hello, QuickDoc!");
}
```

### Theme-Aware Code Styling
- **Background colors**: Code blocks automatically match your theme configuration
- **Consistent styling**: Inline code and fenced code blocks use the same background
- **Light/Dark mode**: Automatic color adjustments for both modes
- **Copy buttons**: Theme-aware copy buttons with configurable borders and radius

### Copy to Clipboard
All code blocks include a copy button that:
- Respects your theme's border radius setting (`none`, `sm`, `md`, `lg`)
- Uses theme colors for hover states and feedback
- Positioned correctly with `relative` containers
- Smooth animations and visual feedback

## Inline Code

Inline code like `src/config/app.config.ts` now matches the theme:
- Same background color as fenced code blocks
- Proper contrast in both light and dark modes
- Configurable borders based on theme settings

## MDX Support

QuickDoc now supports MDX files with React components:

```mdx
# Interactive Content

<Counter initialValue={5} />

<Alert type="info">
  This is an interactive alert component!
</Alert>
```

### MDX Features
- **React components**: Embed interactive React components in your documentation
- **Runtime compilation**: MDX is compiled at runtime for maximum flexibility
- **Section splitting**: MDX content is properly split into sections for navigation
- **Error handling**: Graceful fallbacks for compilation errors

## Links and Navigation

### Internal Links
Link to other pages and sections with enhanced navigation:
```markdown
[Configuration](/quickdoc/configuration)
[Cross-page anchor](/quickdoc/configuration#theme-settings)
```

### Search Integration
- **Enhanced search**: Optional fuzzy search with typo tolerance
- **Proper navigation**: Search results link directly to sections with URL anchors
- **Context awareness**: Search finds parent headings for paragraph matches

### External Links
Standard markdown links work as expected and use theme accent colors:
```markdown
[GitHub](https://github.com)
```

## Tables

| Feature | Status | Theme Support |
|---------|--------|---------------|
| Tables | ✅ | ✅ |
| Code blocks | ✅ | ✅ |
| Syntax highlighting | ✅ | ✅ |
| Copy buttons | ✅ | ✅ |
| MDX components | ✅ | ✅ |
| Fuzzy search | ✅ | ✅ |

## Lists and Formatting

- **Bold text** with theme-aware colors
- *Italic text* 
- `Inline code` with theme backgrounds
- ~~Strikethrough~~
- Links with accent colors

## Floating Toolbar

The new floating toolbar provides quick access to:
- **Export functions**: PDF and Markdown export
- **Search**: Global search with keyboard shortcuts
- **Dark mode toggle**: Theme switching
- **Responsive design**: Different layouts for desktop and mobile
