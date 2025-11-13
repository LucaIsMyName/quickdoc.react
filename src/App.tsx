import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { defaultConfig } from "./config/app.config";
import { useMarkdownFiles } from "./hooks/useMarkdownFiles";
import { useAppState } from "./hooks/useAppState";
import { useTheme } from "./contexts/ThemeContext";
import { applyContentStyles } from "./utils/contentStyles";
import { applyBorderStyles } from "./utils/borderStyles";
import { applyFontStyles } from "./utils/fontStyles";
import { applyInlineCodeStyles } from "./utils/inlineCodeStyles";
import { applyMetaNavStyles } from "./utils/metaNavStyles";
import { applyColorStyles } from "./utils/colorStyles";
import { applyCodeBlockStyles } from "./utils/codeBlockStyles";
import { applyCopyButtonStyles } from "./utils/copyButtonStyles";
import { applyFooterStyles } from "./utils/footerStyles";
import { initScrollHashUpdates, handleInitialHash } from "./utils/scrollHash";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";
import { TabNavigation } from "./components/TabNavigation";
import { Sidebar } from "./components/Sidebar";
import { MarkdownContent } from "./components/MarkdownContent";
import { MobileMenuButton } from "./components/MobileMenuButton";
import { SearchDialog } from "./components/SearchDialog";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { Pagination } from "./components/Pagination";
// import { ExportButton } from "./components/ExportButton";
import { SEO } from "./components/SEO";
import "highlight.js/styles/github.css";

// Helper function to extract TOC from content (H2-H6, excluding H1 since it's the file title)
const extractTOCFromContent = (content: string, fileSlug: string) => {
  const lines = content.split('\n');
  const items: any[] = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    // Track fenced code block boundaries
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    // Skip if inside fenced code block
    if (inCodeBlock) {
      continue;
    }
    
    // Skip indented code blocks (4+ spaces at start of line)
    if (line.match(/^    /)) {
      continue;
    }
    
    // Extract headings - preserve inline code in headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 0;
      const title = headingMatch[2]?.trim() ?? '';
      
      // Only include H2-H6 headings (exclude H1)
      if (level >= 2 && level <= 6 && title) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        items.push({
          id: `${fileSlug}-heading-${items.length}`, // UNIQUE ID per file
          title,
          level,
          slug,
          subsections: []
        });
      }
    }
  }

  return items;
};

