# Changelog

Changelog for the QuickDoc React versions.

## Overview

This changelog documents all notable changes to QuickDoc React. Each version is organized into separate pages for better navigation and readability.

## Version History

Navigate through the sidebar to see detailed changes for each version, including new features, bugfixes, and improvements.

## Known Issues

### High Priority
- **Mobile Layout Problems**: Hamburger toggle and sidebar item list have positioning issues on mobile devices
- **Sidebar Resize Handle**: `resizeSideWidthHandle` positioning inside `<Sidebar />` component is buggy and needs repositioning
- **Search Performance**: Fuzzy search algorithm needs optimization for better performance with large documentation sets

### Medium Priority  
- **Multi-Language Support**: Currently only supports single language documentation
- **Code Block Language Detection**: Some code blocks don't auto-detect language properly
- **Export Functionality**: PDF export could be improved with better formatting and styling
- **Theme Transitions**: Color theme switching could be smoother with better transition animations

### Low Priority
- **Keyboard Navigation**: Could benefit from better keyboard shortcuts for navigation
- **Print Styles**: Print CSS could be optimized for better documentation printing
- **SEO Optimization**: Meta tags and structured data could be enhanced

## Next Steps

### Immediate (v0.2.6)
- **Fix Mobile Layout**: Resolve hamburger menu and sidebar positioning issues
- **Repair Resize Handle**: Fix sidebar width control positioning and functionality
- **Optimize Search**: Improve fuzzy search performance and accuracy

### Short Term (v0.3.x)
- **Enhanced Theming**: Add more theme customization options and smoother transitions
- **Better Export**: Improve PDF export with custom styling and better formatting
- **Accessibility**: Add comprehensive ARIA labels and keyboard navigation support

### Medium Term (v0.4.x)
- **Multi-Language Support**: Implement i18n with language switching capabilities
- **Advanced Search**: Add search filters, categories, and better result highlighting
- **Plugin System**: Create extensible plugin architecture for custom functionality
