import { useState, useMemo, useEffect, useRef } from "react";
import { defaultConfig } from "./config/app.config";
import { useMarkdownFiles } from "./hooks/useMarkdownFiles";
import { useAppState } from "./hooks/useAppState";
import { useTheme } from "./contexts/ThemeContext";
import { splitContentBySections } from "./utils/contentSplitter";
import { applyContentStyles } from "./utils/contentStyles";
import { applyBorderStyles } from "./utils/borderStyles";
import { TabNavigation } from "./components/TabNavigation";
import { Sidebar } from "./components/Sidebar";
import { MarkdownContent } from "./components/MarkdownContent";
import { MobileMenuButton } from "./components/MobileMenuButton";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { SearchButton } from "./components/SearchButton";
import { SearchDialog } from "./components/SearchDialog";
import { SEO } from "./components/SEO";
import "highlight.js/styles/github.css";

function App() {
  const [config] = useState(defaultConfig);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useTheme();
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Apply content styles from config
  useEffect(() => {
    if (mainContentRef.current) {
      applyContentStyles(config, mainContentRef.current);
    }
    applyBorderStyles(config);
  }, [config, mainContentRef.current]);

  // Ensure styles are applied after component mounts
  useEffect(() => {
    if (mainContentRef.current) {
      applyContentStyles(config, mainContentRef.current);
    }
    applyBorderStyles(config);
  }, []);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load markdown files
  const { files, loading, error } = useMarkdownFiles(config.pagesPath, config);

  // Get default file (first file)
  const defaultFile = files[0]?.slug ?? null;

  // Manage app state with URL and localStorage sync
  const { state, setCurrentFile, setCurrentSection } = useAppState(defaultFile);

  // Get current file content
  const currentFile = useMemo(() => files.find((f) => f.slug === state.currentFile), [files, state.currentFile]);

  // Split content into sections based on breaking points
  const contentSections = useMemo(() => {
    if (!currentFile) return [];
    return splitContentBySections(currentFile.content, config.navigation.breakingPoint);
  }, [currentFile, config.navigation.breakingPoint]);

  // Get main navigation (H1 + breaking point headings with subsections)
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
  }, [contentSections]);

  // Get current section content
  const currentSection = useMemo(() => {
    if (!state.currentSection) {
      // No section selected, show first section or intro
      return contentSections[0] || null;
    }
    return contentSections.find((s) => s.slug === state.currentSection) || contentSections[0] || null;
  }, [contentSections, state.currentSection]);

  // Handle section changes (navigate to different breaking point section)
  const handleSectionChange = (slug: string) => {
    setCurrentSection(slug);
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <div className="text-center max-w-md p-6">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Documentation Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "Please add Markdown files to the /public/pages directory."}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Supported formats: .md, .mdx</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO */}
      <SEO
        title={currentFile?.title ?? "Documentation"}
        description={`${currentFile?.title ?? "Documentation"} - QuickDoc Framework`}
        keywords={["documentation", "markdown", currentFile?.slug ?? ""]}
      />

      {/* Header with Tab Navigation and Dark Mode Toggle */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <TabNavigation
            files={files}
            currentFile={state.currentFile}
            onFileChange={setCurrentFile}
          />
          <div className="pr-4 flex items-center gap-2">
            <SearchButton onClick={() => setIsSearchOpen(true)} />
            <DarkModeToggle
              isDark={isDark}
              onToggle={toggleDarkMode}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Main Navigation (Breaking Points) */}
        <Sidebar
          title={currentFile?.title ?? "Documentation"}
          navigation={mainNavigation}
          currentSection={state.currentSection || contentSections[0]?.slug || null}
          onSectionChange={handleSectionChange}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          config={config}
        />

        {/* Main Content */}
        <main 
          ref={mainContentRef}
          className="flex-1 min-w-0 flex"
          style={{
            padding: 'var(--content-margin-y)',
          }}
        >
          <div className="max-w-4xl mx-4 md:mx-6 lg:mx-8 xl:mx-12 w-full">
            {currentSection ? (
              <>
                {/* Section Content - H1 is already in the markdown */}
                <MarkdownContent
                  content={currentSection.content}
                  config={config}
                />
              </>
            ) : currentFile ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Select a section to view</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Select a document to view</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Menu Button */}
      <MobileMenuButton
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isOpen={isMobileMenuOpen}
      />

      {/* Search Dialog */}
      <SearchDialog
        files={files}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default App;
