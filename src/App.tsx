import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { defaultConfig } from "./config/app.config";
import { useMarkdownFiles } from "./hooks/useMarkdownFiles";
import { useAppState } from "./hooks/useAppState";
import { useTheme } from "./contexts/ThemeContext";
import { splitContentBySections } from "./utils/contentSplitter";
import { applyContentStyles } from "./utils/contentStyles";
import { applyBorderStyles } from "./utils/borderStyles";
import { applyFontStyles } from "./utils/fontStyles";
import { applyInlineCodeStyles } from "./utils/inlineCodeStyles";
import { applyMetaNavStyles } from "./utils/metaNavStyles";
import { initScrollHashUpdates, handleInitialHash } from "./utils/scrollHash";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";
import { TabNavigation } from "./components/TabNavigation";
import { Sidebar } from "./components/Sidebar";
import { MarkdownContent } from "./components/MarkdownContent";
import { MobileMenuButton } from "./components/MobileMenuButton";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { SearchButton } from "./components/SearchButton";
import { SearchDialog } from "./components/SearchDialog";
import { Pagination } from "./components/Pagination";
import { SEO } from "./components/SEO";
import "highlight.js/styles/github.css";

function App() {
  const [config] = useState(defaultConfig);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useTheme();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Load markdown files
  const { files, loading, error } = useMarkdownFiles(config.pagesPath);

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
    
    // First segment is the file slug
    const file = segments[0] || null;
    // Second segment (if exists) is the section slug within that file
    // Hash is used for scrolling within the section, not as the section itself
    const section: string | null = segments.length > 1 ? (segments[1] || null) : null;
    
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

  // Check if current path matches any valid file or section
  const isValidPath = useMemo(() => {
    if (loading || files.length === 0) return true; // Don't show 404 while loading
    
    const path = location.pathname;
    
    // Root path is always valid
    if (path === '/') return true;
    
    // Check if path starts with a valid file slug
    const pathSegments = path.slice(1).split('/');
    const fileSlug = pathSegments[0];
    
    return files.some(file => file.slug === fileSlug);
  }, [location.pathname, files, loading]);

  // Get current file content
  const currentFile = useMemo(() => files.find((f) => f.slug === state.currentFile), [files, state.currentFile]);

  // Split content into sections based on breaking points
  const contentSections = useMemo(() => {
    if (!currentFile) return [];
    return splitContentBySections(currentFile.content, config.navigation.breakingPoint);
  }, [currentFile, config.navigation.breakingPoint]);

  // Get main navigation
  const mainNavigation = useMemo(() => {
    if (!currentFile) return [];
    const sections = contentSections;

    return sections.map((section, idx) => ({
      id: `section-${idx}`,
      title: section.title,
      level: section.level,
      slug: section.slug,
      subsections: section.subsections,
    }));
  }, [contentSections, currentFile]);

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

  // Handle section changes
  const handleSectionChange = useCallback((slug: string) => {
    setCurrentSection(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setCurrentSection]);

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
    // Apply all config-based styles together
    applyBorderStyles(config);
    applyFontStyles(config);
    applyInlineCodeStyles(config);
    
    // Apply content styles if element is available
    if (mainContentRef.current) {
      applyContentStyles(config, mainContentRef.current);
    }
    
    // Apply meta nav styles based on files
    applyMetaNavStyles(files.length > 1);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading documentation...</p>
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "No documentation files found."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Make sure your Markdown files are in the <code>public/pages</code> directory.
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Meta Navigation */}
        {files.length > 1 && (
          <ErrorBoundary>
            <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between h-10 px-4">
                <div className="flex items-center flex-1 min-w-0">
                  <TabNavigation
                    files={files}
                    currentFile={state.currentFile}
                  />
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <SearchButton onClick={handleSearchOpen} />
                  <DarkModeToggle
                    isDark={isDark}
                    onToggle={toggleDarkMode}
                  />
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        <div className="flex">
          {/* Sidebar */}
          <ErrorBoundary>
            <Sidebar
              title={currentFile?.title ?? "Documentation"}
              navigation={mainNavigation}
              currentSection={state.currentSection || contentSections[0]?.slug || null}
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
              className="flex-1 min-w-0 flex"
              style={{
                padding: 'var(--content-margin-y)',
              }}
            >
              <div className="max-w-4xl mx-4 md:mx-6 lg:mx-8 xl:mx-12 w-full">
                {currentFile && currentSection ? (
                  <>
                    {/* Pagination - Top */}
                    {config.navigation.pagination.enabled && config.navigation.pagination.showOnTop && (
                      <ErrorBoundary>
                        <Pagination
                          sections={contentSections}
                          currentSection={state.currentSection || contentSections[0]?.slug || null}
                          onSectionChange={handleSectionChange}
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
                      />
                    </ErrorBoundary>

                    {/* Pagination - Bottom */}
                    {config.navigation.pagination.enabled && config.navigation.pagination.showOnBottom && (
                      <ErrorBoundary>
                        <Pagination
                          sections={contentSections}
                          currentSection={state.currentSection || contentSections[0]?.slug || null}
                          onSectionChange={handleSectionChange}
                          showOnTop={false}
                          showOnBottom={true}
                          config={config}
                        />
                      </ErrorBoundary>
                    )}
                  </>
                ) : currentFile ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">Select a document to view</p>
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
        />
      </div>
    </>
  );
}

export default App;
