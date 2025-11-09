import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundProps {
  availableFiles?: Array<{ slug: string; title: string; }>;
  currentPath?: string;
}

export const NotFound = ({ availableFiles = [], currentPath }: NotFoundProps) => {
  const is404File = currentPath && !availableFiles.some(file => currentPath.startsWith(`/${file.slug}`));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">404</div>
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {is404File ? 'Page Not Found' : 'Section Not Found'}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {is404File 
              ? "The page you're looking for doesn't exist in our documentation."
              : "The section you're looking for doesn't exist on this page."
            }
          </p>
        </div>

        {/* Current Path */}
        {currentPath && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Requested path:</p>
            <code className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {currentPath}
            </code>
          </div>
        )}

        {/* Available Pages */}
        {availableFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Available Documentation:
            </h3>
            <div className="space-y-2">
              {availableFiles.map((file) => (
                <Link
                  key={file.slug}
                  to={`/${file.slug}`}
                  className="block p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {file.title}
                    </span>
                    <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Try searching instead
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Use Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open the search dialog
          </p>
        </div>
      </div>
    </div>
  );
};