function App() {
  const [config] = useState(defaultConfig);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useTheme();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Load markdown files
  const { files, loading, error } = useMarkdownFiles(config.pagesPath, config);

  // Get default file (first file) - moved before useAppState
  const defaultFile = files[0]?.slug ?? null;

  // Manage app state with URL and localStorage sync
  const { state, setCurrentFile, setCurrentSection } = useAppState(defaultFile);

  // Sync app state when React Router location changes (only for external navigation)
  useEffect(() => {
    const path = location.pathname.slice(1); // Remove leading /
    
    if (!path || path === '') {
      return;
    }

    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) {
      return;
    }
    
    // For folder/file structure: segments[0] is folder, segments[1] is file (if exists)
    // If only one segment, it's either a root file or a folder index
    // If two segments, it's folder/file
    const file = segments.length > 1 ? `${segments[0]}/${segments[1]}` : segments[0] || null;
    // Section is now handled by hash, not URL segments
    const section: string | null = null;
    
    // More reliable comparison - check each field individually
    const fileChanged = file !== state.currentFile;
    const sectionChanged = section !== state.currentSection;
    
    if (fileChanged || sectionChanged) {
      if (fileChanged && file) {
        setCurrentFile(file);
      }
      if (sectionChanged) {
        setCurrentSection(section);
      }
    }
  }, [location.pathname, location.hash, setCurrentFile, setCurrentSection, state.currentFile, state.currentSection]);

  // Check if current path is valid (for 404 handling)
  const isValidPath = useMemo(() => {
    if (loading) return true; // Don't show 404 while loading
    
    const path = location.pathname;
    if (path === '/' || path === '') return true;
    
    // Check if path matches any file slug (including folder/file structure)
    const pathSegments = path.slice(1).split('/').filter(Boolean);
    const fullSlug = pathSegments.length > 1 ? `${pathSegments[0]}/${pathSegments[1]}` : pathSegments[0] || '';
    
    return files.some(file => file.slug === fullSlug);
  }, [location.pathname, files, loading]);

  // Get current file content
  const currentFile = useMemo(() => files.find((f) => f.slug === state.currentFile), [files, state.currentFile]);

  // No content splitting needed - each file is already a separate page
  const contentSections = useMemo(() => {
    if (!currentFile) return [];
    
    // Create a single section from the current file
    return [{
      slug: 'content',
      title: currentFile.title,
      content: currentFile.content,
      level: 1,
      subsections: []
    }];
  }, [currentFile]);

  // Get folder-based navigation for tabs and sidebar
  const { folderNavigation, sidebarNavigation } = useMemo(() => {
    // Group files by folder
    const folderGroups = new Map<string, typeof files>();
    const rootFiles: typeof files = [];
    
    files.forEach(file => {
      const pathParts = file.path.split('/');
      const isInFolder = pathParts.length > 3;
      
      if (isInFolder) {
        const folderName = pathParts[pathParts.length - 2] ?? 'unknown';
        if (!folderGroups.has(folderName)) {
          folderGroups.set(folderName, []);
        }
        folderGroups.get(folderName)?.push(file);
      } else {
        rootFiles.push(file);
      }
    });
    
    // Create folder navigation for tabs (only folders/root files)
    const folderNav: any[] = [];
    
    // Add root files to folder navigation
    rootFiles.forEach(file => {
      folderNav.push({
        slug: file.slug,
        title: file.title,
        isFolder: false,
      });
    });
    
    // Add folders to folder navigation
    folderGroups.forEach((folderFiles, folderName) => {
      const indexFile = folderFiles.find(f => f.path.includes('index.'));
      const folderTitle = indexFile?.title || folderName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      folderNav.push({
        slug: indexFile?.slug || folderFiles[0]?.slug || folderName,
        title: folderTitle,
        isFolder: true,
        folderName,
      });
    });
    
    // Create sidebar navigation (files within current folder)
    const sidebarNav: any[] = [];
    
    if (currentFile) {
      // Find which folder the current file belongs to
      const currentFileObj = files.find(f => f.slug === state.currentFile);
      if (currentFileObj) {
        const pathParts = currentFileObj.path.split('/');
        const isInFolder = pathParts.length > 3;
        
        if (isInFolder) {
          const folderName = pathParts[pathParts.length - 2] ?? 'unknown';
          const folderFiles = folderGroups.get(folderName) || [];
          
          // Sort folder files: index first, then by numeric prefix
          const sortedFolderFiles = [...folderFiles].sort((a, b) => {
            const aIsIndex = a.path.includes('index.');
            const bIsIndex = b.path.includes('index.');
            
            // Index file always comes first
            if (aIsIndex && !bIsIndex) return -1;
            if (!aIsIndex && bIsIndex) return 1;
            
            // For non-index files, sort by numeric prefix
            const aFilename = a.path.split('/').pop() ?? '';
            const bFilename = b.path.split('/').pop() ?? '';
            const aPrefix = aFilename.match(/^(\d+)-/)?.[1];
            const bPrefix = bFilename.match(/^(\d+)-/)?.[1];
            const aOrder = aPrefix ? parseInt(aPrefix, 10) : 999;
            const bOrder = bPrefix ? parseInt(bPrefix, 10) : 999;
            
            if (aOrder !== bOrder) {
              return aOrder - bOrder;
            }
            
            // Fallback to alphabetical
            return aFilename.localeCompare(bFilename);
          });
          
          sortedFolderFiles.forEach(file => {
            // Always extract TOC from file content for proper sidebar navigation
            const subsections = extractTOCFromContent(file.content, file.slug);
            
            const isIndex = file.path.includes('index.');
              
            sidebarNav.push({
              id: file.slug,
              title: file.title,
              level: 1,
              slug: file.slug,
              subsections,
              isIndex, // Mark index files for special styling
            });
          });
        } else {
          // Root file - show just this file with TOC
          sidebarNav.push({
            id: currentFileObj.slug,
            title: currentFileObj.title,
            level: 1,
            slug: currentFileObj.slug,
            subsections: extractTOCFromContent(currentFileObj.content, currentFileObj.slug),
          });
        }
      }
    }
    
    return { folderNavigation: folderNav, sidebarNavigation: sidebarNav };
  }, [files, currentFile]);

  // Legacy mainNavigation for compatibility
  const mainNavigation = sidebarNavigation;

  // Get current section content
  const currentSection = useMemo(() => {
    if (!state.currentSection) {
      return contentSections[0] || null;
    }
    return contentSections.find((s) => s.slug === state.currentSection) || contentSections[0] || null;
  }, [contentSections, state.currentSection]);

  // Memoize the available files for 404 page to prevent unnecessary re-renders
  const availableFiles = useMemo(() => 
    files.map(f => ({ slug: f.slug, title: f.title })), 
    [files]
  );


  // Memoize mobile menu handlers
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoize search handlers
  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Consolidated style application - avoid duplicate calls
  useEffect(() => {
    applyContentStyles(config, mainContentRef.current);
    applyBorderStyles(config);
    applyFontStyles(config);
    applyInlineCodeStyles(config);
    applyMetaNavStyles(files.length > 1);
    applyColorStyles(config);
    applyCodeBlockStyles(config);
    applyCopyButtonStyles(config);
    applyFooterStyles(config);
  }, [config, files.length]); // Consolidated dependencies

  // Initialize scroll-based hash updates
  useEffect(() => {
    const cleanup = initScrollHashUpdates();
    handleInitialHash();
    return cleanup;
  }, []);

  // Handle hash scrolling when currentFile or currentSection changes
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 200);
    }
  }, [state.currentFile, state.currentSection]);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle React Router location changes
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meta-nav-height')) || 40;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 150);
    }
  }, [location]);

  // Early returns for loading and error states - now after all hooks are called
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-bg-secondary">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 theme-accent-border border-t-transparent rounded-full mb-4" />
          <p className="theme-text-secondary">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error || files.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Documentation Not Available
          </h1>
          <p className="theme-text-secondary mb-4">
            {error || "No documentation files found."}
          </p>
          <p className="text-sm theme-text-secondary">
            Make sure your Markdown/MDX files are in the <code>src/pages</code> directory.
          </p>
        </div>
      </div>
    );
  }

  if (!isValidPath) {
    return (
      <NotFound 
        availableFiles={availableFiles}
        currentPath={location.pathname}
      />
    );
  }

  return (
    <>
      <SEO 
        title={currentFile?.title ? `${currentFile.title} - ${config.site.title}` : config.site.title}
        description={config.site.description}
        author={config.site.author}
      />

      <div className="min-h-screen theme-bg transition-colors duration-200">
        {/* Meta Navigation */}
        {files.length > 1 && (
          <ErrorBoundary>
            <div className="sticky top-0 z-50 theme-bg border-b theme-border">
              <div className="flex items-center justify-between h-10">
                <div className="flex items-center flex-1 min-w-0">
                  <TabNavigation
                    folderNavigation={folderNavigation}
                    currentFile={state.currentFile}
                    config={config}
                  />
                </div>
                
                {/* Removed buttons - now in FloatingToolbar */}
              </div>
            </div>
          </ErrorBoundary>
        )}

        <div className="md:flex">
          {/* Sidebar */}
          <ErrorBoundary>
            <Sidebar
              navigation={mainNavigation}
              isOpen={isMobileMenuOpen}
              onClose={handleMobileMenuClose}
              config={config}
              currentFile={state.currentFile}
            />
          </ErrorBoundary>

          {/* Main Content */}
          <ErrorBoundary>
            <main 
              ref={mainContentRef}
              className="w-full md:flex-1 min-w-0 flex"
              style={{
                padding: 'var(--content-margin-y)',
                justifyContent: 'var(--content-justify)',
              }}
            >
              <div 
                className="w-full flex-1 px-4 md:mx-6 lg:mx-8 xl:mx-12 md:w-auto md:px-0"
                style={{
                  maxWidth: 'min(100%, var(--content-max-width))',
                }}
              >
                {currentFile && currentSection ? (
                  <>
                    {/* Pagination - Top */}
                    {config.navigation.pagination.enabled && config.navigation.pagination.showOnTop && (
                      <ErrorBoundary>
                        <Pagination
                          sections={contentSections}
                          currentSection={state.currentSection || contentSections[0]?.slug || null}
                          currentFile={state.currentFile}
                          showOnTop={true}
                          showOnBottom={false}
                          config={config}
                        />
                      </ErrorBoundary>
                    )}

                    {/* Section Content */}
                    <ErrorBoundary>
                      <MarkdownContent
                        content={currentSection.content}
                        config={config}
                        file={currentFile}
                        exportProps={{
                          content: currentSection.content,
                          title: currentSection.title,
                          filename: `${currentFile?.title || 'section'}-${currentSection.title}`
                        }}
                      />
                    </ErrorBoundary>

                    {/* Pagination - Bottom */}
                    {config.navigation.pagination.enabled && config.navigation.pagination.showOnBottom && (
                      <ErrorBoundary>
                        <Pagination
                          sections={contentSections}
                          currentSection={state.currentSection || contentSections[0]?.slug || null}
                          currentFile={state.currentFile}
                          showOnTop={false}
                          showOnBottom={true}
                          config={config}
                        />
                      </ErrorBoundary>
                    )}
                  </>
                ) : currentFile ? (
                  <div className="text-center py-12">
                    <p className="theme-text-secondary">Loading content...</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="theme-text-secondary">Select a document to view</p>
                  </div>
                )}
              </div>
            </main>
          </ErrorBoundary>
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          onClick={handleMobileMenuToggle}
        />

        {/* Search Dialog */}
        <SearchDialog
          isOpen={isSearchOpen}
          onClose={handleSearchClose}
          files={files}
          config={config}
        />

        {/* Floating Toolbar */}
        <FloatingToolbar
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
          onSearchOpen={handleSearchOpen}
          exportProps={currentFile && currentSection ? {
            content: currentSection.content,
            title: currentSection.title,
            filename: `${currentFile.title || 'section'}-${currentSection.title}`
          } : undefined}
        />
      </div>
    </>
  );
}

export default App;