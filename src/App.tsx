import { useState, useMemo } from 'react';
import { defaultConfig } from './config/app.config';
import { useMarkdownFiles } from './hooks/useMarkdownFiles';
import { useAppState } from './hooks/useAppState';
import { extractNavigation } from './utils/markdown';
import { TabNavigation } from './components/TabNavigation';
import { Sidebar } from './components/Sidebar';
import { MarkdownContent } from './components/MarkdownContent';
import { MobileMenuButton } from './components/MobileMenuButton';
import 'highlight.js/styles/github.css';

function App() {
  const [config] = useState(defaultConfig);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Load markdown files
  const { files, loading, error } = useMarkdownFiles(config.pagesPath);
  
  // Get default file (first file)
  const defaultFile = files[0]?.slug ?? null;
  
  // Manage app state with URL and localStorage sync
  const { state, setCurrentFile, setCurrentSection } = useAppState(defaultFile);
  
  // Get current file content
  const currentFile = useMemo(
    () => files.find((f) => f.slug === state.currentFile),
    [files, state.currentFile]
  );
  
  // Extract navigation from current file
  const navigation = useMemo(
    () => currentFile ? extractNavigation(currentFile.content, config.navigation.breakingPoint) : [],
    [currentFile, config.navigation.breakingPoint]
  );
  
  // Handle section changes (scroll to heading)
  const handleSectionChange = (slug: string) => {
    setCurrentSection(slug);
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Documentation Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Please add Markdown files to the /public/pages directory.'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Supported formats: .md, .mdx
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <TabNavigation
        files={files}
        currentFile={state.currentFile}
        onFileChange={setCurrentFile}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          title={currentFile?.title ?? 'Documentation'}
          navigation={navigation}
          currentSection={state.currentSection}
          onSectionChange={handleSectionChange}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12">
            {currentFile ? (
              <MarkdownContent
                content={currentFile.content}
                config={config}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a document to view
                </p>
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
    </div>
  );
}

export default App;
